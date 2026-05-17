import React from "react";

export default function EmptyState({ hint = "No data to display." }) {
  return (
    <div className="h-[320px] w-full flex items-center justify-center text-gray-500 text-sm">
      {hint}
    </div>
  );
}
