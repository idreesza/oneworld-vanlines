import {
  useGetLead,
  getGetLeadQueryKey,
  useUpdateLead,
  useAddLeadNote,
  useAssignLead,
  useListWorkers,
  useCreateEstimate,
} from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, MessageCircle, Mail, MapPin, Calendar, Home, User,
  ArrowLeft, Clipboard, CheckCircle2, Send, ExternalLink,
  Tag, FileText, DollarSign, UserCheck,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  quoted: "bg-purple-100 text-purple-700",
  scheduled: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function AdminLeadDetail() {
  const [, params] = useRoute("/admin/leads/:id");
  const leadId = parseInt(params?.id || "0");
  const { toast } = useToast();

  const { data: lead, isLoading } = useGetLead(leadId, {
    query: { enabled: !!leadId, queryKey: getGetLeadQueryKey(leadId) }
  });
  const { data: workers } = useListWorkers({ query: { queryKey: ["workers"] } });

  const updateLead = useUpdateLead();
  const addNote = useAddLeadNote();
  const assignLead = useAssignLead();
  const createEstimate = useCreateEstimate();

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"note" | "call" | "email" | "whatsapp">("note");

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) return <AdminLayout><div className="p-8">Lead not found.</div></AdminLayout>;

  const addNoteWithType = () => {
    if (!newNote.trim()) return;
    const prefix = noteType !== "note" ? `[${noteType.toUpperCase()}] ` : "";
    addNote.mutate({ id: leadId, data: { content: prefix + newNote } }, {
      onSuccess: () => {
        setNewNote("");
        queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId) });
        toast({ title: "Note added" });
      }
    });
  };

  const whatsappMsg = encodeURIComponent(
    `Hi ${lead.fullName}, this is OneWorld Van Lines following up on your moving inquiry. We'd love to help with your move! When is a good time to chat?`
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin/leads">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-serif font-bold">{lead.fullName}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-700"}`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">Lead #{lead.id} · Added {format(new Date(lead.createdAt), 'PPp')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Actions */}
            <a href={`tel:${lead.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href={`https://wa.me/1${lead.phone.replace(/\D/g, "")}?text=${whatsappMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`mailto:${lead.email}?subject=Your Moving Quote from OneWorld Van Lines`}
              className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> Email
            </a>
            <Select
              value={lead.status}
              onValueChange={(val: string) => {
                updateLead.mutate({ id: leadId, data: { status: val as "new" | "contacted" | "quoted" | "scheduled" | "completed" | "lost" } }, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId) });
                    toast({ title: "Status updated" });
                  }
                });
              }}
            >
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["new", "contacted", "quoted", "scheduled", "completed", "lost"].map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><User className="w-4 h-4" /> Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="font-medium text-sm hover:text-primary">{lead.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <a href={`mailto:${lead.email}`} className="font-medium text-sm hover:text-primary truncate block">{lead.email}</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Move Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><Clipboard className="w-4 h-4" /> Move Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Tag className="w-3 h-3" /> Type</div>
                    <div className="font-medium text-sm capitalize">{lead.moveType}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Calendar className="w-3 h-3" /> Move Date</div>
                    <div className="font-medium text-sm">{lead.moveDate ? format(new Date(lead.moveDate), 'PP') : 'Flexible'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Home className="w-3 h-3" /> Bedrooms</div>
                    <div className="font-medium text-sm">{lead.bedroomCount || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><MapPin className="w-3 h-3" /> From</div>
                    <div className="font-medium text-sm">{lead.moveFromZip || lead.moveFromAddress || '—'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><MapPin className="w-3 h-3" /> To</div>
                    <div className="font-medium text-sm">{lead.moveToZip || lead.moveToAddress || '—'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><ExternalLink className="w-3 h-3" /> Source</div>
                    <div className="font-medium text-sm capitalize">{lead.source?.replace(/_/g, ' ') || '—'}</div>
                  </div>
                </div>
                {lead.additionalNotes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">Customer Notes</div>
                    <p className="text-sm">{lead.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes & Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><FileText className="w-4 h-4" /> Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Note input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {[
                      { type: "note", label: "Note", color: "bg-gray-100" },
                      { type: "call", label: "Call", color: "bg-blue-50" },
                      { type: "email", label: "Email", color: "bg-amber-50" },
                      { type: "whatsapp", label: "WhatsApp", color: "bg-green-50" },
                    ].map(t => (
                      <button
                        key={t.type}
                        onClick={() => setNoteType(t.type as typeof noteType)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${noteType === t.type ? "bg-primary text-primary-foreground" : `${t.color} text-foreground hover:opacity-80`}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={`Log a ${noteType}...`}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      className="resize-none flex-1"
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) addNoteWithType(); }}
                    />
                    <Button onClick={addNoteWithType} disabled={addNote.isPending || !newNote.trim()} className="self-end">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Notes list */}
                <div className="space-y-3">
                  {lead.notes?.length ? lead.notes.slice().reverse().map(note => {
                    const isCall = note.content.startsWith("[CALL]");
                    const isEmail = note.content.startsWith("[EMAIL]");
                    const isWA = note.content.startsWith("[WHATSAPP]");
                    const typeColor = isCall ? "bg-blue-50 border-blue-100" : isEmail ? "bg-amber-50 border-amber-100" : isWA ? "bg-green-50 border-green-100" : "bg-muted border-border";
                    const displayContent = note.content.replace(/^\[(CALL|EMAIL|WHATSAPP)\]\s*/, "");
                    return (
                      <div key={note.id} className={`p-3 rounded-lg border text-sm ${typeColor}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-muted-foreground">{format(new Date(note.createdAt), 'PPp')}</span>
                          {(isCall || isEmail || isWA) && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${isCall ? "bg-blue-100 text-blue-700" : isEmail ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                              {isCall ? "Call" : isEmail ? "Email" : "WhatsApp"}
                            </span>
                          )}
                        </div>
                        <p className="text-foreground">{displayContent}</p>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No activity logged yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Estimate */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><DollarSign className="w-4 h-4" /> Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                {lead.priceLow && lead.priceHigh ? (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Quoted Price Range</div>
                    <div className="text-2xl font-bold text-primary">${lead.priceLow.toLocaleString()} – ${lead.priceHigh.toLocaleString()}</div>
                    <div className="mt-3">
                      <button
                        className="text-xs text-muted-foreground hover:text-primary underline"
                        onClick={() => {
                          updateLead.mutate({ id: leadId, data: { status: "quoted" } }, {
                            onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId) })
                          });
                        }}
                      >
                        Mark as Quoted
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">No estimate yet</p>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        createEstimate.mutate({
                          data: {
                            leadId: lead.id,
                            bedroomCount: lead.bedroomCount || 2,
                            boxCount: (lead.bedroomCount || 2) * 15,
                          }
                        }, {
                          onSuccess: (est) => {
                            updateLead.mutate({ id: lead.id, data: { status: "quoted", priceLow: est.priceLow, priceHigh: est.priceHigh } }, {
                              onSuccess: () => {
                                queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId) });
                                toast({ title: "Estimate generated and lead marked as Quoted" });
                              }
                            });
                          }
                        });
                      }}
                      disabled={createEstimate.isPending || updateLead.isPending}
                    >
                      {createEstimate.isPending ? "Generating..." : "Generate Estimate"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><UserCheck className="w-4 h-4" /> Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={lead.assignedWorkerId?.toString() || "unassigned"}
                  onValueChange={(val) => {
                    if (val === "unassigned") return;
                    assignLead.mutate({ id: leadId, data: { workerId: parseInt(val) } }, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: getGetLeadQueryKey(leadId) });
                        toast({ title: "Worker assigned" });
                      }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {workers?.map(w => (
                      <SelectItem key={w.id} value={w.id.toString()}>
                        {w.name} ({w.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Quick Messaging */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><MessageCircle className="w-4 h-4" /> Quick Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Send a pre-written message via WhatsApp</p>
                {[
                  { label: "Initial follow-up", msg: `Hi ${lead.fullName}, I'm reaching out from OneWorld Van Lines about your moving inquiry. We'd love to help! Are you available for a quick call?` },
                  { label: "Quote ready", msg: `Hi ${lead.fullName}, your moving estimate is ready! Based on your details, your price range is $${lead.priceLow || "TBD"}–$${lead.priceHigh || "TBD"}. Questions? Call us at (660) 667-7770.` },
                  { label: "Move confirmed", msg: `Hi ${lead.fullName}, just confirming your move with OneWorld Van Lines! Our crew will arrive on time. Contact us at (660) 667-7770 for any changes.` },
                  { label: "Day-before reminder", msg: `Hi ${lead.fullName}, a friendly reminder that OneWorld Van Lines arrives tomorrow. Make sure paths are clear and your essentials bag is packed. See you tomorrow!` },
                ].map(tmpl => (
                  <a
                    key={tmpl.label}
                    href={`https://wa.me/1${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(tmpl.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-3 py-2 border border-border rounded-lg text-sm hover:border-green-400 hover:bg-green-50 transition-colors group"
                  >
                    <span className="font-medium">{tmpl.label}</span>
                    <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
