import React, { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthProvider";

function downloadCsv(filename: string, rows: any[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

const Admin: React.FC = () => {
  const supabase = useMemo(() => getSupabase(), []);
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ users: 0, members: 0 });
  const [recent, setRecent] = useState<{ email: string | null; created_at: string }[]>([]);

  useEffect(() => {
    async function load() {
      const [{ count: userCount }, { count: memberCount }, { data: recentUsers }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("memberships").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("email,created_at").order("created_at", { ascending: false }).limit(10),
      ] as any;
      setStats({ users: userCount ?? 0, members: memberCount ?? 0 });
      setRecent(recentUsers ?? []);
    }
    if (isAdmin) load();
  }, [isAdmin, supabase]);

  const exportUsers = async () => {
    const { data } = await supabase.from("profiles").select("user_id,email,role,marketing_opt_in,created_at");
    downloadCsv("users.csv", data ?? []);
  };
  const exportMembers = async () => {
    const { data } = await supabase.from("memberships").select("user_id,plan_id,status,payment_status,access_code,next_billing_at,start_date,end_date");
    downloadCsv("members.csv", data ?? []);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-montserrat font-bold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{stats.users}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Members</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{stats.members}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Exports</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={exportUsers}>Export Users CSV</Button>
            <Button variant="outline" onClick={exportMembers}>Export Members CSV</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Signups</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;