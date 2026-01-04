import { useState } from "react";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";

const Fees = () => {
  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-card border border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Fee Management</h3>
            <p className="text-sm text-muted-foreground">
              Fee management module is coming soon. This will include tracking of student fees, payment history, and pending dues.
            </p>
          </CardContent>
        </Card>

        {/* Summary Cards - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <Card className="bg-card border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Total Collected</p>
                  <p className="text-2xl md:text-3xl font-bold truncate">--</p>
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
                  <p className="text-2xl md:text-3xl font-bold text-destructive truncate">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-primary/5 border border-primary/20 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  Detailed fee tracking and payment management will be available in the next update.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrincipalNav>
  );
};

export default Fees;