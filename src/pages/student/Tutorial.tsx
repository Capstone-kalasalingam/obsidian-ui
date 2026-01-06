import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentNav from "@/components/student/StudentNav";
import { tutorialSubjects, Subject, Chapter } from "@/data/tutorialMockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle2,
  Lock,
  BookOpen,
  Video,
  ClipboardList,
} from "lucide-react";

export default function Tutorial() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
  };

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBack = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-6">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {(selectedSubject || selectedChapter) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-xl"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                {selectedChapter
                  ? selectedChapter.title
                  : selectedSubject
                  ? selectedSubject.name
                  : "Tutorial"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedChapter
                  ? `Chapter ${selectedChapter.number}`
                  : selectedSubject
                  ? `${selectedSubject.completedChapters}/${selectedSubject.totalChapters} chapters completed`
                  : "Andhra Pradesh State Board - Class 10"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            {/* Subjects Grid */}
            {!selectedSubject && (
              <motion.div
                key="subjects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tutorialSubjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        onClick={() => handleSubjectClick(subject)}
                        className="p-4 lg:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/30 bg-card group"
                      >
                        <div
                          className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl lg:text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          {subject.icon}
                        </div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {subject.totalChapters} Chapters
                        </p>
                        <Progress
                          value={
                            (subject.completedChapters / subject.totalChapters) *
                            100
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {subject.completedChapters} of {subject.totalChapters}{" "}
                          completed
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chapters List */}
            {selectedSubject && !selectedChapter && (
              <motion.div
                key="chapters"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Subject Header */}
                <Card className="p-4 lg:p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-0">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedSubject.color} flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {selectedSubject.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground">
                        {selectedSubject.name}
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{selectedSubject.totalChapters} chapters</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            {selectedSubject.completedChapters} completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Overall Progress
                      </span>
                      <span className="font-medium text-foreground">
                        {Math.round(
                          (selectedSubject.completedChapters /
                            selectedSubject.totalChapters) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedSubject.completedChapters /
                          selectedSubject.totalChapters) *
                        100
                      }
                      className="h-3"
                    />
                  </div>
                </Card>

                {/* Chapters */}
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-3">
                    {selectedSubject.chapters.map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card
                          onClick={() => handleChapterClick(chapter)}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
                            chapter.isCompleted
                              ? "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : chapter.progress > 0
                              ? "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                              : "border-l-muted hover:border-l-primary"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                                chapter.isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : chapter.progress > 0
                                  ? "bg-amber-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {chapter.isCompleted ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                chapter.number
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-foreground truncate">
                                    {chapter.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {chapter.description}
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                              </div>
                              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {chapter.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Video className="h-3.5 w-3.5" />
                                  {chapter.videoCount} videos
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5" />
                                  {chapter.notesCount} notes
                                </span>
                              </div>
                              {chapter.progress > 0 && !chapter.isCompleted && (
                                <div className="mt-2">
                                  <Progress
                                    value={chapter.progress}
                                    className="h-1.5"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}

            {/* Chapter Detail */}
            {selectedChapter && (
              <motion.div
                key="chapter-detail"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Chapter Header */}
                <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant={
                          selectedChapter.isCompleted ? "default" : "secondary"
                        }
                        className={`mb-2 ${
                          selectedChapter.isCompleted
                            ? "bg-emerald-500"
                            : selectedChapter.progress > 0
                            ? "bg-amber-500"
                            : ""
                        }`}
                      >
                        {selectedChapter.isCompleted
                          ? "Completed"
                          : selectedChapter.progress > 0
                          ? `${selectedChapter.progress}% Complete`
                          : "Not Started"}
                      </Badge>
                      <h2 className="text-xl font-bold text-foreground mb-1">
                        Chapter {selectedChapter.number}:{" "}
                        {selectedChapter.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedChapter.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedChapter.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {selectedChapter.videoCount} Videos
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {selectedChapter.notesCount} Notes
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-4 w-4" />
                      {selectedChapter.quizCount} Quizzes
                    </span>
                  </div>
                  {selectedChapter.progress > 0 &&
                    !selectedChapter.isCompleted && (
                      <div className="mt-4">
                        <Progress
                          value={selectedChapter.progress}
                          className="h-2"
                        />
                      </div>
                    )}
                </Card>

                {/* Content Sections */}
                <div className="space-y-4">
                  {/* Videos Section */}
                  <Card className="overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-foreground">
                          Video Lessons
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {Array.from({ length: selectedChapter.videoCount }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                              <Play className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {selectedChapter.title} - Part {i + 1}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {10 + i * 5} minutes
                              </p>
                            </div>
                            {i < Math.ceil(selectedChapter.progress / 33) && (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </Card>

                  {/* Notes Section */}
                  <Card className="overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold text-foreground">
                          Study Notes
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {Array.from({ length: selectedChapter.notesCount }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {i === 0
                                  ? "Chapter Summary"
                                  : i === 1
                                  ? "Key Concepts"
                                  : `Practice Notes - ${i}`}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                PDF • {3 + i} pages
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </Card>

                  {/* Quiz Section */}
                  <Card className="overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-foreground">
                          Practice Quizzes
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {Array.from({ length: selectedChapter.quizCount }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                              <ClipboardList className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {i === 0 ? "Quick Quiz" : "Practice Test"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {10 + i * 5} questions • {15 + i * 10} mins
                              </p>
                            </div>
                            {i === 0 && selectedChapter.progress >= 50 && (
                              <Badge className="bg-emerald-500">
                                Completed
                              </Badge>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </Card>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    className="w-full rounded-xl h-14 text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Play className="h-5 w-5" />
                    {selectedChapter.progress > 0 && !selectedChapter.isCompleted
                      ? "Continue Learning"
                      : selectedChapter.isCompleted
                      ? "Review Chapter"
                      : "Start Chapter"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </StudentNav>
  );
}
