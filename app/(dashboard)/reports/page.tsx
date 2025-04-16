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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
        console.log(data)
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
      const day = now.getDay(); // 0 (Sun) - 6 (Sat)
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
        return da.getTime() - db.getTime(); // ASC for chart ✅
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
    const reversed = [...filteredData].reverse(); // DESC for table ✅
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reports</h2>
        <Select onValueChange={setFilter} defaultValue="last30">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: "10px" }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="totalIncome"
                stroke="#22c55e"
                name="Income"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="totalExpense"
                stroke="#ef4444"
                name="Expense"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="riceBags"
                stroke="#3b82f6"
                name="Rice Bags"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="totalOutTurn"
                stroke="#facc15"
                name="OutTurn"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Expense</TableHead>
                  <TableHead>Total Income</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Rice Cost</TableHead>
                  <TableHead>Rice Bags</TableHead>
                  <TableHead>Total OutTurn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id}>
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
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / recordsPerPage)}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
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
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
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
