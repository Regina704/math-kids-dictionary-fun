
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Target, CheckCircle, XCircle, Play, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useQuizRating } from "@/hooks/useQuizRating";
import { toast } from "sonner";

const Quiz = () => {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);

  const { data: quizzes = [], isLoading: quizzesLoading } = useQuizzes();
  const { data: questions = [], isLoading: questionsLoading } = useQuizQuestions(selectedQuizId);
  const { submitRating } = useQuizRating(selectedQuizId || '');

  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  // Shuffle options when questions load
  useEffect(() => {
    if (questions.length > 0) {
      const shuffled = questions.map(question => {
        const correctOption = question.options[question.correct_answer];
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        const newCorrectIndex = shuffledOptions.indexOf(correctOption);
        
        return {
          ...question,
          options: shuffledOptions,
          correct_answer: newCorrectIndex
        };
      });
      setShuffledQuestions(shuffled);
    }
  }, [questions]);

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setHasRated(false);
  };

  const handleStartQuiz = () => {
    if (shuffledQuestions.length === 0) {
      toast.error("В этом тесте нет вопросов");
      return;
    }
    setQuizStarted(true);
    if (selectedQuiz?.time_limit_minutes) {
      setTimeLeft(selectedQuiz.time_limit_minutes * 60);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestion] === undefined) {
      toast.error("Пожалуйста, выберите ответ");
      return;
    }

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuizId(null);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeLeft(null);
    setHasRated(false);
  };

  const calculateScore = () => {
    if (shuffledQuestions.length === 0) return 0;
    
    const correctAnswers = selectedAnswers.filter((answer, index) => {
      return answer === shuffledQuestions[index]?.correct_answer;
    }).length;
    
    return Math.round((correctAnswers / shuffledQuestions.length) * 100);
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Отлично! Ты прекрасно знаешь математику! 🎉";
    if (score >= 70) return "Хорошо! Продолжай изучать математику! 👍";
    if (score >= 50) return "Неплохо! Есть над чем поработать! 📚";
    return "Нужно больше практики! Не сдавайся! 💪";
  };

  const handleRating = async (rating: number) => {
    try {
      await submitRating.mutateAsync(rating);
      setHasRated(true);
      toast.success("Спасибо за оценку!");
    } catch (error) {
      toast.error("Ошибка при отправке оценки");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizzesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Загрузка тестов...</div>
        </div>
      </div>
    );
  }

  // Показ списка тестов
  if (!selectedQuizId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎯 Мини-тесты
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Проверь свои знания математики! Выбери тест и приступай к решению
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Тесты не найдены</h3>
              <p className="text-gray-600">Пока что нет доступных тестов для прохождения</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleQuizSelect(quiz.id)}>
                  <CardHeader>
                    <CardTitle className="text-xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    {quiz.description && (
                      <p className="text-gray-600 mb-4">{quiz.description}</p>
                    )}
                    
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                      {quiz.difficulty_level && (
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {quiz.difficulty_level} класс
                        </div>
                      )}
                      {quiz.time_limit_minutes && (
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {quiz.time_limit_minutes} мин
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Начать тест
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Загрузка вопросов...</div>
        </div>
      </div>
    );
  }

  // Страница перед началом теста
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleBackToQuizzes}
            className="mb-6 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к тестам
          </Button>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedQuiz?.title}
            </h1>
            
            {selectedQuiz?.description && (
              <p className="text-xl text-gray-600 mb-8">{selectedQuiz.description}</p>
            )}

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-lg font-semibold text-gray-700">Вопросов</div>
                  <div className="text-2xl font-bold text-purple-600">{shuffledQuestions.length}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-lg font-semibold text-gray-700">Время</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedQuiz?.time_limit_minutes ? `${selectedQuiz.time_limit_minutes} мин` : "Без ограничений"}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-lg font-semibold text-gray-700">Сложность</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedQuiz?.difficulty_level || "5-7 класс"}
                  </div>
                </div>
              </div>

              <div className="text-gray-600 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Правила прохождения:</h3>
                <ul className="space-y-2">
                  <li>• Читай вопросы внимательно</li>
                  <li>• Выбирай один правильный ответ</li>
                  <li>• Можно вернуться к предыдущим вопросам</li>
                  <li>• В конце увидишь результат</li>
                  {selectedQuiz?.time_limit_minutes && (
                    <li>• Тест автоматически завершится по истечении времени</li>
                  )}
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold"
            >
              Начать тест
              <Target className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Показ результатов
  if (showResults) {
    const score = calculateScore();
    const correctCount = selectedAnswers.filter((answer, index) => 
      answer === shuffledQuestions[index]?.correct_answer
    ).length;

    const ratingEmojis = ['😡', '😕', '😐', '😊', '😍'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">
              {score >= 70 ? "🎉" : score >= 50 ? "👍" : "📚"}
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Тест завершён!
            </h1>
            
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 mb-8 border border-purple-100">
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {score}%
              </div>
              
              <p className="text-xl text-gray-700 mb-6">
                {getScoreMessage(score)}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  <div className="text-gray-600">Правильных ответов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{shuffledQuestions.length - correctCount}</div>
                  <div className="text-gray-600">Неправильных ответов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{shuffledQuestions.length}</div>
                  <div className="text-gray-600">Всего вопросов</div>
                </div>
              </div>

              {!hasRated && (
                <div className="mb-6 p-4 bg-white/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Оцените тест:</h3>
                  <div className="flex justify-center gap-2">
                    {ratingEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleRating(index + 1)}
                        className="text-4xl hover:scale-110 transition-transform"
                        title={`Оценка ${index + 1}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasRated && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium">✅ Спасибо за оценку!</p>
                </div>
              )}

              <div className="space-y-4">
                {shuffledQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correct_answer;
                  
                  return (
                    <div key={question.id} className="text-left bg-white/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <div className="text-sm space-y-1">
                            <p className="text-gray-600">
                              Твой ответ: <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer !== undefined ? question.options[userAnswer] : "Не отвечено"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-gray-600">
                                Правильный ответ: <span className="text-green-600">
                                  {question.options[question.correct_answer]}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-x-4">
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setShowResults(false);
                  setQuizStarted(false);
                  setHasRated(false);
                  if (selectedQuiz?.time_limit_minutes) {
                    setTimeLeft(selectedQuiz.time_limit_minutes * 60);
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Пройти снова
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBackToQuizzes}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Выбрать другой тест
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Прохождение теста
  const currentQ = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Timer and Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Вопрос {currentQuestion + 1} из {shuffledQuestions.length}
              </span>
              <div className="flex items-center gap-4">
                {timeLeft !== null && (
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span className={timeLeft < 60 ? "text-red-600" : "text-gray-600"}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {Math.round(progress)}% завершено
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-3"
              >
                {currentQ?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Предыдущий
            </Button>

            <Button
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {currentQuestion === shuffledQuestions.length - 1 ? "Завершить тест" : "Следующий"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
