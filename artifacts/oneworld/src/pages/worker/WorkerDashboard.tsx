import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { useListJobs, getListJobsQueryKey, useUpdateJobStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Truck, MapPin, Calendar } from "lucide-react";
import { UserButton } from "@clerk/react";

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

const JOB_STATUSES = ["scheduled", "on_the_way", "arrived", "picked_up", "in_transit", "dropped_off", "completed", "cancelled"];

export default function WorkerDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useListJobs({}, { query: { queryKey: getListJobsQueryKey() } });
  const updateStatus = useUpdateJobStatus();

  const handleStatusUpdate = (jobId: number, status: string) => {
    updateStatus.mutate({ id: jobId, data: { status: status as "scheduled" | "on_the_way" | "arrived" | "picked_up" | "in_transit" | "dropped_off" | "completed" | "cancelled" } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
        toast({ title: "Status updated", description: `Job status changed to ${status.replace(/_/g, " ")}` });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary text-secondary-foreground flex items-center justify-center rounded">
            <span className="font-serif font-bold">O</span>
          </div>
          <div>
            <span className="font-serif font-bold">OneWorld</span>
            <span className="text-primary-foreground/60 text-xs ml-2">Worker Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/70">Welcome, {user?.firstName}</span>
          <UserButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif font-bold mb-8">My Assigned Jobs</h1>

        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />)}</div>
        ) : (jobs ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Truck className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No jobs assigned yet. Check with your supervisor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(jobs ?? []).map(job => (
              <div key={job.id} className="border border-border rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg">{job.customerName}</h3>
                    <p className="text-muted-foreground text-sm">{job.customerPhone}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[job.status] ?? "bg-gray-100 text-gray-800"}`}>
                    {job.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-muted-foreground">Pickup:</span> {job.pickupAddress}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div><span className="text-muted-foreground">Dropoff:</span> {job.dropoffAddress}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{job.moveDate}</span>
                  </div>
                  {job.priceLow && job.priceHigh && (
                    <div className="text-muted-foreground">Estimate: ${job.priceLow.toLocaleString()} – ${job.priceHigh.toLocaleString()}</div>
                  )}
                </div>
                {job.notes && <div className="text-sm text-muted-foreground bg-muted rounded p-3 mb-4">{job.notes}</div>}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Update status:</span>
                  <Select defaultValue={job.status} onValueChange={(v) => handleStatusUpdate(job.id, v)}>
                    <SelectTrigger className="w-48 h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {JOB_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
