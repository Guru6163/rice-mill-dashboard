"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Plus, Trash2, DollarSign, Package, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

export default function Page() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "1", name: "Paddy", qty: 0, rate: 0, amount: 0 },
    { id: "2", name: "Mill Labour", qty: 0, rate: 0, amount: 0 },
    { id: "3", name: "Other Expenses", qty: 0, rate: 0, amount: 0 },
  ]);

  const [incomes, setIncomes] = useState<IncomeItem[]>([
    { id: "1", name: "Bran", qty: 0, rate: 0, amount: 0 },
    { id: "2", name: "Broken Rice", qty: 0, rate: 0, amount: 0 },
    { id: "3", name: "Black Rice", qty: 0, rate: 0, amount: 0 },
    { id: "4", name: "Silky Bran", qty: 0, rate: 0, amount: 0 },
    { id: "5", name: "Small Broken Rice", qty: 0, rate: 0, amount: 0 },
    { id: "6", name: "Pather", qty: 0, rate: 0, amount: 0 },
    { id: "7", name: "Extra", qty: 0, rate: 0, amount: 0 },
  ]);

  const [outputs, setOutputs] = useState<OutputItem[]>([
    { product: "Rice", outTurn: 0 },
    { product: "Broken", outTurn: 0 },
    { product: "Black Rice", outTurn: 0 },
    { product: "Husk", outTurn: 0 },
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

  const updateItem = <T extends ExpenseItem | IncomeItem>(
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    field: keyof T,
    value: any
  ) => {
    setFn((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "qty" || field === "rate") {
            updated.amount = updated.qty * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = <T extends ExpenseItem | IncomeItem>(
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!name) return;
    const newItem = {
      id: Date.now().toString(),
      name,
      qty: 0,
      rate: 0,
      amount: 0,
    } as T;
    setFn((prev) => [...prev, newItem]);
    setName("");
  };

  const removeItem = <T extends ExpenseItem | IncomeItem>(
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
    id: string
  ) => {
    setFn((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 p-2 md:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            title: "Total Expenses",
            value: `${totalExpense.toLocaleString()} Rs`,
            icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
            desc: `For processing ${riceBags} bags of rice`,
          },
          {
            title: "Total Income",
            value: `${totalIncome.toLocaleString()} Rs`,
            icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
            desc: `From all by-products`,
          },
          {
            title: "Rice Cost Per Bag",
            value: `${riceCost.toFixed(2)} Rs`,
            icon: <Package className="h-4 w-4 text-muted-foreground" />,
            desc: "Per 26KG bag",
          },
        ].map(({ title, value, icon, desc }, idx) => (
          <Card key={idx} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        {[
          {
            key: "expenses",
            data: expenses,
            setFn: setExpenses,
            newName: newExpenseName,
            setName: setNewExpenseName,
          },
          {
            key: "income",
            data: incomes,
            setFn: setIncomes,
            newName: newIncomeName,
            setName: setNewIncomeName,
          },
        ].map(({ key, data, setFn, newName, setName }) => (
          <TabsContent key={key} value={key} className="mt-4">
            <Card className="shadow-md">
              <CardHeader className="bg-rice-green-50 dark:bg-rice-green-900/20 py-3">
                <CardTitle className="text-lg font-semibold capitalize">
                  {key}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ITEM</TableHead>
                      <TableHead>QTY</TableHead>
                      <TableHead>RATE</TableHead>
                      <TableHead>AMOUNT</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateItem(setFn, item.id, "name", e.target.value)
                            }
                            className="h-8 text-sm min-w-0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(
                                setFn,
                                item.id,
                                "qty",
                                Number(e.target.value)
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                setFn,
                                item.id,
                                "rate",
                                Number(e.target.value)
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {item.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(setFn, item.id)}
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
                            placeholder={`New ${key} item`}
                            value={newName}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8 w-full text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItem(setFn, newName, setName)}
                            className="h-8"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-rice-green-50 dark:bg-rice-green-900/20 py-3">
            <CardTitle className="text-lg font-semibold">
              Cost Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gross-cost">GROSS COST</Label>
                <Input
                  id="gross-cost"
                  value={grossCost.toFixed(2)}
                  readOnly
                  className="bg-muted/50 font-medium"
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
                className="bg-rice-green-100 dark:bg-rice-green-900/30 font-bold"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-rice-green-50 dark:bg-rice-green-900/20 py-3 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Output Analysis
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <Table className="min-w-[300px]">
              <TableHeader>
                <TableRow>
                  <TableHead>PRODUCT</TableHead>
                  <TableHead>OUT-TURN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outputs.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.outTurn}
                        onChange={(e) => {
                          const updatedOutputs = [...outputs];
                          updatedOutputs[index].outTurn =
                            parseFloat(e.target.value) || 0;
                          setOutputs(updatedOutputs);
                        }}
                        className="h-8 text-sm font-mono"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>TOTAL OUT TURN</TableCell>
                  <TableCell className="font-mono">
                    {totalOutTurn.toFixed(8)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>


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
      </div>
      <div className="flex justify-center">
          <Button onClick={() => setShowSaveModal(true)} className="px-10 py-2">
            Save Data
          </Button>
        </div>
    </div>
  );
}
