import { useState } from "react";
import { Link } from "wouter";
import { useListJobs, getListJobsQueryKey, useUpdateJobStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  on_the_way: "bg-yellow-100 text-yellow-800",
  arrived: "bg-orange-100 text-orange-800",
  picked_up: "bg-purple-100 text-purple-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  dropped_off: "bg-teal-100 text-teal-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const JOB_STATUSES = ["", "scheduled", "on_the_way", "arrived", "picked_up", "in_transit", "dropped_off", "completed", "cancelled"];

export default function JobsList() {
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useListJobs(
    statusFilter ? { status: statusFilter } : {},
    { query: { queryKey: getListJobsQueryKey(statusFilter ? { status: statusFilter } : {}) } }
  );

  const updateStatus = useUpdateJobStatus();
  const handleStatusUpdate = (jobId: number, status: string) => {
    updateStatus.mutate({ id: jobId, data: { status: status as "scheduled" | "on_the_way" | "arrived" | "picked_up" | "in_transit" | "dropped_off" | "completed" | "cancelled" } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() }); toast({ title: "Status updated" }); },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Jobs</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {JOB_STATUSES.filter(Boolean).map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}</div>
        ) : (jobs ?? []).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No jobs found.</div>
        ) : (
          <div className="space-y-3">
            {(jobs ?? []).map(job => (
              <div key={job.id} className="border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{job.customerName}</span>
                      <span className="text-muted-foreground text-sm">— {job.customerPhone}</span>
                    </div>
                    {job.workerName && <span className="text-sm text-muted-foreground">Assigned to: {job.workerName}</span>}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-gray-100"}`}>{job.status.replace(/_/g, " ")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.pickupAddress}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {job.dropoffAddress}</div>
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.moveDate}</div>
                  {job.priceLow && <div>${Number(job.priceLow).toLocaleString()} – ${Number(job.priceHigh ?? 0).toLocaleString()}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <Select defaultValue={job.status} onValueChange={(v) => handleStatusUpdate(job.id, v)}>
                    <SelectTrigger className="w-44 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{JOB_STATUSES.filter(Boolean).map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
