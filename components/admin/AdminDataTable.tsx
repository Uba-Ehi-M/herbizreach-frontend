"use client";

import { flexRender, type Table as TanTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface AdminDataTableProps<TData> {
  table: TanTable<TData>;
  emptyMessage?: string;
  className?: string;
}

export function AdminDataTable<TData>({
  table,
  emptyMessage = "No rows to display.",
  className,
}: AdminDataTableProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)]">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap px-3 py-3 font-semibold text-[var(--text-secondary)] first:pl-4 last:pr-4 sm:px-4"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-4 py-10 text-center text-[var(--text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-subtle)]/80"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="max-w-[min(280px,40vw)] truncate px-3 py-3 align-middle text-[var(--text-primary)] first:pl-4 last:pr-4 sm:px-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
