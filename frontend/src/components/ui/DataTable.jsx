import { flexRender } from "@tanstack/react-table";

function DataTable({ table }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-surface overflow-x-auto">
      <table className="w-full">
        <thead className="bg-black/5 dark:bg-white/5">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, rowIdx, all) => {
            const isLast = rowIdx === all.length - 1;
            return (
              <tr
                key={row.id}
                className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 text-sm text-text ${
                      isLast
                        ? "first:rounded-bl-xl last:rounded-br-xl"
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && (
        <div className="p-10 text-center text-muted">No records found.</div>
      )}
    </div>
  );
}

export default DataTable;
