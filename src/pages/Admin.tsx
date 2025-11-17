import React, { useEffect, useMemo, useState } from "react";
import db from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { generateAccessCode } from "@/lib/accessCodeGenerator";
import { generateCouponBatch } from "@/lib/discountCodeManager";
import { Copy, Download, Search, Filter, Mail, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function downloadCsv(filename: string, rows: any[]) {
  if (!rows || !rows.length) return;
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const csv = [headers.join(",")].concat(rows.map((r) => headers.map((h) => JSON.stringify((r as any)[h] ?? "")).join(","))).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, members: 0, accessCodes: 0, discountCodes: 0 });
  const [recent, setRecent] = useState<{ email: string | null; created_at: string }[]>([]);
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [discountCodes, setDiscountCodes] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [generateCount, setGenerateCount] = useState("10");
  const [discountTier, setDiscountTier] = useState("basic");
  const [discountExpiryDays, setDiscountExpiryDays] = useState("30");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const profiles = await db.profiles.list();
        const memberships = await db.memberships.list();
        const activeMemberships = await db.memberships.listActive();
        const allAccessCodes = await db.accessCodes.listAll();
        const allDiscountCodes = await db.discountCodes.listAll();
        const allInvoices = await db.invoices.listAll();

        setAllProfiles(profiles);
        setAllMembers(memberships);
        setInvoices(allInvoices);

        setStats({
          users: profiles.length,
          members: activeMemberships.length,
          accessCodes: allAccessCodes.length,
          discountCodes: allDiscountCodes.length,
        });
        setRecent(
          profiles
            .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
            .slice(0, 10)
            .map((p: any) => ({ email: p.email, created_at: p.created_at || new Date().toISOString() }))
        );
        setAccessCodes(allAccessCodes as any[]);
        setDiscountCodes(allDiscountCodes as any[]);
      } catch (error) {
        console.error("Error loading admin data:", error);
      }
    }
    if (isAdmin) void load();
  }, [isAdmin]);

  const exportUsers = async () => {
    const profiles = await db.profiles.list();
    downloadCsv(
      "users.csv",
      profiles.map((p: any) => ({ user_id: p.user_id, email: p.email, role: p.role, marketing_opt_in: p.marketing_opt_in, created_at: p.created_at }))
    );
  };

  const exportMembers = async () => {
    const memberships = await db.memberships.list();
    downloadCsv(
      "members.csv",
      memberships.map((m: any) => ({ user_id: m.user_id, plan_id: m.plan_id, status: m.status, payment_status: m.payment_status, access_code: m.access_code, next_billing_at: m.next_billing_at }))
    );
  };

  const handleGenerateAccessCodes = async () => {
    try {
      const count = parseInt(generateCount) || 10;
      const codes: any[] = [];

      for (let i = 0; i < count; i++) {
        const code = generateAccessCode();
        const accessCode = await db.accessCodes.create({
          code,
          user_id: null,
          membership_id: null,
          plan_id: "all",
          expires_at: null,
          is_used: false,
        });
        if (accessCode) {
          codes.push(accessCode);
        }
      }

      if (codes.length > 0) {
        // Reload all access codes from database to ensure they're persisted
        const allCodes = await db.accessCodes.listAll();
        setAccessCodes(allCodes);
        toast({
          title: "Success",
          description: `Generated and saved ${codes.length} access codes`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate access codes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating access codes:", error);
      toast({
        title: "Error",
        description: "Failed to generate access codes. Check console for details.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateDiscountCodes = async () => {
    try {
      const count = parseInt(generateCount) || 10;
      const codes = generateCouponBatch(discountTier, count);
      const expiryDate = new Date(Date.now() + parseInt(discountExpiryDays) * 24 * 60 * 60 * 1000).toISOString();

      const tierDiscounts = { basic: 10, premium: 20, elite: 25, referral: 15 };
      const tierNames = { basic: "Basic", premium: "Premium", elite: "Elite", referral: "Referral" };
      const newCodes = [];

      for (const code of codes) {
        const discountCode = await db.discountCodes.create({
          code,
          plan_id: discountTier,
          discount_percentage: tierDiscounts[discountTier as keyof typeof tierDiscounts] || 10,
          description: `${tierNames[discountTier as keyof typeof tierNames]} discount code`,
          max_uses: count,
          current_uses: 0,
          expires_at: expiryDate,
          is_active: true,
        });
        if (discountCode) {
          newCodes.push(discountCode);
        }
      }

      if (newCodes.length > 0) {
        // Reload all discount codes from database to ensure they're persisted
        const allCodes = await db.discountCodes.listAll();
        setDiscountCodes(allCodes);
        toast({
          title: "Success",
          description: `Generated and saved ${newCodes.length} discount codes`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate discount codes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating discount codes:", error);
      toast({
        title: "Error",
        description: "Failed to generate discount codes. Check console for details.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Code copied to clipboard" });
  };

  const downloadCodes = (codes: any[], filename: string) => {
    downloadCsv(filename, codes);
  };

  const filteredMembers = useMemo(() => {
    return allMembers.filter((member: any) => {
      const profile = allProfiles.find((p: any) => p.user_id === member.user_id);
      const email = profile?.email || "";
      const matchesSearch = email.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesStatus = memberStatusFilter === "all" || member.status === memberStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allMembers, allProfiles, memberSearch, memberStatusFilter]);

  const handleToggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSelectAllMembers = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((m: any) => m.id));
    }
  };

  const handleBulkSuspend = async () => {
    if (!selectedMembers.length) {
      toast({ title: "Error", description: "Please select members to suspend", variant: "destructive" });
      return;
    }

    try {
      for (const memberId of selectedMembers) {
        const member = filteredMembers.find((m: any) => m.id === memberId);
        if (member) {
          await db.memberships.update(member.user_id, { status: "canceled" });
        }
      }
      setSelectedMembers([]);
      toast({ title: "Success", description: `Suspended ${selectedMembers.length} members` });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({ title: "Error", description: "Failed to suspend members", variant: "destructive" });
    }
  };

  const handleBulkSendEmails = async () => {
    if (!selectedMembers.length) {
      toast({ title: "Error", description: "Please select members", variant: "destructive" });
      return;
    }

    toast({
      title: "Info",
      description: `Email invitations would be sent to ${selectedMembers.length} members (Email integration required)`,
    });
  };

  const calculateRenewalMetrics = () => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const upcomingRenewals = allMembers.filter((m: any) => {
      if (!m.next_billing_at) return false;
      const billingDate = new Date(m.next_billing_at);
      return billingDate <= nextMonth && billingDate > new Date();
    });

    const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.final_amount || 0), 0);
    const totalDiscountGiven = invoices.reduce((sum: number, inv: any) => sum + (inv.discount_amount || 0), 0);

    return { upcomingRenewals, totalRevenue, totalDiscountGiven };
  };

  const { upcomingRenewals, totalRevenue, totalDiscountGiven } = calculateRenewalMetrics();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          title="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to Home</span>
        </button>
      </div>
      <h1 className="text-3xl font-montserrat font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{stats.users}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{stats.members}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Access Codes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{stats.accessCodes}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Discount Codes</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{stats.discountCodes}</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="access-codes">Access Codes</TabsTrigger>
          <TabsTrigger value="discount-codes">Discount Codes</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-muted-foreground">No users yet</p>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search & Manage Members</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Find and manage your active members</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap items-end">
                <div className="flex-1 min-w-48">
                  <Label htmlFor="member-search">Search by email</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="member-search"
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status-filter">Filter by status</Label>
                  <Select value={memberStatusFilter} onValueChange={setMemberStatusFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedMembers.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedMembers.length} members selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleBulkSendEmails}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invites
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkSuspend}>
                      <Lock className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Members ({filteredMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredMembers.length === 0 ? (
                <p className="text-muted-foreground">No members found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                          onChange={handleSelectAllMembers}
                        />
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.slice(0, 20).map((member: any) => {
                      const profile = allProfiles.find((p: any) => p.user_id === member.user_id);
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => handleToggleMemberSelection(member.id)}
                            />
                          </TableCell>
                          <TableCell>{profile?.email}</TableCell>
                          <TableCell className="capitalize">{member.plan_id}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${member.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {member.status}
                            </span>
                          </TableCell>
                          <TableCell>{member.next_billing_at ? new Date(member.next_billing_at).toLocaleDateString() : "N/A"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">${totalRevenue.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Discounts Given</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">${totalDiscountGiven.toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Upcoming Renewals (30 days)</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{upcomingRenewals.length}</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Subscription Renewals</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Members renewing in the next 30 days</p>
            </CardHeader>
            <CardContent>
              {upcomingRenewals.length === 0 ? (
                <p className="text-muted-foreground">No upcoming renewals</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Renewal Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingRenewals.slice(0, 15).map((member: any) => {
                      const profile = allProfiles.find((p: any) => p.user_id === member.user_id);
                      return (
                        <TableRow key={member.id}>
                          <TableCell>{profile?.email}</TableCell>
                          <TableCell className="capitalize">{member.plan_id}</TableCell>
                          <TableCell>{new Date(member.next_billing_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium">Ready</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-muted-foreground">No invoices yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.slice(0, 10).map((invoice: any) => (
                      <TableRow key={invoice.id}>
                        <TableCell>${invoice.final_amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(invoice.issued_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Access Codes</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Generate codes for members to access their dashboard</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <Label htmlFor="access-count">Number of codes</Label>
                  <Input
                    id="access-count"
                    type="number"
                    value={generateCount}
                    onChange={(e) => setGenerateCount(e.target.value)}
                    min="1"
                    max="100"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleGenerateAccessCodes}>Generate Codes</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Codes ({accessCodes.length})</CardTitle>
              {accessCodes.length > 0 && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => downloadCodes(accessCodes, "access_codes.csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {accessCodes.length === 0 ? (
                <p className="text-muted-foreground">No access codes yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessCodes.slice(0, 10).map((code, i) => (
                      <TableRow key={`${code.code}-${i}`}>
                        <TableCell className="font-mono font-bold">{code.code}</TableCell>
                        <TableCell>{code.is_used ? "Used" : "Available"}</TableCell>
                        <TableCell>{code.expires_at ? new Date(code.expires_at).toLocaleDateString() : "Never"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code.code)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discount-codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Discount Codes</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Create discount codes for different membership tiers</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap items-end">
                <div>
                  <Label htmlFor="discount-tier">Tier</Label>
                  <Select value={discountTier} onValueChange={setDiscountTier}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (10%)</SelectItem>
                      <SelectItem value="premium">Premium (20%)</SelectItem>
                      <SelectItem value="elite">Elite (25%)</SelectItem>
                      <SelectItem value="referral">Referral (15%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount-count">Number of codes</Label>
                  <Input id="discount-count" type="number" value={generateCount} onChange={(e) => setGenerateCount(e.target.value)} min="1" max="100" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="discount-expiry">Expiry (days)</Label>
                  <Input id="discount-expiry" type="number" value={discountExpiryDays} onChange={(e) => setDiscountExpiryDays(e.target.value)} min="1" className="mt-1" />
                </div>
                <Button onClick={handleGenerateDiscountCodes}>Generate Codes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discount Codes ({discountCodes.length})</CardTitle>
              {discountCodes.length > 0 && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => downloadCodes(discountCodes, "discount_codes.csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {discountCodes.length === 0 ? (
                <p className="text-muted-foreground">No discount codes yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountCodes.slice(0, 10).map((code, i) => (
                      <TableRow key={`${code.code}-${i}`}>
                        <TableCell className="font-mono font-bold">{code.code}</TableCell>
                        <TableCell>{code.discount_percentage}%</TableCell>
                        <TableCell>
                          {code.current_uses}/{code.max_uses}
                        </TableCell>
                        <TableCell>{new Date(code.expires_at).toLocaleDateString()}</TableCell>
                        <TableCell>{code.is_active ? "Active" : "Inactive"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code.code)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button onClick={exportUsers} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Users CSV
              </Button>
              <Button onClick={exportMembers} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Members CSV
              </Button>
              <Button onClick={() => downloadCodes(accessCodes, "access_codes.csv")} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Access Codes CSV
              </Button>
              <Button onClick={() => downloadCodes(discountCodes, "discount_codes.csv")} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Discount Codes CSV
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
