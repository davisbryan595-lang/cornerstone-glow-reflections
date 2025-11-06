async function callApi(action: string, payload?: any) {
  const res = await fetch("/api/mysql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error || res.statusText);
  return json.data;
}

export const mysqlDb = {
  profiles: {
    get: (user_id: string) => callApi("profiles_get", { user_id }),
    upsert: (profile: any) => callApi("profiles_upsert", { profile }),
    list: () => callApi("profiles_list"),
  },
  memberships: {
    get: (user_id: string) => callApi("memberships_get", { user_id }),
    getActive: (user_id: string) => callApi("memberships_getActive", { user_id }),
    upsert: (membership: any) => callApi("memberships_upsert", { membership }),
    list: () => callApi("memberships_list"),
    listActive: () => callApi("memberships_listActive"),
  },
  accessCodes: {
    create: (accessCode: any) => callApi("accessCodes_create", { accessCode }),
    get: (code: string) => callApi("accessCodes_get", { code }),
    getByMembership: (membership_id: string) => callApi("accessCodes_getByMembership", { membership_id }),
    listByUser: (user_id: string) => callApi("accessCodes_listByUser", { user_id }),
    listAll: () => callApi("accessCodes_listAll"),
    markAsUsed: (id: string) => callApi("accessCodes_markAsUsed", { id }),
  },
  discountCodes: {
    create: (discountCode: any) => callApi("discountCodes_create", { discountCode }),
    get: (code: string) => callApi("discountCodes_get", { code }),
    listAll: () => callApi("discountCodes_listAll"),
    listActive: () => callApi("discountCodes_listActive"),
    update: (code: string, updates: any) => callApi("discountCodes_update", { code, updates }),
    incrementUses: (code: string) => callApi("discountCodes_incrementUses", { code }),
  },
  health: () => callApi("health"),
};

export default mysqlDb;

export const isMySQLEnabled = import.meta.env.VITE_USE_MYSQL === "true";
