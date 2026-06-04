import { useState } from "react";
import { useListFaqs, getListFaqsQueryKey, useCreateFaq, useDeleteFaq } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function FaqManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", category: "", sortOrder: "0" });

  const { data: faqs, isLoading } = useListFaqs({}, { query: { queryKey: getListFaqsQueryKey() } });
  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();

  const handleCreate = () => {
    if (!form.question || !form.answer || !form.category) { toast({ title: "Fill all required fields", variant: "destructive" }); return; }
    createFaq.mutate({ data: { question: form.question, answer: form.answer, category: form.category, sortOrder: Number(form.sortOrder) } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }); setIsOpen(false); setForm({ question: "", answer: "", category: "", sortOrder: "0" }); toast({ title: "FAQ created" }); },
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    deleteFaq.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }); toast({ title: "FAQ deleted" }); } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">FAQs</h2>
          <Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4 mr-2" /> New FAQ</Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
        ) : (
          <div className="space-y-2">
            {(faqs ?? []).map(faq => (
              <div key={faq.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{faq.question}</p>
                  <p className="text-muted-foreground text-xs line-clamp-2">{faq.answer}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{faq.category}</p>
                </div>
                <button onClick={() => handleDelete(faq.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded ml-4 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New FAQ</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><label className="text-sm font-medium mb-1 block">Question *</label><Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} /></div>
              <div><label className="text-sm font-medium mb-1 block">Answer *</label><Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={4} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Category *</label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Pricing, Moving Day..." /></div>
                <div><label className="text-sm font-medium mb-1 block">Sort Order</label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} /></div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createFaq.isPending}>{createFaq.isPending ? "Creating..." : "Create FAQ"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
