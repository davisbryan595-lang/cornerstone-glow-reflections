import type { IncomingMessage, ServerResponse } from "http";
import { createPool, Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

let pool: Pool | null = null;
let initialized = false;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.RAILWAY_DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL (or MYSQL_URL/RAILWAY_DATABASE_URL) is not set");
  return url;
}

function parseDatabaseUrl(url: string) {
  // mysql://user:pass@host:port/db?ssl=true
  const u = new URL(url);
  const [user, password] = (u.username ? [decodeURIComponent(u.username), decodeURIComponent(u.password)] : ["", ""]) as [string, string];
  const host = u.hostname;
  const port = Number(u.port || 3306);
  const database = u.pathname.replace(/^\//, "");
  const ssl = u.searchParams.get("ssl") === "true" || u.searchParams.get("sslmode") === "require";
  return { host, port, user, password, database, ssl };
}

function getPool(): Pool {
  if (pool) return pool;
  const cfg = parseDatabaseUrl(getDatabaseUrl());
  pool = createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    ssl: cfg.ssl ? { rejectUnauthorized: false } : undefined,
    connectionLimit: 10,
    connectTimeout: 10_000,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 5000,
    namedPlaceholders: true,
  });
  return pool;
}

async function ensureTables() {
  if (initialized) return;
  const conn = await getPool().getConnection();
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS profiles (
      user_id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255),
      role VARCHAR(32),
      marketing_opt_in TINYINT(1),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS memberships (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      plan_id VARCHAR(64),
      status VARCHAR(32),
      payment_status VARCHAR(32),
      access_code VARCHAR(64),
      next_billing_at DATETIME NULL,
      start_date DATETIME NULL,
      end_date DATETIME NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_memberships_user_id (user_id),
      CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS access_codes (
      id VARCHAR(255) PRIMARY KEY,
      code VARCHAR(64) UNIQUE,
      user_id VARCHAR(255),
      membership_id VARCHAR(255),
      plan_id VARCHAR(64),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NULL,
      used_at DATETIME NULL,
      is_used TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB`);

    await conn.query(`CREATE TABLE IF NOT EXISTS discount_codes (
      code VARCHAR(64) PRIMARY KEY,
      plan_id VARCHAR(64),
      discount_percentage INT,
      description VARCHAR(255),
      max_uses INT DEFAULT 0,
      current_uses INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NULL,
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB`);

    initialized = true;
  } finally {
    conn.release();
  }
}

async function json(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function send(res: any, status: number, data: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

async function handleAction(action: string, payload: any) {
  await ensureTables();
  const conn = await getPool().getConnection();
  try {
    switch (action) {
      case "health": {
        await conn.query("SELECT 1 AS ok");
        return { ok: true };
      }

      // Profiles
      case "profiles_get": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM profiles WHERE user_id = :user_id LIMIT 1", { user_id: payload.user_id });
        return rows[0] || null;
      }
      case "profiles_list": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM profiles ORDER BY created_at DESC");
        return rows;
      }
      case "profiles_upsert": {
        const p = payload.profile || {};
        await conn.query<ResultSetHeader>(
          `INSERT INTO profiles (user_id, email, role, marketing_opt_in)
           VALUES (:user_id, :email, :role, :marketing_opt_in)
           ON DUPLICATE KEY UPDATE email = VALUES(email), role = VALUES(role), marketing_opt_in = VALUES(marketing_opt_in)`,
          {
            user_id: p.user_id,
            email: p.email ?? null,
            role: p.role ?? null,
            marketing_opt_in: p.marketing_opt_in ? 1 : 0,
          }
        );
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM profiles WHERE user_id = :user_id", { user_id: p.user_id });
        return rows[0] || null;
      }

      // Memberships
      case "memberships_get": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM memberships WHERE user_id = :user_id ORDER BY updated_at DESC LIMIT 1", { user_id: payload.user_id });
        return rows[0] || null;
      }
      case "memberships_getActive": {
        const [rows] = await conn.query<RowDataPacket[]>(
          "SELECT * FROM memberships WHERE user_id = :user_id AND status = 'active' ORDER BY updated_at DESC LIMIT 1",
          { user_id: payload.user_id }
        );
        return rows[0] || null;
      }
      case "memberships_list": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM memberships ORDER BY updated_at DESC");
        return rows;
      }
      case "memberships_listActive": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM memberships WHERE status = 'active' ORDER BY updated_at DESC");
        return rows;
      }
      case "memberships_upsert": {
        const m = payload.membership || {};
        await conn.query<ResultSetHeader>(
          `INSERT INTO memberships (id, user_id, plan_id, status, payment_status, access_code, next_billing_at, start_date, end_date)
           VALUES (:id, :user_id, :plan_id, :status, :payment_status, :access_code, :next_billing_at, :start_date, :end_date)
           ON DUPLICATE KEY UPDATE
             plan_id = VALUES(plan_id), status = VALUES(status), payment_status = VALUES(payment_status), access_code = VALUES(access_code),
             next_billing_at = VALUES(next_billing_at), start_date = VALUES(start_date), end_date = VALUES(end_date)`,
          {
            id: m.id,
            user_id: m.user_id,
            plan_id: m.plan_id ?? null,
            status: m.status ?? null,
            payment_status: m.payment_status ?? null,
            access_code: m.access_code ?? null,
            next_billing_at: m.next_billing_at ? new Date(m.next_billing_at) : null,
            start_date: m.start_date ? new Date(m.start_date) : null,
            end_date: m.end_date ? new Date(m.end_date) : null,
          }
        );
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM memberships WHERE id = :id", { id: m.id });
        return rows[0] || null;
      }

      // Access Codes
      case "accessCodes_create": {
        const a = payload.accessCode || {};
        const id = a.id || `access-${Date.now()}`;
        await conn.query<ResultSetHeader>(
          `INSERT INTO access_codes (id, code, user_id, membership_id, plan_id, expires_at, used_at, is_used)
           VALUES (:id, :code, :user_id, :membership_id, :plan_id, :expires_at, :used_at, :is_used)
           ON DUPLICATE KEY UPDATE code = VALUES(code), user_id = VALUES(user_id), membership_id = VALUES(membership_id), plan_id = VALUES(plan_id),
             expires_at = VALUES(expires_at), used_at = VALUES(used_at), is_used = VALUES(is_used)`,
          {
            id,
            code: a.code,
            user_id: a.user_id ?? null,
            membership_id: a.membership_id ?? null,
            plan_id: a.plan_id ?? null,
            expires_at: a.expires_at ? new Date(a.expires_at) : null,
            used_at: a.used_at ? new Date(a.used_at) : null,
            is_used: a.is_used ? 1 : 0,
          }
        );
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes WHERE id = :id", { id });
        return rows[0] || null;
      }
      case "accessCodes_get": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes WHERE code = :code LIMIT 1", { code: payload.code });
        return rows[0] || null;
      }
      case "accessCodes_getByMembership": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes WHERE membership_id = :membership_id LIMIT 1", { membership_id: payload.membership_id });
        return rows[0] || null;
      }
      case "accessCodes_listByUser": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes WHERE user_id = :user_id ORDER BY created_at DESC", { user_id: payload.user_id });
        return rows;
      }
      case "accessCodes_listAll": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes ORDER BY created_at DESC");
        return rows;
      }
      case "accessCodes_markAsUsed": {
        await conn.query<ResultSetHeader>("UPDATE access_codes SET is_used = 1, used_at = CURRENT_TIMESTAMP WHERE id = :id", { id: payload.id });
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM access_codes WHERE id = :id", { id: payload.id });
        return rows[0] || null;
      }

      // Discount Codes
      case "discountCodes_create": {
        const d = payload.discountCode || {};
        await conn.query<ResultSetHeader>(
          `INSERT INTO discount_codes (code, plan_id, discount_percentage, description, max_uses, current_uses, expires_at, is_active)
           VALUES (:code, :plan_id, :discount_percentage, :description, :max_uses, :current_uses, :expires_at, :is_active)
           ON DUPLICATE KEY UPDATE plan_id = VALUES(plan_id), discount_percentage = VALUES(discount_percentage), description = VALUES(description),
             max_uses = VALUES(max_uses), current_uses = VALUES(current_uses), expires_at = VALUES(expires_at), is_active = VALUES(is_active)`,
          {
            code: d.code,
            plan_id: d.plan_id ?? null,
            discount_percentage: d.discount_percentage ?? 0,
            description: d.description ?? null,
            max_uses: d.max_uses ?? 0,
            current_uses: d.current_uses ?? 0,
            expires_at: d.expires_at ? new Date(d.expires_at) : null,
            is_active: d.is_active ? 1 : 0,
          }
        );
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM discount_codes WHERE code = :code", { code: d.code });
        return rows[0] || null;
      }
      case "discountCodes_get": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM discount_codes WHERE code = :code LIMIT 1", { code: payload.code });
        return rows[0] || null;
      }
      case "discountCodes_listAll": {
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM discount_codes ORDER BY created_at DESC");
        return rows;
      }
      case "discountCodes_listActive": {
        const [rows] = await conn.query<RowDataPacket[]>(
          "SELECT * FROM discount_codes WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) ORDER BY created_at DESC"
        );
        return rows;
      }
      case "discountCodes_update": {
        const u = payload.updates || {};
        await conn.query<ResultSetHeader>(
          `UPDATE discount_codes SET plan_id = COALESCE(:plan_id, plan_id), discount_percentage = COALESCE(:discount_percentage, discount_percentage),
           description = COALESCE(:description, description), max_uses = COALESCE(:max_uses, max_uses), current_uses = COALESCE(:current_uses, current_uses),
           expires_at = COALESCE(:expires_at, expires_at), is_active = COALESCE(:is_active, is_active) WHERE code = :code`,
          {
            code: payload.code,
            plan_id: u.plan_id ?? null,
            discount_percentage: u.discount_percentage ?? null,
            description: u.description ?? null,
            max_uses: u.max_uses ?? null,
            current_uses: u.current_uses ?? null,
            expires_at: u.expires_at ? new Date(u.expires_at) : null,
            is_active: typeof u.is_active === "boolean" ? (u.is_active ? 1 : 0) : null,
          }
        );
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM discount_codes WHERE code = :code", { code: payload.code });
        return rows[0] || null;
      }
      case "discountCodes_incrementUses": {
        await conn.query<ResultSetHeader>("UPDATE discount_codes SET current_uses = current_uses + 1 WHERE code = :code", { code: payload.code });
        const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM discount_codes WHERE code = :code", { code: payload.code });
        return rows[0] || null;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } finally {
    conn.release();
  }
}

export default async function handler(req: IncomingMessage & any, res: ServerResponse & any) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await json(req);
    const action = body?.action as string;
    const payload = body?.payload ?? {};
    if (!action) return send(res, 400, { error: "Missing action" });

    const result = await handleAction(action, payload);
    return send(res, 200, { data: result });
  } catch (e: any) {
    return send(res, 500, { error: e?.message || String(e) });
  }
}
