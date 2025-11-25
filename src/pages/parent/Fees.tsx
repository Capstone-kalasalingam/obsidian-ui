import ParentNav from "@/components/parent/ParentNav";
import { mockChildren, mockFeeDetails } from "@/data/parentMockData";
import { ChevronLeft } from "lucide-react";

const ParentFees = () => {
  const currentChild = mockChildren[0];

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <button className="p-1 -ml-1">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold">Fee Details</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Paid</p>
              <p className="text-3xl md:text-4xl font-bold">₹{mockFeeDetails.paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending</p>
              <p className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                ₹{mockFeeDetails.pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div>
            <h2 className="text-xl font-bold mb-4">Fee Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex-1">
                  <p className="font-medium text-base">Tuition Fee</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Paid</span>
                  <span className="text-base font-semibold min-w-[100px] text-right">₹30,000</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex-1">
                  <p className="font-medium text-base">Library Fees</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Pending</span>
                  <span className="text-base font-semibold min-w-[100px] text-right">₹5,000</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex-1">
                  <p className="font-medium text-base">Transport Fees</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Paid</span>
                  <span className="text-base font-semibold min-w-[100px] text-right">₹8,000</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex-1">
                  <p className="font-medium text-base">Activity Fee</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Pending</span>
                  <span className="text-base font-semibold min-w-[100px] text-right">₹2,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="space-y-3">
              {mockFeeDetails.paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-base">{payment.date}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                  <span className="text-base font-semibold">₹{payment.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentFees;
