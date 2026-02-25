
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GuardReportsPage() {
  const reports = [
    { id: "REP-01", type: "Shift End", date: "2024-05-20", status: "submitted", summary: "All slots cleared. Minor congestion at 6PM." },
    { id: "REP-02", type: "Incident", date: "2024-05-18", status: "reviewed", summary: "Sensor B-12 reported faulty. Notified maintenance." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Duty Reports</h1>
        <p className="text-muted-foreground">Submit daily logs and report incidents.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>New Shift Report</CardTitle>
            <CardDescription>Fill out the daily log before ending your shift.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Shift Summary</Label>
              <Textarea placeholder="Describe the overall parking flow, any technical issues, or notable events..." />
            </div>
            <div className="flex gap-4">
              <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Submit Report
              </Button>
              <Button variant="destructive" className="w-full gap-2">
                <AlertTriangle className="h-4 w-4" /> Report Emergency
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 bg-muted/50 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">{rep.type}</span>
                    <Badge variant="outline" className="text-[10px]">{rep.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rep.summary}</p>
                  <div className="text-[10px] text-muted-foreground">{rep.date}</div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs">View All Logs</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
