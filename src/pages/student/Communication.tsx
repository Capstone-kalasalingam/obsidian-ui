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
  GraduationCap,
  Languages,
  Shuffle,
  Lightbulb,
  CircleStop,
  AlertCircle,
  Sparkles,
  Brain
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
  vocabularyCategories,
  mockUserProgress,
  GrammarLesson,
  SpeakingActivity,
  TypingLesson,
  VocabularyWord,
  VocabularyCategory
} from '@/data/communicationMockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Section = 'main' | 'grammar' | 'speaking' | 'typing' | 'vocabulary';
type SubView = 'list' | 'lesson' | 'exercise' | 'practice' | 'flashcard' | 'game';

const Communication = () => {
  const [section, setSection] = useState<Section>('main');
  const [subView, setSubView] = useState<SubView>('list');
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarLesson | null>(null);
  const [selectedSpeaking, setSelectedSpeaking] = useState<SpeakingActivity | null>(null);
  const [selectedTyping, setSelectedTyping] = useState<TypingLesson | null>(null);
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<VocabularyCategory | null>(null);
  
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

  // Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Vocabulary state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabGameWords, setVocabGameWords] = useState<VocabularyWord[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<{id: string, type: 'word' | 'meaning'}[]>([]);
  const [gameScore, setGameScore] = useState(0);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          analyzePronunciation(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const analyzePronunciation = (spokenText: string) => {
    if (!selectedSpeaking) return;
    
    const targetText = selectedSpeaking.prompts[currentPromptIndex].replace(/___/g, '').trim().toLowerCase();
    const spoken = spokenText.toLowerCase().trim();
    
    // Calculate similarity score
    const targetWords = targetText.split(/\s+/);
    const spokenWords = spoken.split(/\s+/);
    
    let matchCount = 0;
    spokenWords.forEach(word => {
      if (targetWords.includes(word)) matchCount++;
    });
    
    const similarity = Math.round((matchCount / Math.max(targetWords.length, 1)) * 100);
    setPronunciationScore(similarity);
    
    // Generate feedback
    if (similarity >= 80) {
      setPronunciationFeedback('Excellent pronunciation! Keep up the great work! 🌟');
    } else if (similarity >= 60) {
      setPronunciationFeedback('Good effort! Try speaking a bit more clearly and slowly.');
    } else if (similarity >= 40) {
      setPronunciationFeedback('Keep practicing! Focus on pronouncing each word clearly.');
    } else {
      setPronunciationFeedback('Try again! Listen to the prompt carefully and speak slowly.');
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setPronunciationScore(null);
      setPronunciationFeedback('');
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      toast.error('Speech recognition is not supported in your browser. Try Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/___/g, 'blank'));
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in your browser.');
    }
  };

  // Vocabulary game functions
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startMemoryGame = () => {
    if (selectedVocabCategory) {
      const words = shuffleArray(selectedVocabCategory.words).slice(0, 6);
      setVocabGameWords(words);
      setMatchedPairs([]);
      setSelectedCards([]);
      setGameScore(0);
      setSubView('game');
    }
  };

  const handleCardClick = (wordId: string, type: 'word' | 'meaning') => {
    if (matchedPairs.includes(wordId)) return;
    if (selectedCards.length === 2) return;
    if (selectedCards.some(c => c.id === wordId && c.type === type)) return;

    const newSelected = [...selectedCards, { id: wordId, type }];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].id === newSelected[1].id && newSelected[0].type !== newSelected[1].type) {
        setMatchedPairs([...matchedPairs, wordId]);
        setGameScore(prev => prev + 10);
        setTimeout(() => setSelectedCards([]), 500);
      } else {
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

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
    if (subView === 'exercise' || subView === 'practice' || subView === 'flashcard' || subView === 'game') {
      setSubView('lesson');
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setTypedText('');
      setStartTime(null);
      setEndTime(null);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setTranscript('');
      setPronunciationScore(null);
      setCurrentPromptIndex(0);
    } else if (subView === 'lesson') {
      setSubView('list');
      setSelectedGrammar(null);
      setSelectedSpeaking(null);
      setSelectedTyping(null);
      setSelectedVocabCategory(null);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Practice speaking with voice recording & AI feedback
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            className="cursor-pointer hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20"
            onClick={() => setSection('vocabulary')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4">
                <Languages className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-xl">Vocabulary Builder</CardTitle>
              <CardDescription>
                Learn new words with flashcards and memory games
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{vocabularyCategories.length} categories</span>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                  Build Vocab
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-400" />
                <span className="font-medium">Grammar</span>
              </div>
              <Progress value={33} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">2/6 lessons</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Speaking</span>
              </div>
              <Progress value={12} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">1/8 activities</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Keyboard className="h-4 w-4 text-purple-400" />
                <span className="font-medium">Typing</span>
              </div>
              <Progress value={20} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">2/10 lessons</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-4 w-4 text-orange-400" />
                <span className="font-medium">Vocabulary</span>
              </div>
              <Progress value={15} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">8/50 words</p>
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
          <p className="text-muted-foreground">Practice your spoken English with voice recognition</p>
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

    if (subView === 'practice') {
      const currentPrompt = selectedSpeaking.prompts[currentPromptIndex];

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedSpeaking.title}</h1>
              <p className="text-muted-foreground">Prompt {currentPromptIndex + 1} of {selectedSpeaking.prompts.length}</p>
            </div>
          </div>

          <Progress value={((currentPromptIndex + 1) / selectedSpeaking.prompts.length) * 100} className="h-2" />

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Badge variant="outline" className="mb-4">Say this phrase:</Badge>
                <p className="text-2xl font-medium text-foreground">{currentPrompt}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => speakText(currentPrompt)}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>

              <div className="flex justify-center mb-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center transition-all",
                    isRecording 
                      ? "bg-red-500 animate-pulse" 
                      : "bg-blue-500 hover:bg-blue-600"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <CircleStop className="h-10 w-10 text-white" />
                  ) : (
                    <Mic className="h-10 w-10 text-white" />
                  )}
                </motion.button>
              </div>

              <p className="text-center text-sm text-muted-foreground mb-4">
                {isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording'}
              </p>

              {transcript && (
                <div className="p-4 rounded-lg bg-muted/50 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">You said:</p>
                  <p className="text-foreground">{transcript}</p>
                </div>
              )}

              {pronunciationScore !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-lg text-center",
                    pronunciationScore >= 80 ? "bg-green-500/20" :
                    pronunciationScore >= 60 ? "bg-yellow-500/20" :
                    "bg-orange-500/20"
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {pronunciationScore >= 80 ? (
                      <Sparkles className="h-5 w-5 text-green-400" />
                    ) : pronunciationScore >= 60 ? (
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-400" />
                    )}
                    <span className="text-2xl font-bold">{pronunciationScore}%</span>
                  </div>
                  <p className="text-sm">{pronunciationFeedback}</p>
                </motion.div>
              )}

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setTranscript('');
                    setPronunciationScore(null);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (currentPromptIndex < selectedSpeaking.prompts.length - 1) {
                      setCurrentPromptIndex(prev => prev + 1);
                      setTranscript('');
                      setPronunciationScore(null);
                    } else {
                      handleBack();
                      toast.success('Great job! You completed all prompts!');
                    }
                  }}
                >
                  {currentPromptIndex < selectedSpeaking.prompts.length - 1 ? 'Next Prompt' : 'Finish'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
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
                    <p className="text-foreground flex-1">{prompt}</p>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => speakText(prompt)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
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
              Record your voice and get instant feedback on your pronunciation!
            </p>
            <Button size="lg" onClick={() => { setSubView('practice'); setCurrentPromptIndex(0); }}>
              <Mic className="h-4 w-4 mr-2" />
              Start Speaking Practice
            </Button>
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
                    <p className="font-semibold text-yellow-400">Good effort! Keep practicing to meet the target.</p>
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

        <Button className="w-full" size="lg" onClick={() => setSubView('practice')}>
          <Keyboard className="h-4 w-4 mr-2" />
          Start Typing Practice
        </Button>
      </div>
    );
  };

  const renderVocabularyList = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Vocabulary Builder</h1>
          <p className="text-muted-foreground">Learn new words with flashcards and games</p>
        </div>
      </div>

      <div className="grid gap-4">
        {vocabularyCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg hover:border-orange-500/50 transition-all"
              onClick={() => { setSelectedVocabCategory(category); setSubView('lesson'); }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {category.words.length} words
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderVocabularyLesson = () => {
    if (!selectedVocabCategory) return null;

    if (subView === 'flashcard') {
      const currentWord = selectedVocabCategory.words[currentCardIndex];

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedVocabCategory.name} Flashcards</h1>
              <p className="text-muted-foreground">Card {currentCardIndex + 1} of {selectedVocabCategory.words.length}</p>
            </div>
          </div>

          <Progress value={((currentCardIndex + 1) / selectedVocabCategory.words.length) * 100} className="h-2" />

          <div className="flex justify-center">
            <motion.div
              className="w-full max-w-md cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFlipped ? 'back' : 'front'}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={cn(
                    "min-h-[300px] flex items-center justify-center",
                    isFlipped ? "bg-gradient-to-br from-orange-500/20 to-amber-500/10" : "bg-gradient-to-br from-primary/10 to-blue-500/5"
                  )}>
                    <CardContent className="p-8 text-center">
                      {!isFlipped ? (
                        <>
                          <p className="text-4xl font-bold mb-4">{currentWord.word}</p>
                          <p className="text-muted-foreground">{currentWord.pronunciation}</p>
                          <Badge className="mt-4">{currentWord.partOfSpeech}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-4"
                            onClick={(e) => { e.stopPropagation(); speakText(currentWord.word); }}
                          >
                            <Volume2 className="h-4 w-4 mr-2" />
                            Pronounce
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-xl mb-4">{currentWord.meaning}</p>
                          <p className="text-sm text-muted-foreground italic mb-4">"{currentWord.example}"</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {currentWord.synonym.slice(0, 3).map((syn, idx) => (
                              <Badge key={idx} variant="secondary">{syn}</Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Click the card to flip it
          </p>

          <div className="flex gap-3 justify-center">
            <Button 
              variant="outline" 
              disabled={currentCardIndex === 0}
              onClick={() => { setCurrentCardIndex(prev => prev - 1); setIsFlipped(false); }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={() => {
                if (currentCardIndex < selectedVocabCategory.words.length - 1) {
                  setCurrentCardIndex(prev => prev + 1);
                  setIsFlipped(false);
                } else {
                  handleBack();
                  toast.success('You completed all flashcards!');
                }
              }}
            >
              {currentCardIndex < selectedVocabCategory.words.length - 1 ? 'Next' : 'Finish'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (subView === 'game') {
      const isGameComplete = matchedPairs.length === vocabGameWords.length;

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Memory Match Game</h1>
                <p className="text-muted-foreground">Match words with their meanings</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
              {gameScore} pts
            </Badge>
          </div>

          {!isGameComplete ? (
            <div className="grid grid-cols-3 gap-4">
              {/* Words column */}
              {vocabGameWords.map((word) => (
                <motion.div
                  key={`word-${word.id}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(word.id, 'word')}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer text-center transition-all",
                    matchedPairs.includes(word.id) 
                      ? "bg-green-500/20 border-green-500" 
                      : selectedCards.some(c => c.id === word.id && c.type === 'word')
                      ? "bg-primary/20 border-primary"
                      : "bg-muted/50 border-border hover:border-primary/50"
                  )}
                >
                  <p className="font-semibold">{word.word}</p>
                </motion.div>
              ))}
              {/* Meanings column */}
              {shuffleArray(vocabGameWords).map((word) => (
                <motion.div
                  key={`meaning-${word.id}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(word.id, 'meaning')}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer text-center transition-all",
                    matchedPairs.includes(word.id)
                      ? "bg-green-500/20 border-green-500"
                      : selectedCards.some(c => c.id === word.id && c.type === 'meaning')
                      ? "bg-primary/20 border-primary"
                      : "bg-muted/50 border-border hover:border-primary/50"
                  )}
                >
                  <p className="text-sm">{word.meaning.substring(0, 50)}...</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10">
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
                <p className="text-3xl font-bold text-primary mb-4">{gameScore} Points</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={startMemoryGame}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={handleBack}>
                    Back to Category
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">{selectedVocabCategory.icon}</span>
              {selectedVocabCategory.name}
            </h1>
            <p className="text-muted-foreground">{selectedVocabCategory.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            onClick={() => { setSubView('flashcard'); setCurrentCardIndex(0); setIsFlipped(false); }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flashcards</h3>
              <p className="text-muted-foreground mb-4">Learn words by flipping cards</p>
              <Badge>{selectedVocabCategory.words.length} cards</Badge>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg hover:border-orange-500/50 transition-all"
            onClick={startMemoryGame}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Memory Game</h3>
              <p className="text-muted-foreground mb-4">Match words with meanings</p>
              <Badge variant="secondary">Fun & Interactive</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Word List</CardTitle>
            <CardDescription>All words in this category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedVocabCategory.words.map((word, idx) => (
                <div 
                  key={word.id}
                  className="p-4 rounded-lg bg-muted/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{word.word}</p>
                      <p className="text-sm text-muted-foreground">{word.meaning.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(word.difficulty)}>
                      {word.difficulty}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => speakText(word.word)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (section) {
      case 'grammar':
        if (subView === 'lesson' || subView === 'exercise') return renderGrammarLesson();
        return renderGrammarList();
      case 'speaking':
        if (subView === 'lesson' || subView === 'practice') return renderSpeakingLesson();
        return renderSpeakingList();
      case 'typing':
        if (subView === 'lesson' || subView === 'practice') return renderTypingLesson();
        return renderTypingList();
      case 'vocabulary':
        if (subView === 'lesson' || subView === 'flashcard' || subView === 'game') return renderVocabularyLesson();
        return renderVocabularyList();
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