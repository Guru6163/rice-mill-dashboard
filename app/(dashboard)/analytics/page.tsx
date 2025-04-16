"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRiceMillRecords } from "@/app/api/api";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format } from "date-fns";

export default function RiceMillAnalytics() {
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState("last30");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRiceMillRecords();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date();
    let fromDate: number | Date;

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
        const date =
          r.createdAt?.toDate?.() || new Date(r.createdAt.seconds * 1000);
        return date >= fromDate;
      })
      .sort((a, b) => {
        const da =
          a.createdAt?.toDate?.() || new Date(a.createdAt.seconds * 1000);
        const db =
          b.createdAt?.toDate?.() || new Date(b.createdAt.seconds * 1000);
        return da.getTime() - db.getTime();
      })
      .map((r) => {
        const date =
          r.createdAt?.toDate?.() || new Date(r.createdAt.seconds * 1000);
        return {
          ...r,
          label: format(date, "MMM d"),
        };
      });
  }, [records, filter]);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-8">
      {/* Header and Filter */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Rice Mill Analytics
        </h1>
        <Select onValueChange={setFilter} defaultValue="last30">
          <SelectTrigger className="w-[160px] text-sm shadow-sm bg-white hover:bg-gray-100 transition">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Income vs Expense */}
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Income vs Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalIncome"
                stroke="#4ade80"
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="totalExpense"
                stroke="#f87171"
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rice Bags */}
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Rice Bags</CardTitle>
        </CardHeader>
        <CardContent className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="riceBags" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* OutTurn */}
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">OutTurn</CardTitle>
        </CardHeader>
        <CardContent className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalOutTurn"
                stroke="#34d399"
                name="OutTurn"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
