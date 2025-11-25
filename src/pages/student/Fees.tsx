import StudentNav from "@/components/student/StudentNav";
import { ChevronLeft } from "lucide-react";
import { feeStatus } from "@/data/studentMockData";
import { useNavigate } from "react-router-dom";

const Fees = () => {
  const navigate = useNavigate();

  return (
    <StudentNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold">Fee Details</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Paid</p>
              <p className="text-3xl md:text-4xl font-bold">₹{feeStatus.paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending</p>
              <p className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                ₹{feeStatus.pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div>
            <h2 className="text-xl font-bold mb-4">Fee Breakdown</h2>
            <div className="space-y-3">
              {feeStatus.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-base">{item.item}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-medium ${
                        item.status === "Paid"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-base font-semibold min-w-[100px] text-right">
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium text-base">Apr 22</p>
                  <p className="text-sm text-muted-foreground">Paid</p>
                </div>
                <span className="text-base font-semibold">₹15,000</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium text-base">Mar 5</p>
                  <p className="text-sm text-muted-foreground">Paid</p>
                </div>
                <span className="text-base font-semibold">₹15,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentNav>
  );
};

export default Fees;
