import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLead } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  fullName: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Phone required"),
  email: z.string().email("Valid email required"),
  additionalNotes: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const createLead = useCreateLead();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", additionalNotes: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    createLead.mutate({ data: { ...values, source: "website_form" } }, {
      onSuccess: () => {
        setSubmitted(true);
        toast({ title: "Message sent!", description: "We'll reach out within 1 business hour." });
      },
      onError: () => toast({ title: "Error", description: "Please try again or call us directly.", variant: "destructive" }),
    });
  };

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">We respond to all inquiries within 1 business hour during operating hours (7am–8pm CST).</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-8 mb-10">
              {[
                { icon: Phone, label: "Call or Text", value: "(660) 667-7770", href: "tel:6606677770" },
                { icon: MessageCircle, label: "WhatsApp", value: "Message us on WhatsApp", href: "https://wa.me/16606677770" },
                { icon: Mail, label: "Email", value: "info@oneworldvanlines.com", href: "mailto:info@oneworldvanlines.com" },
                { icon: MapPin, label: "Service Areas", value: "DFW Metroplex & Greater Austin, TX", href: "/areas" },
              ].map(contact => {
                const Icon = contact.icon;
                return (
                  <a key={contact.label} href={contact.href} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium">{contact.label}</div>
                      <div className="text-foreground font-medium group-hover:text-primary transition-colors">{contact.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <h3 className="font-serif font-bold text-xl mb-2">Prefer a quick estimate?</h3>
              <p className="text-primary-foreground/70 text-sm mb-4">Use our free calculator for an instant price range based on your specific inventory.</p>
              <a href="/calculator" className="inline-block bg-secondary text-secondary-foreground px-6 py-2 rounded font-semibold text-sm hover:bg-secondary/90 transition-colors">Open Calculator</a>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-2">Message Received</h3>
                <p className="text-muted-foreground">One of our coordinators will reach out to you shortly at the contact info you provided.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                    <FormItem><FormLabel>Message (optional)</FormLabel><FormControl><Textarea rows={4} placeholder="Tell us about your move..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createLead.isPending}>
                    {createLead.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
