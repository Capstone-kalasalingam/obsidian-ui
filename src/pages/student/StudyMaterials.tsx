import { useState } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ChevronRight, ChevronLeft, Download } from "lucide-react";
import { studyMaterialsBySubject } from "@/data/studentMockData";

const StudyMaterials = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const subjects = Object.keys(studyMaterialsBySubject);

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    setExpandedChapter(null);
  };

  const handleBack = () => {
    if (expandedChapter !== null) {
      setExpandedChapter(null);
    } else {
      setSelectedSubject(null);
    }
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        {(selectedSubject || expandedChapter !== null) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {!selectedSubject ? (
          /* Subjects List */
          <div className="space-y-3">
            {subjects.map((subject) => (
              <Card
                key={subject}
                className="cursor-pointer hover:shadow-md transition-all border shadow-sm"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {studyMaterialsBySubject[subject].length} chapters
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : expandedChapter === null ? (
          /* Chapters List */
          <div className="space-y-3">
            {studyMaterialsBySubject[selectedSubject].map((chapter) => (
              <Card
                key={chapter.id}
                className="cursor-pointer hover:shadow-md transition-all border shadow-sm"
                onClick={() => toggleChapter(chapter.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary font-medium">{chapter.chapter}</p>
                      <h3 className="text-base font-semibold">{chapter.title}</h3>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Chapter Details */
          <div className="space-y-6 animate-fade-in">
            {(() => {
              const chapter = studyMaterialsBySubject[selectedSubject].find(
                ch => ch.id === expandedChapter
              );
              return (
                <>
                  <Card className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">{chapter?.chapter}: {chapter?.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-2">What are {chapter?.title}?</h4>
                      <p className="text-muted-foreground mb-6">
                        {chapter?.description}
                      </p>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-blue-50 dark:bg-blue-950">
                    <CardContent className="p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Demo Mode:</strong> Download function is disabled in the demo version.
                      </p>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </StudentNav>
  );
};

export default StudyMaterials;
