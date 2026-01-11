import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  BookOpen, 
  Keyboard, 
  Mic, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  Star,
  Clock,
  Target,
  Volume2,
  ArrowLeft,
  Trophy,
  Zap,
  RotateCcw,
  Award,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import StudentNav from '@/components/student/StudentNav';
import { 
  grammarLessons, 
  speakingActivities, 
  typingLessons,
  mockUserProgress,
  GrammarLesson,
  SpeakingActivity,
  TypingLesson
} from '@/data/communicationMockData';
import { cn } from '@/lib/utils';

type Section = 'main' | 'grammar' | 'speaking' | 'typing';
type SubView = 'list' | 'lesson' | 'exercise' | 'practice';

const Communication = () => {
  const [section, setSection] = useState<Section>('main');
  const [subView, setSubView] = useState<SubView>('list');
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarLesson | null>(null);
  const [selectedSpeaking, setSelectedSpeaking] = useState<SpeakingActivity | null>(null);
  const [selectedTyping, setSelectedTyping] = useState<TypingLesson | null>(null);
  
  // Grammar exercise state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  
  // Typing practice state
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [typingStats, setTypingStats] = useState({ wpm: 0, accuracy: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'pronunciation': return <Volume2 className="h-4 w-4" />;
      case 'conversation': return <MessageSquare className="h-4 w-4" />;
      case 'storytelling': return <BookOpen className="h-4 w-4" />;
      case 'debate': return <Mic className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleBack = () => {
    if (subView === 'exercise' || subView === 'practice') {
      setSubView('lesson');
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setTypedText('');
      setStartTime(null);
      setEndTime(null);
    } else if (subView === 'lesson') {
      setSubView('list');
      setSelectedGrammar(null);
      setSelectedSpeaking(null);
      setSelectedTyping(null);
    } else {
      setSection('main');
    }
  };

  // Grammar exercise handlers
  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !selectedGrammar) return;
    
    const isCorrect = selectedAnswer === selectedGrammar.exercises[currentQuestion].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (!selectedGrammar) return;
    
    if (currentQuestion < selectedGrammar.exercises.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Typing handlers
  const handleTypingStart = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedText(value);
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    if (selectedTyping && value.length === selectedTyping.text.length) {
      const end = Date.now();
      setEndTime(end);
      calculateStats(value, end);
    }
  };

  const calculateStats = useCallback((typed: string, end: number) => {
    if (!selectedTyping || !startTime) return;
    
    const timeInMinutes = (end - startTime) / 60000;
    const words = selectedTyping.text.split(' ').length;
    const wpm = Math.round(words / timeInMinutes);
    
    let correctChars = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === selectedTyping.text[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / typed.length) * 100);
    
    setTypingStats({ wpm, accuracy });
  }, [selectedTyping, startTime]);

  const resetTyping = () => {
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setTypingStats({ wpm: 0, accuracy: 0 });
    inputRef.current?.focus();
  };

  const renderMainMenu = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Communication Skills
        </h1>
        <p className="text-muted-foreground mt-2">
          Improve your English speaking, writing, and typing skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-xl hover:border-green-500/50 transition-all duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20"
            onClick={() => setSection('grammar')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-xl">Grammar</CardTitle>
              <CardDescription>
                Learn English grammar rules with examples and exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{grammarLessons.length} lessons</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Start Learning
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20"
            onClick={() => setSection('speaking')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                <Mic className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl">Spoken English</CardTitle>
              <CardDescription>
                Practice speaking with guided activities and prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{speakingActivities.length} activities</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Start Speaking
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20"
            onClick={() => setSection('typing')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Keyboard className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="text-xl">Fast Typing</CardTitle>
              <CardDescription>
                Improve your typing speed and accuracy with practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{typingLessons.length} lessons</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  Start Typing
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-400" />
                <span className="font-medium">Grammar</span>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">2 of 6 lessons completed</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Speaking</span>
              </div>
              <Progress value={12} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">1 of 8 activities completed</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="h-4 w-4 text-purple-400" />
                <span className="font-medium">Typing</span>
              </div>
              <Progress value={20} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">2 of 10 lessons completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGrammarList = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Grammar Lessons</h1>
          <p className="text-muted-foreground">Master English grammar rules</p>
        </div>
      </div>

      <div className="grid gap-4">
        {grammarLessons.map((lesson, index) => {
          const progress = mockUserProgress.find(p => p.lessonId === lesson.id);
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                onClick={() => { setSelectedGrammar(lesson); setSubView('lesson'); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        progress?.completed ? "bg-green-500/20" : "bg-primary/10"
                      )}>
                        {progress?.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {lesson.exercises.length} exercises
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderGrammarLesson = () => {
    if (!selectedGrammar) return null;

    if (subView === 'exercise') {
      const question = selectedGrammar.exercises[currentQuestion];
      const isComplete = currentQuestion === selectedGrammar.exercises.length - 1 && showResult;

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedGrammar.title}</h1>
              <p className="text-muted-foreground">Exercise {currentQuestion + 1} of {selectedGrammar.exercises.length}</p>
            </div>
          </div>

          <Progress value={(currentQuestion / selectedGrammar.exercises.length) * 100} className="h-2" />

          {!isComplete ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
                
                <RadioGroup 
                  value={selectedAnswer?.toString()} 
                  onValueChange={(v) => handleAnswerSelect(parseInt(v))}
                  disabled={showResult}
                >
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border transition-all",
                          showResult && idx === question.correctAnswer && "bg-green-500/20 border-green-500",
                          showResult && selectedAnswer === idx && idx !== question.correctAnswer && "bg-red-500/20 border-red-500",
                          !showResult && selectedAnswer === idx && "border-primary bg-primary/10"
                        )}
                      >
                        <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <div className="mt-6 flex gap-4">
                  {!showResult ? (
                    <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      {currentQuestion < selectedGrammar.exercises.length - 1 ? 'Next Question' : 'See Results'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Exercise Complete!</h2>
                <p className="text-muted-foreground mb-4">
                  You scored {score} out of {selectedGrammar.exercises.length}
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    setScore(0);
                  }}>
                    Try Again
                  </Button>
                  <Button onClick={handleBack}>
                    Back to Lessons
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedGrammar.title}</h1>
            <p className="text-muted-foreground">{selectedGrammar.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Topics Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedGrammar.topics.map((topic, idx) => (
                <Badge key={idx} variant="secondary">{topic}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedGrammar.examples.map((example, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p className="text-green-400">{example.correct}</p>
                </div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 flex items-center justify-center text-red-500">✗</span>
                  <p className="text-red-400 line-through">{example.incorrect}</p>
                </div>
                <p className="text-sm text-muted-foreground ml-8">{example.explanation}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={() => setSubView('exercise')}>
          <Play className="h-4 w-4 mr-2" />
          Start Exercise
        </Button>
      </div>
    );
  };

  const renderSpeakingList = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Speaking Activities</h1>
          <p className="text-muted-foreground">Practice your spoken English</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="storytelling">Storytelling</TabsTrigger>
          <TabsTrigger value="debate">Debate</TabsTrigger>
        </TabsList>

        {['all', 'pronunciation', 'conversation', 'storytelling', 'debate'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
            {speakingActivities
              .filter(a => tab === 'all' || a.type === tab)
              .map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                    onClick={() => { setSelectedSpeaking(activity); setSubView('lesson'); }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            {getActivityTypeIcon(activity.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getDifficultyColor(activity.difficulty)}>
                                {activity.difficulty}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration} min
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const renderSpeakingLesson = () => {
    if (!selectedSpeaking) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedSpeaking.title}</h1>
            <p className="text-muted-foreground">{selectedSpeaking.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-400" />
                Speaking Prompts
              </CardTitle>
              <CardDescription>Practice saying these out loud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSpeaking.prompts.map((prompt, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-400">
                      {idx + 1}
                    </div>
                    <p className="text-foreground">{prompt}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedSpeaking.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-6 text-center">
            <Mic className="h-12 w-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-muted-foreground mb-4">
              Read each prompt aloud, record yourself if possible, and listen back to improve!
            </p>
            <div className="flex gap-2 justify-center">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedSpeaking.duration} minutes
              </Badge>
              <Badge variant="outline" className="capitalize">
                {selectedSpeaking.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTypingList = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Fast Typing Practice</h1>
          <p className="text-muted-foreground">Improve your typing speed and accuracy</p>
        </div>
      </div>

      <div className="grid gap-4">
        {typingLessons.map((lesson, index) => {
          const progress = mockUserProgress.find(p => p.lessonId === lesson.id);
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                onClick={() => { setSelectedTyping(lesson); setSubView('lesson'); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        progress?.completed ? "bg-green-500/20" : "bg-purple-500/20"
                      )}>
                        {progress?.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Keyboard className="h-6 w-6 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {lesson.targetWPM} WPM
                          </Badge>
                          {progress?.bestWPM && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-yellow-400" />
                              Best: {progress.bestWPM} WPM
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderTypingLesson = () => {
    if (!selectedTyping) return null;

    if (subView === 'practice') {
      const isComplete = endTime !== null;
      const targetMet = typingStats.wpm >= selectedTyping.targetWPM && typingStats.accuracy >= selectedTyping.targetAccuracy;

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedTyping.title}</h1>
              <p className="text-muted-foreground">Type the text below as fast and accurately as you can</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Text to type */}
              <div className="p-6 rounded-lg bg-muted/50 font-mono text-lg leading-relaxed mb-6">
                {selectedTyping.text.split('').map((char, idx) => {
                  let className = 'text-muted-foreground';
                  if (idx < typedText.length) {
                    className = typedText[idx] === char ? 'text-green-400' : 'text-red-400 bg-red-500/20';
                  } else if (idx === typedText.length) {
                    className = 'bg-primary/30 text-foreground';
                  }
                  return (
                    <span key={idx} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={typedText}
                onChange={handleTypingChange}
                onFocus={handleTypingStart}
                disabled={isComplete}
                placeholder="Start typing here..."
                className="w-full p-4 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-lg"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              {/* Stats */}
              {(startTime || isComplete) && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                    <p className="text-sm text-muted-foreground">Speed</p>
                    <p className="text-3xl font-bold text-purple-400">{typingStats.wpm} WPM</p>
                    <p className="text-xs text-muted-foreground">Target: {selectedTyping.targetWPM} WPM</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-3xl font-bold text-blue-400">{typingStats.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Target: {selectedTyping.targetAccuracy}%</p>
                  </div>
                </div>
              )}

              {isComplete && (
                <div className={cn(
                  "mt-6 p-4 rounded-lg text-center",
                  targetMet ? "bg-green-500/20 border border-green-500/30" : "bg-yellow-500/20 border border-yellow-500/30"
                )}>
                  {targetMet ? (
                    <>
                      <Award className="h-8 w-8 mx-auto text-green-400 mb-2" />
                      <p className="font-semibold text-green-400">Excellent! You met the target!</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-yellow-400">Good effort! Keep practicing to meet the target.</p>
                    </>
                  )}
                  <Button className="mt-4" onClick={resetTyping}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {!isComplete && !startTime && (
                <p className="text-center text-muted-foreground mt-4">
                  Click the input field and start typing to begin
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedTyping.title}</h1>
            <p className="text-muted-foreground">{selectedTyping.description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Target className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{selectedTyping.targetWPM}</p>
                <p className="text-sm text-muted-foreground">Target WPM</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle className="h-6 w-6 mx-auto text-green-400 mb-2" />
                <p className="text-2xl font-bold">{selectedTyping.targetAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Target Accuracy</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <BookOpen className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold">{selectedTyping.text.split(' ').length}</p>
                <p className="text-sm text-muted-foreground">Words</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
              <p className="text-muted-foreground">{selectedTyping.text.substring(0, 100)}...</p>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={() => { setSubView('practice'); }}>
          <Keyboard className="h-4 w-4 mr-2" />
          Start Typing Practice
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (section) {
      case 'grammar':
        if (subView === 'lesson' || subView === 'exercise') return renderGrammarLesson();
        return renderGrammarList();
      case 'speaking':
        if (subView === 'lesson') return renderSpeakingLesson();
        return renderSpeakingList();
      case 'typing':
        if (subView === 'lesson' || subView === 'practice') return renderTypingLesson();
        return renderTypingList();
      default:
        return renderMainMenu();
    }
  };

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${section}-${subView}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </StudentNav>
  );
};

export default Communication;
