import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto custom-scrollbar rounded-2xl border border-[#202530] bg-[#111318] ${className}`}>
      <table className="w-full text-left text-sm text-zinc-300">
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-[#161920] border-b border-[#202530] text-xs uppercase font-semibold text-zinc-400 tracking-wider">
    {children}
  </thead>
);

export const TableRow: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => (
  <tr
    onClick={onClick}
    className={`border-b border-[#1A1E27] last:border-0 hover:bg-[#151821] transition-colors ${
      onClick ? 'cursor-pointer' : ''
    } ${className}`}
  >
    {children}
  </tr>
);

export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${className}`}>
    {children}
  </td>
);

export const TableHeaderCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <th className={`px-4 sm:px-6 py-3.5 whitespace-nowrap ${className}`}>
    {children}
  </th>
);
