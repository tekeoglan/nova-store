import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => ReactNode;
}

interface ReportsTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function ReportsTable({ columns, data, emptyMessage = 'Veri bulunamadı.' }: ReportsTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-slate-200 text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 text-sm font-semibold text-slate-600">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, itemIdx) => (
            <tr key={itemIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-4 text-sm text-slate-600">
                  {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
