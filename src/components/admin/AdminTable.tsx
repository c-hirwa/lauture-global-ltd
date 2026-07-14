import { ReactNode } from "react";

interface Props {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

const AdminTable = ({ headers, children, emptyMessage = "No records found.", isEmpty }: Props) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-muted/80 border-b border-border backdrop-blur">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-14 text-center text-muted-foreground">
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
    className={`border-b border-border/60 last:border-0 ${
      index % 2 === 0 ? "bg-card" : "bg-muted/40"
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
  <td className={`px-4 py-3.5 text-foreground/80 whitespace-nowrap ${className}`}>{children}</td>
);

export default AdminTable;
