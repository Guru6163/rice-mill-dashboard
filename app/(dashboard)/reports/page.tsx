"use client";

import { useEffect, useState, useMemo } from "react";
import { getRiceMillRecords } from "../../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function RiceMillRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("last30");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRiceMillRecords();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();
    let fromDate;

    if (filter === "last30") {
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - 30);
    } else if (filter === "thisMonth") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === "thisWeek") {
      const day = now.getDay();
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - day);
    }

    return records
      .filter((r) => {
        const date = r.createdAt?.toDate?.() || new Date(r.createdAt);
        return date >= fromDate!;
      })
      .sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const db = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return da.getTime() - db.getTime();
      })
      .map((r) => {
        const date = r.createdAt?.toDate?.() || new Date(r.createdAt);
        return {
          ...r,
          label: format(date, "MMM d"),
        };
      });
  }, [records, filter]);

  const paginatedData = useMemo(() => {
    const reversed = [...filteredData].reverse();
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return reversed.slice(start, end);
  }, [filteredData, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold text-gray-800">Reports</div>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-x-auto p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="">
                <TableRow>
                  <TableHead className="text-gray-600 font-semibold">
                    Date
                  </TableHead>
                  <TableHead>Total Expense</TableHead>
                  <TableHead>Total Income</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Rice Cost</TableHead>
                  <TableHead>Rice Bags</TableHead>
                  <TableHead>Total OutTurn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record, idx) => (
                  <TableRow
                    key={record.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}
                  >
                    <TableCell>{record.label}</TableCell>
                    <TableCell>₹{record.totalExpense.toFixed(2)}</TableCell>
                    <TableCell>₹{record.totalIncome.toFixed(2)}</TableCell>
                    <TableCell>₹{record.grossCost.toFixed(2)}</TableCell>
                    <TableCell>₹{record.riceCost.toFixed(8)}</TableCell>
                    <TableCell>{record.riceBags}</TableCell>
                    <TableCell>{record.totalOutTurn.toFixed(8)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t rounded-b-2xl">
            <span className="text-sm text-gray-600">
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / recordsPerPage)}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    p < Math.ceil(filteredData.length / recordsPerPage)
                      ? p + 1
                      : p
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredData.length / recordsPerPage)
                }
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
