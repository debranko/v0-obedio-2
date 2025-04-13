import type React from "react"

interface Column {
  key: string
  header: React.ReactNode
  cell?: (row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  emptyMessage?: string
}

export function DataTable({ columns, data, emptyMessage = "No data available" }: DataTableProps) {
  if (!data.length) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="border-b hover:bg-muted/50 transition-colors">
              {columns.map((column) => (
                <td key={`${row.id || rowIndex}-${column.key}`} className="px-4 py-3 text-sm">
                  {column.cell ? column.cell(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
