import { useGetDashboardStats, useGetRecentLeads, useGetLeadSourceBreakdown, useGetJobStatusBreakdown } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({ query: { queryKey: ["dashboardStats"] }});
  const { data: recentLeads, isLoading: leadsLoading } = useGetRecentLeads({ limit: 5 }, { query: { queryKey: ["recentLeads"] }});
  const { data: sourceBreakdown } = useGetLeadSourceBreakdown({ query: { queryKey: ["leadSourceBreakdown"] }});
  const { data: statusBreakdown } = useGetJobStatusBreakdown({ query: { queryKey: ["jobStatusBreakdown"] }});

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#6b7280', '#9ca3af'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalLeads || 0}</div>
                  <p className="text-xs text-muted-foreground">+{stats?.newLeadsToday || 0} new today</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.completedJobsThisMonth || 0} completed this month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <div className="text-2xl font-bold">{stats?.conversionRate?.toFixed(1) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Lead to Job</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue (Est)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Skeleton className="h-8 w-20" /> : (
                <>
                  <div className="text-2xl font-bold">${(stats?.revenueThisMonth || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Avg job: ${(stats?.avgEstimateValue || 0).toLocaleString()}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>Where your leads are coming from</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {sourceBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceBreakdown}>
                    <XAxis dataKey="source" className="text-xs" />
                    <YAxis className="text-xs" />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center"><Skeleton className="h-full w-full" /></div>
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest quote requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsLoading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                ) : recentLeads?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent leads found.</p>
                ) : (
                  recentLeads?.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div>
                        <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:text-primary transition-colors">
                          {lead.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground">{lead.moveType} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link href="/admin/leads" className="text-sm text-primary font-medium hover:underline">
                  View all leads →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
