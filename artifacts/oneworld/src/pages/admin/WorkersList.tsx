import { useListWorkers, getListWorkersQueryKey, useCreateWorker, useDeleteWorker } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminWorkers() {
  const { data: workers, isLoading } = useListWorkers({ query: { queryKey: ["workers"] }});
  const createWorker = useCreateWorker();
  const deleteWorker = useDeleteWorker();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", phone: "", role: "mover" });

  const handleCreate = () => {
    createWorker.mutate({
      data: newWorker as any
    }, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["workers"] });
        toast({ title: "Worker added successfully" });
        setNewWorker({ name: "", email: "", phone: "", role: "mover" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this worker?")) {
      deleteWorker.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["workers"] });
          toast({ title: "Worker removed" });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-foreground">Worker Management</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Worker</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={newWorker.email} onChange={e => setNewWorker({...newWorker, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={newWorker.phone} onChange={e => setNewWorker({...newWorker, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newWorker.role} onValueChange={val => setNewWorker({...newWorker, role: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="mover">Mover</SelectItem>
                      <SelectItem value="lead_worker">Lead Worker</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4" onClick={handleCreate} disabled={createWorker.isPending}>
                  {createWorker.isPending ? "Adding..." : "Add Worker"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !workers || workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No workers found.
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{worker.email}</div>
                      <div className="text-xs text-muted-foreground">{worker.phone}</div>
                    </TableCell>
                    <TableCell className="capitalize">{worker.role.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge variant={worker.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {worker.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{worker.assignedJobCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(worker.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
