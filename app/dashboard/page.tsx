"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

type ExpenseItem = {
  id: string;
  name: string;
  qty: number;
  rate: number;
  amount: number;
};

type IncomeItem = {
  id: string;
  name: string;
  qty: number;
  rate: number;
  amount: number;
};

type OutputItem = {
  product: string;
  outTurn: number;
};

export default function page() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [outputs, setOutputs] = useState<OutputItem[]>([
    { product: "RICE", outTurn: 0 },
    { product: "BROKEN", outTurn: 0 },
    { product: "BLACK RICE", outTurn: 0 },
    { product: "HUSK", outTurn: 0 },
  ]);

  const [riceBags, setRiceBags] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [grossCost, setGrossCost] = useState<number>(0);
  const [riceCost, setRiceCost] = useState<number>(0);
  const [totalOutTurn, setTotalOutTurn] = useState<number>(0);

  const [newExpenseName, setNewExpenseName] = useState<string>("");
  const [newIncomeName, setNewIncomeName] = useState<string>("");

  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSave = async () => {
    const dataToSave = {
      expenses,
      incomes,
      outputs,
      riceBags,
      totalExpense,
      totalIncome,
      grossCost,
      riceCost,
      totalOutTurn,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "rice-mill-records"), dataToSave);
      alert("Data saved successfully!");
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data. Try again.");
    }
  };

  useEffect(() => {
    // Calculate totals
    const expTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
    const incTotal = incomes.reduce((sum, item) => sum + item.amount, 0);
    const gross = incTotal - expTotal;
    const rCost = riceBags > 0 ? gross / riceBags : 0;
    const outTurnTotal = outputs.reduce((sum, item) => sum + item.outTurn, 0);

    setTotalExpense(expTotal);
    setTotalIncome(incTotal);
    setGrossCost(gross);
    setRiceCost(rCost);
    setTotalOutTurn(outTurnTotal);
  }, [expenses, incomes, outputs, riceBags]);

  const updateExpenseItem = (
    id: string,
    field: keyof ExpenseItem,
    value: any
  ) => {
    setExpenses((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount if qty or rate changes
          if (field === "qty" || field === "rate") {
            updated.amount = updated.qty * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const updateIncomeItem = (
    id: string,
    field: keyof IncomeItem,
    value: any
  ) => {
    setIncomes((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate amount if qty or rate changes
          if (field === "qty" || field === "rate") {
            updated.amount = updated.qty * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addExpenseItem = () => {
    if (!newExpenseName) return;

    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: newExpenseName,
      qty: 0,
      rate: 0,
      amount: 0,
    };

    setExpenses((prev) => [...prev, newItem]);
    setNewExpenseName("");
  };

  const addIncomeItem = () => {
    if (!newIncomeName) return;

    const newItem: IncomeItem = {
      id: Date.now().toString(),
      name: newIncomeName,
      qty: 0,
      rate: 0,
      amount: 0,
    };

    setIncomes((prev) => [...prev, newItem]);
    setNewIncomeName("");
  };

  const removeExpenseItem = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const removeIncomeItem = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Expenses Section */}
        <Card>
          <CardHeader className="bg-[#f0c14b] p-3">
            <CardTitle className="text-lg">Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="w-full overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] md:w-[180px]">ITEM</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>RATE</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateExpenseItem(item.id, "name", e.target.value)
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateExpenseItem(
                            item.id,
                            "qty",
                            Number(e.target.value)
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateExpenseItem(
                            item.id,
                            "rate",
                            Number(e.target.value)
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExpenseItem(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex gap-2">
                      <Input
                        placeholder="New expense item"
                        value={newExpenseName}
                        onChange={(e) => setNewExpenseName(e.target.value)}
                        className="h-8 w-full text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addExpenseItem}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell>{totalExpense.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Incomes Section */}
        <Card>
          <CardHeader className="bg-[#f0c14b] p-3">
            <CardTitle className="text-lg">Incomes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="w-full overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] md:w-[180px]">ITEM</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>RATE</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateIncomeItem(item.id, "name", e.target.value)
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateIncomeItem(
                            item.id,
                            "qty",
                            Number(e.target.value)
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateIncomeItem(
                            item.id,
                            "rate",
                            Number(e.target.value)
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIncomeItem(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex gap-2">
                      <Input
                        placeholder="New income item"
                        value={newIncomeName}
                        onChange={(e) => setNewIncomeName(e.target.value)}
                        className="h-8 w-full text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addIncomeItem}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell>{totalIncome.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gross-cost">GROSS COST</Label>
                  <Input
                    id="gross-cost"
                    value={grossCost.toFixed(2)}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="rice-bags">NO OF RICE BAGS</Label>
                  <Input
                    id="rice-bags"
                    type="number"
                    value={riceBags}
                    onChange={(e) => setRiceBags(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="rice-cost">RICE COST/26KG BAG</Label>
                <Input
                  id="rice-cost"
                  value={riceCost.toFixed(8)}
                  readOnly
                  className="bg-[#a6d3e8] font-bold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Table className="w-full overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>PRODUCT</TableHead>
                  <TableHead>OUT-TURN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outputs.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.product}
                        onChange={(e) =>
                          setOutputs((prev) =>
                            prev.map((output, i) =>
                              i === index
                                ? { ...output, product: e.target.value }
                                : output
                            )
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.outTurn}
                        onChange={(e) =>
                          setOutputs((prev) =>
                            prev.map((output, i) =>
                              i === index
                                ? { ...output, outTurn: Number(e.target.value) }
                                : output
                            )
                          )
                        }
                        className="h-8 w-full text-sm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>TOTAL OUT TURN</TableCell>
                  <TableCell className="bg-[#f0e14b]">
                    {totalOutTurn.toFixed(8)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center">
        <Button onClick={() => setShowSaveModal(true)} className="px-6 py-2">
          Save Data
        </Button>
      </div>

      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Total Expense:</strong> ₹{totalExpense.toFixed(2)}
            </p>
            <p>
              <strong>Total Income:</strong> ₹{totalIncome.toFixed(2)}
            </p>
            <p>
              <strong>Gross Cost:</strong> ₹{grossCost.toFixed(2)}
            </p>
            <p>
              <strong>Rice Bags:</strong> {riceBags}
            </p>
            <p>
              <strong>Rice Cost per 26kg Bag:</strong> ₹{riceCost.toFixed(8)}
            </p>
            <p>
              <strong>Total Out Turn:</strong> {totalOutTurn.toFixed(8)}
            </p>
          </div>
          <DialogFooter>
            <Button className="-mb-2 w-full" onClick={handleSave}>
              Save Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="text-center text-xs mt-10">Developed by GuruF❤️</div>
    </div>
  );
}
