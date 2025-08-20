"use client";

import { useState, useMemo } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

type Row = Record<string, string | number>;

interface DataTableProps {
  headers: string[];
  data: Row[];
  searchQuery: string;
}

export default function DataTable({ headers, data, searchQuery }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(headers.length > 0 ? { key: headers[0], direction: 'asc' } : null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowercasedQuery = searchQuery.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (String(aValue) < String(bValue)) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (String(aValue) > String(bValue)) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card className="shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead
                    key={header}
                    onClick={() => handleSort(header)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center">
                      {header}
                      {getSortIcon(header)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? sortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${header}-${rowIndex}`}>{String(row[header])}</TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
