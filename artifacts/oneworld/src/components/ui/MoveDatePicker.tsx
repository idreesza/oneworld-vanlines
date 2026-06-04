import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

type Mode = "specific" | "range";

type Props = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
};

const CALENDAR_CLASSNAMES = {
  root: "w-full",
  months: "w-full",
  month: "w-full",
  weekdays: "flex w-full",
  weekday: "flex-1 text-center text-[0.75rem] font-normal text-muted-foreground select-none",
  week: "mt-1 flex w-full",
  day: "group/day relative flex-1 aspect-square select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
  day_button: "w-full h-full min-w-0",
};

export default function MoveDatePicker({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("specific");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  const handleOpen = () => {
    updateCoords();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const popover = document.getElementById("move-date-popover");
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popover &&
        !popover.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScroll = () => updateCoords();
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [open, updateCoords]);

  const parseValue = (): { single?: Date; range?: DateRange } => {
    if (!value) return {};
    if (value.includes(" to ")) {
      const [a, b] = value.split(" to ");
      const from = a ? new Date(a + "T12:00:00") : undefined;
      const to = b && b.length === 10 ? new Date(b + "T12:00:00") : undefined;
      return { range: { from, to } };
    }
    if (value.length === 10) {
      const d = new Date(value + "T12:00:00");
      return isNaN(d.getTime()) ? {} : { single: d };
    }
    return {};
  };

  const { single, range } = parseValue();

  const displayLabel = () => {
    if (!value) return "Select move date";
    if (value.includes(" to ")) {
      const { range: r } = parseValue();
      if (r?.from && r?.to) return `${format(r.from, "MMM d")} – ${format(r.to, "MMM d, yyyy")}`;
      if (r?.from) return `From ${format(r.from, "MMM d, yyyy")} …`;
    }
    if (single) return format(single, "MMMM d, yyyy");
    return "Select move date";
  };

  const handleSpecificSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  const handleRangeSelect = (r: DateRange | undefined) => {
    if (!r) return;
    const sameDay = r.from && r.to && r.from.toDateString() === r.to.toDateString();
    if (r.from && r.to && !sameDay) {
      onChange(`${format(r.from, "yyyy-MM-dd")} to ${format(r.to, "yyyy-MM-dd")}`);
      setTimeout(() => setOpen(false), 500);
    } else if (r.from) {
      onChange(`${format(r.from, "yyyy-MM-dd")} to `);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    onChange("");
  };

  const rawWidth = Math.max(coords.width, 300);
  const popoverWidth = Math.min(rawWidth, window.innerWidth - 16);
  const popoverLeft = Math.min(
    coords.left + window.scrollX,
    window.scrollX + window.innerWidth - popoverWidth - 8
  );

  const popover = open
    ? createPortal(
        <div
          id="move-date-popover"
          style={{
            position: "absolute",
            top: coords.top,
            left: popoverLeft,
            width: popoverWidth,
            zIndex: 9999,
          }}
          className="rounded-xl border bg-white text-popover-foreground shadow-xl overflow-hidden"
        >
          {/* Radio mode selector — stacked vertically */}
          <div className="px-3 pt-3 pb-2 space-y-1.5">
            {(["specific", "range"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted/50"
              >
                {/* Radio circle */}
                <span className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  mode === m ? "border-primary" : "border-muted-foreground/40"
                )}>
                  {mode === m && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  mode === m ? "text-primary" : "text-muted-foreground"
                )}>
                  {m === "specific" ? "Specific Date" : "Date Range"}
                </span>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p className="px-3 pb-1 text-xs text-muted-foreground">
            {mode === "specific"
              ? "Tap a day to select your move date."
              : "Tap your earliest day, then your latest day."}
          </p>

          {/* Calendar */}
          <div className="pb-2">
            {mode === "specific" ? (
              <Calendar
                mode="single"
                selected={single}
                onSelect={handleSpecificSelect}
                disabled={{ before: today }}
                showOutsideDays={false}
                className="[--cell-size:36px] w-full"
                classNames={CALENDAR_CLASSNAMES}
              />
            ) : (
              <Calendar
                mode="range"
                selected={range}
                onSelect={handleRangeSelect}
                disabled={{ before: today }}
                numberOfMonths={1}
                showOutsideDays={false}
                className="[--cell-size:36px] w-full"
                classNames={CALENDAR_CLASSNAMES}
              />
            )}
          </div>

          {/* Range in-progress hint */}
          {mode === "range" && range?.from && !range?.to && (
            <p className="px-3 pb-3 text-xs text-primary font-medium">
              Now tap your latest possible date.
            </p>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="space-y-1.5">
      <Label>Move Date</Label>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
          "hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !value ? "text-muted-foreground" : "text-foreground"
        )}
      >
        <span className="truncate">{displayLabel()}</span>
        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {popover}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
