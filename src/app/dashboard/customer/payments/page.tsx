
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPaymentsPage() {
  const transactions = [
    { id: "TX-1001", date: "2024-05-20", land: "Hyderabad Central Mall", amount: 40, status: "completed" },
    { id: "TX-1002", date: "2024-05-18", land: "Hitech City Corp", amount: 90, status: "completed" },
    { id: "TX-1003", date: "2024-05-15", land: "Gachibowli Square", amount: 20, status: "refunded" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Payments & Invoices</h1>
        <p className="text-muted-foreground">Manage your payment methods and view transaction history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹450.00</div>
            <Button variant="secondary" className="w-full mt-4 font-bold">Add Money</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Saved Cards</CardTitle>
            <CardDescription>Quick pay with your saved methods</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="border rounded-xl p-4 flex items-center gap-4 w-full max-w-[240px]">
              <div className="bg-muted p-2 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">VISA •••• 4242</div>
                <div className="text-xs text-muted-foreground">Exp: 12/26</div>
              </div>
            </div>
            <Button variant="outline" className="h-auto border-dashed">
              + Add New
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell className="font-medium">{tx.land}</TableCell>
                  <TableCell>₹{tx.amount}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
