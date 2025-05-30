import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, RotateCcw, Star } from "lucide-react";
import Header from "@/components/Header";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useQuizRating } from "@/hooks/useQuizRating";
import { useAuth } from "@/contexts/AuthContext";

const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>(""); // Изменим на строку для сброса
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  const { data: quizzes = [] } = useQuizzes();
  const { data: questions = [] } = useQuizQuestions(selectedQuiz);
  const { user } = useAuth();
  const { submitRating } = useQuizRating(selectedQuiz || "");

  const selectedQuizData = quizzes.find(q => q.id === selectedQuiz);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !quizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          handleFinishQuiz();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const startQuiz = () => {
    if (selectedQuizData?.time_limit_minutes) {
      setTimeLeft(selectedQuizData.time_limit_minutes * 60);
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(""); // Сбрасываем выбранный ответ
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: string) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== "") {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = parseInt(selectedAnswer);
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(""); // Сбрасываем выбранный ответ для следующего вопроса
      } else {
        handleFinishQuiz();
      }
    }
  };

  const handleFinishQuiz = () => {
    setQuizStarted(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!questions.length) return 0;
    let correct = 0;
    answers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleRatingSubmit = () => {
    if (selectedQuiz && userRating > 0) {
      submitRating.mutate(userRating);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer("");
    setShowResults(false);
    setTimeLeft(null);
    setQuizStarted(false);
    setUserRating(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🧠 Мини-тесты
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Проверь свои знания математических терминов с помощью интерактивных тестов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card 
                key={quiz.id}
                className="hover:scale-105 transition-transform duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300"
                onClick={() => setSelectedQuiz(quiz.id)}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {quiz.description && (
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    {quiz.difficulty_level && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {quiz.difficulty_level}
                      </span>
                    )}
                    {quiz.time_limit_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.time_limit_minutes} мин
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                Результаты теста
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">{score}%</div>
              <p className="text-xl text-gray-700 mb-6">
                Правильных ответов: {answers.filter((answer, index) => 
                  questions[index] && answer === questions[index].correct_answer
                ).length} из {questions.length}
              </p>
              
              {user && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Оцените тест:</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`text-2xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                      >
                        <Star className={`w-8 h-8 ${userRating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <Button onClick={handleRatingSubmit} disabled={submitRating.isPending}>
                      Отправить оценку
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Пройти снова
                </Button>
                <Button onClick={resetQuiz} variant="outline">
                  Выбрать другой тест
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                {selectedQuizData?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {selectedQuizData?.description && (
                <p className="text-gray-600 mb-6">{selectedQuizData.description}</p>
              )}
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 mb-2">Вопросов: {questions.length}</p>
                {selectedQuizData?.time_limit_minutes && (
                  <p className="text-lg text-gray-700 mb-2">
                    Время: {selectedQuizData.time_limit_minutes} минут
                  </p>
                )}
                {selectedQuizData?.difficulty_level && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    Сложность: {selectedQuizData.difficulty_level}
                  </span>
                )}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={startQuiz} size="lg">
                  Начать тест
                </Button>
                <Button onClick={resetQuiz} variant="outline" size="lg">
                  Назад
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-600">
                Вопрос {currentQuestion + 1} из {questions.length}
              </span>
              {timeLeft !== null && (
                <span className="flex items-center gap-2 text-lg font-semibold text-orange-600">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <Progress value={progress} className="w-full h-3" />
          </CardHeader>
          
          <CardContent>
            {currentQ && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQ.question}
                </h2>
                
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={handleAnswerSelect}
                  className="space-y-4"
                >
                  {(currentQ.options as string[]).map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="text-lg cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-8 flex justify-between">
                  <Button
                    onClick={() => {
                      if (currentQuestion > 0) {
                        setCurrentQuestion(currentQuestion - 1);
                        setSelectedAnswer(answers[currentQuestion - 1]?.toString() || "");
                      }
                    }}
                    variant="outline"
                    disabled={currentQuestion === 0}
                  >
                    Назад
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === ""}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
