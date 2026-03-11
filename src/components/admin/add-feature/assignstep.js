
"use client";
import { useState, useMemo, useRef } from "react";
import { Search, X as XIcon, Check, CheckCircle2 } from "lucide-react";

export default function AssignStep({
  title,
  description,
  items,
  selected,
  onToggle,
  icon: Icon,
  color = "blue",
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  };

  const selectedColorClasses = {
    blue: "bg-blue-600 border-blue-600",
    emerald: "bg-emerald-600 border-emerald-600",
    violet: "bg-violet-600 border-violet-600",
    amber: "bg-amber-600 border-amber-600",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]}`}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-10 text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>

      <div className="max-h-[320px] overflow-y-auto border rounded-xl">
        {filtered.map((item) => {
          const isChecked = selected.includes(item._id);
          return (
            <div
              key={item._id}
              onClick={() => onToggle(item._id)}
              className={`flex cursor-pointer items-center gap-4 px-4 py-3 ${
                isChecked ? "bg-slate-50" : "hover:bg-slate-50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-md border-2 ${
                  isChecked
                    ? selectedColorClasses[color]
                    : "border-slate-300"
                }`}
              >
                {isChecked && <Check size={12} className="text-white" />}
              </div>
              <span>{item.name}</span>
              {isChecked && (
                <CheckCircle2 size={16} className="ml-auto text-green-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}