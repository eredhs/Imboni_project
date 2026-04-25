"use client";

import { X } from "lucide-react";

interface ActiveFiltersProps {
  items: string[];
  onRemove: (item: string) => void;
  onAddFilter?: () => void;
}

export function ActiveFilters({ items, onRemove, onAddFilter }: ActiveFiltersProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-3 mb-6">
      <span className="text-sm font-medium text-[#6B7280]">Quick Picks:</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onRemove(item)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#F3F4F6] text-[#111827] text-sm font-medium rounded-lg hover:bg-[#E5E7EB] transition-colors group"
          >
            <span>{item}</span>
            <X className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280]" />
          </button>
        ))}
      </div>
      {onAddFilter && (
        <button
          onClick={onAddFilter}
          className="text-sm font-semibold text-[#5856D6] hover:underline"
        >
          + Add Filter
        </button>
      )}
    </div>
  );
}
