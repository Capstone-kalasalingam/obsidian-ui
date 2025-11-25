import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockChildren, mockMarks } from "@/data/parentMockData";
import { FileText, TrendingUp, Award } from "lucide-react";

const ParentMarks = () => {
  const currentChild = mockChildren[0];

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Marks & Performance
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {currentChild.name} - Class {currentChild.class}{currentChild.section}
              </p>
            </div>
            <Badge variant="outline" className="text-xs md:text-sm px-3 py-1.5">
              Demo Only
            </Badge>
          </div>

          {/* Overall Performance */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Award className="h-4 w-4 md:h-5 md:w-5" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Average Score</p>
                  <p className="text-4xl font-bold text-primary">84.4%</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Exams</p>
                  <p className="text-4xl font-bold text-primary">{mockMarks.length}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Best Subject</p>
                  <p className="text-2xl font-bold text-primary">English</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam-wise Marks */}
          {mockMarks.map((exam, index) => (
            <Card key={index} className="shadow-md border-0">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <FileText className="h-4 w-4 md:h-5 md:w-5" />
                      {exam.examName}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Subject-wise performance breakdown
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-base md:text-lg px-3 py-1.5 md:px-4 md:py-2 w-fit">
                    {exam.percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exam.subjects.map((subject) => (
                    <div key={subject.name} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-lg">{subject.name}</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            {subject.marksObtained}
                          </span>
                          <span className="text-muted-foreground">/{subject.totalMarks}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all"
                            style={{ width: `${subject.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[50px] text-right">
                          {subject.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Score */}
                  <div className="p-4 bg-primary/5 border-2 border-primary rounded-lg mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">Total Score</span>
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-primary">
                          {exam.totalObtained}
                        </span>
                        <span className="text-muted-foreground">/{exam.totalMarks}</span>
                        <span className="ml-4 text-xl font-bold text-primary">
                          ({exam.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Subject-wise Analysis */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Subject-wise Average</CardTitle>
              <CardDescription className="text-sm">Performance across all exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Mathematics", "Science", "English", "Social Studies", "Hindi"].map((subject) => {
                  const avg = mockMarks.reduce((sum, exam) => {
                    const subj = exam.subjects.find(s => s.name === subject);
                    return sum + (subj?.percentage || 0);
                  }, 0) / mockMarks.length;

                  return (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="font-medium">{subject}</span>
                      <div className="flex items-center gap-4 flex-1 ml-8">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[60px] text-right">
                          {avg.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentMarks;
