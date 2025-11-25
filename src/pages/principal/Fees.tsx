import { useState } from "react";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockStudentFees } from "@/data/mockData";
import { DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Fees = () => {
  const [showPending, setShowPending] = useState(true);

  const filteredFees = showPending
    ? mockStudentFees.filter((fee) => fee.status === "pending" || fee.status === "overdue")
    : mockStudentFees.filter((fee) => fee.status === "paid");

  const totalPaid = mockStudentFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = mockStudentFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <Card className="bg-card border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-2xl md:text-3xl font-bold truncate">₹{totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Total Pending</p>
                  <p className="text-2xl md:text-3xl font-bold text-destructive truncate">
                    ₹{totalPending.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toggle Switch */}
        <Card className="bg-card border border-border rounded-2xl animate-slide-up">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  showPending ? "bg-destructive/10" : "bg-primary/10"
                }`}>
                  {showPending ? (
                    <Clock className="w-5 h-5 text-destructive" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Label htmlFor="fee-toggle" className="text-base font-semibold cursor-pointer block truncate">
                    {showPending ? "Show Pending Fees" : "Show Paid Fees"}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle to switch between pending and paid
                  </p>
                </div>
              </div>
              <Switch
                id="fee-toggle"
                checked={showPending}
                onCheckedChange={setShowPending}
                className="flex-shrink-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fee List */}
        <div className="space-y-3 animate-slide-up">
          <h2 className="text-lg font-bold px-1">
            {showPending ? `Pending Fees (${filteredFees.length})` : `Paid Fees (${filteredFees.length})`}
          </h2>
          
          {filteredFees.length === 0 ? (
            <Card className="bg-card border border-border rounded-2xl">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {showPending ? "No pending fees found" : "No paid fees found"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFees.map((fee) => (
              <Card
                key={fee.id}
                className="bg-card border border-border rounded-2xl hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-base md:text-lg truncate">{fee.studentName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {fee.className} - Section {fee.section}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mt-1">
                        <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                        {fee.status === "overdue" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 text-destructive rounded-full font-medium">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {showPending ? (
                        <>
                          <p className="text-xl md:text-2xl font-bold text-destructive">
                            ₹{fee.pendingAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Paid: ₹{fee.paidAmount.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xl md:text-2xl font-bold text-primary">
                            ₹{fee.paidAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total: ₹{fee.totalFee.toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Fees;
