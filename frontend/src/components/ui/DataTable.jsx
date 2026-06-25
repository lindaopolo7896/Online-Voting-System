import { flexRender } from "@tanstack/react-table";

function DataTable({ table }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500 first:rounded-tl-xl last:rounded-tr-xl"
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
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 text-sm text-slate-700 ${
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
        <div className="p-10 text-center text-slate-500">No records found.</div>
      )}
    </div>
  );
}

export default DataTable;
