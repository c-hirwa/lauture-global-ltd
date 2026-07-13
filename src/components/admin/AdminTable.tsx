import { ReactNode } from "react";

interface Props {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

const AdminTable = ({ headers, children, emptyMessage = "No records found.", isEmpty }: Props) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export const AdminTableRow = ({
  children,
  index,
  onClick,
}: {
  children: ReactNode;
  index: number;
  onClick?: () => void;
}) => (
  <tr
    onClick={onClick}
    className={`border-b border-slate-100 last:border-0 ${
      index % 2 === 0 ? "bg-white" : "bg-slate-50/80"
    } ${onClick ? "cursor-pointer hover:bg-accent/5 transition-colors" : ""}`}
  >
    {children}
  </tr>
);

export const AdminTableCell = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <td className={`px-4 py-3 text-slate-700 whitespace-nowrap ${className}`}>{children}</td>
);

export default AdminTable;
