import PrincipalNav from "@/components/principal/PrincipalNav";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, PieChart, DollarSign, Settings, Search, ArrowLeft } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();

  const reportCategories = [
    {
      title: "Attendance",
      description: "View daily teacher attendance and student summary",
      icon: ClipboardCheck,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      route: "/principal/attendance",
    },
    {
      title: "Results",
      description: "Get an overview of exam and test performance",
      icon: PieChart,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      route: "#",
    },
    {
      title: "Fees",
      description: "Track pending and paid fee amounts",
      icon: DollarSign,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      route: "#",
    },
    {
      title: "Other",
      description: "Basic reports for other functions",
      icon: Settings,
      iconColor: "text-muted-foreground",
      bgColor: "bg-muted",
      route: "#",
    },
  ];

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-4">
        {reportCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card
              key={index}
              className="bg-card border border-border rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => category.route !== "#" && navigate(category.route)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${category.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${category.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PrincipalNav>
  );
};

export default Reports;
