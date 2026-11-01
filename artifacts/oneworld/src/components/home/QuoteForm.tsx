import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { useCreateLead } from "@workspace/api-client-react";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Loader2, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

const HOME_SIZES = [
  { id: "studio", label: "Studio", bedrooms: 0, moveType: "apartment" },
  { id: "1br", label: "1 Bed", bedrooms: 1, moveType: "apartment" },
  { id: "2br", label: "2 Bed", bedrooms: 2, moveType: "residential" },
  { id: "3br", label: "3 Bed", bedrooms: 3, moveType: "residential" },
  { id: "4br", label: "4+ Bed", bedrooms: 4, moveType: "residential" },
  { id: "office", label: "Office", bedrooms: 0, moveType: "commercial" },
] as const;

const phoneDigits = (v: string) => v.replace(/\D/g, "");

const schema = z.object({
  moveFrom: z.string().trim().min(3, "Enter a city or ZIP"),
  moveTo: z.string().trim().min(3, "Enter a city or ZIP"),
  moveDate: z.string().optional(),
  homeSize: z.string().min(1, "Pick your home size"),
  fullName: z.string().trim().min(2, "Enter your name"),
  phone: z.string().refine((v) => phoneDigits(v).length >= 10, "Enter a 10-digit phone number"),
  email: z.string().trim().email("Enter a valid email"),
});
type Values = z.infer<typeof schema>;

const STEP_1: (keyof Values)[] = ["moveFrom", "moveTo", "homeSize"];

function formatPhone(raw: string) {
  const d = phoneDigits(raw).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const inputCls =
  "w-full h-12 rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[hsl(222,47%,11%)] focus:ring-2 focus:ring-[hsl(38,92%,50%)]/40 aria-[invalid=true]:border-red-500";

function Field({ label, icon: Icon, error, children }: { label: string; icon: typeof MapPin; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
        {children}
      </span>
      {error && <span role="alert" className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

export default function QuoteForm({ idPrefix = "hero", className }: { idPrefix?: string; className?: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState<Values | null>(null);
  const createLead = useCreateLead();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { moveFrom: "", moveTo: "", moveDate: "", homeSize: "", fullName: "", phone: "", email: "" },
  });
  const { register, formState: { errors }, watch, setValue } = form;
  const homeSize = watch("homeSize");

  async function next() {
    if (await form.trigger(STEP_1)) setStep(2);
  }

  function onSubmit(v: Values) {
    const size = HOME_SIZES.find((s) => s.id === v.homeSize);
    createLead.mutate(
      {
        data: {
          fullName: v.fullName,
          phone: formatPhone(v.phone),
          email: v.email,
          moveFromAddress: v.moveFrom,
          moveToAddress: v.moveTo,
          moveDate: v.moveDate || undefined,
          houseSize: size?.label,
          bedroomCount: size?.bedrooms,
          moveType: size?.moveType,
          additionalNotes: `Homepage quote form (${idPrefix})`,
          source: "website_form",
        },
      },
      { onSuccess: () => setDone(v) },
    );
  }

  if (done) {
    const qs = new URLSearchParams({ from: done.moveFrom, to: done.moveTo, phone: formatPhone(done.phone) }).toString();
    return (
      <div className={cn("text-center py-4", className)} aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">You're all set, {done.fullName.split(" ")[0]}!</h3>
        <p className="text-slate-600 text-[15px] leading-relaxed mb-5">
          A move coordinator will call <strong className="text-slate-900">{formatPhone(done.phone)}</strong> within 1 hour
          (7am–8pm CST) with your price. Your call will come from (660) 667-7770.
        </p>
        <Link
          href={`/calculator?${qs}`}
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-[hsl(222,47%,11%)] text-white font-semibold hover:bg-[hsl(222,47%,18%)] transition"
        >
          Can't wait? See an instant estimate <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={className} aria-label="Free moving quote">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-5" aria-hidden>
        {[1, 2].map((n) => (
          <div key={n} className="flex-1">
            <div className={cn("h-1.5 rounded-full transition-colors", step >= n ? "bg-[hsl(38,92%,50%)]" : "bg-slate-200")} />
            <p className={cn("text-[11px] font-semibold uppercase tracking-wider mt-1.5", step >= n ? "text-slate-900" : "text-slate-400")}>
              {n === 1 ? "1 · Your move" : "2 · Your quote"}
            </p>
          </div>
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-3.5">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Moving from" icon={MapPin} error={errors.moveFrom?.message}>
              <input id={`${idPrefix}-from`} className={inputCls} placeholder="City or ZIP" autoComplete="postal-code" aria-invalid={!!errors.moveFrom} {...register("moveFrom")} />
            </Field>
            <Field label="Moving to" icon={MapPin} error={errors.moveTo?.message}>
              <input id={`${idPrefix}-to`} className={inputCls} placeholder="City or ZIP" aria-invalid={!!errors.moveTo} {...register("moveTo")} />
            </Field>
          </div>

          <fieldset>
            <legend className="block text-[13px] font-semibold text-slate-700 mb-1.5">Size of your move</legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {HOME_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={homeSize === s.id}
                  onClick={() => setValue("homeSize", s.id, { shouldValidate: true })}
                  className={cn(
                    "h-11 rounded-lg border text-sm font-semibold transition",
                    homeSize === s.id
                      ? "border-[hsl(222,47%,11%)] bg-[hsl(222,47%,11%)] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {errors.homeSize && <span role="alert" className="block text-xs text-red-600 mt-1">{errors.homeSize.message}</span>}
          </fieldset>

          <Field label="Move date (optional)" icon={Calendar}>
            <input id={`${idPrefix}-date`} type="date" min={today()} className={cn(inputCls, "pr-3")} {...register("moveDate")} />
          </Field>

          <button
            type="button"
            onClick={next}
            className="w-full h-13 py-3.5 rounded-lg bg-[hsl(38,92%,50%)] text-slate-950 font-bold text-base hover:bg-[hsl(38,92%,45%)] active:scale-[.99] transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
          >
            Get my free quote <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="text-sm text-slate-600 -mt-1">Where should we send your price? We'll never sell or share your info.</p>
          <Field label="Full name" icon={User} error={errors.fullName?.message}>
            <input id={`${idPrefix}-name`} className={inputCls} placeholder="Jane Smith" autoComplete="name" autoFocus aria-invalid={!!errors.fullName} {...register("fullName")} />
          </Field>
          <Field label="Phone" icon={Phone} error={errors.phone?.message}>
            <input
              id={`${idPrefix}-phone`}
              type="tel"
              inputMode="tel"
              className={inputCls}
              placeholder="(214) 555-0100"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              {...register("phone", { onChange: (e) => setValue("phone", formatPhone(e.target.value)) })}
            />
          </Field>
          <Field label="Email" icon={Mail} error={errors.email?.message}>
            <input id={`${idPrefix}-email`} type="email" inputMode="email" className={inputCls} placeholder="you@email.com" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          </Field>

          {createLead.isError && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Something went wrong sending your request. Please try again or call{" "}
              <a href="tel:6606677770" className="font-semibold underline">(660) 667-7770</a>.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-13 px-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Back to move details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={createLead.isPending}
              className="flex-1 h-13 py-3.5 rounded-lg bg-[hsl(38,92%,50%)] text-slate-950 font-bold text-base hover:bg-[hsl(38,92%,45%)] active:scale-[.99] transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 disabled:opacity-70"
            >
              {createLead.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send my quote <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-500">
            <Lock className="w-3 h-3 mt-0.5 shrink-0" />
            By submitting, you agree to be contacted about your move by call, text or email. No obligation. See our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      )}
    </form>
  );
}
