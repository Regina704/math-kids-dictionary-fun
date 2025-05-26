
import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions: Question[] = [
    {
      id: "1",
      question: "Что такое периметр?",
      options: [
        "Площадь фигуры",
        "Сумма всех сторон фигуры",
        "Диагональ фигуры",
        "Высота фигуры"
      ],
      correctAnswer: 1,
      explanation: "Периметр — это сумма длин всех сторон многоугольника. Например, периметр квадрата равен 4 × длина стороны."
    },
    {
      id: "2",
      question: "Что показывает дробь 3/4?",
      options: [
        "3 умножить на 4",
        "3 разделить на 4",
        "3 плюс 4",
        "4 минус 3"
      ],
      correctAnswer: 1,
      explanation: "Дробь 3/4 означает, что целое разделили на 4 равные части и взяли 3 из них. Это то же самое, что 3 ÷ 4."
    },
    {
      id: "3",
      question: "Чему равен 1% от 100?",
      options: [
        "10",
        "1",
        "100",
        "0.1"
      ],
      correctAnswer: 1,
      explanation: "1% означает одну сотую часть. 1% от 100 = 1/100 × 100 = 1."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🏆 Отлично! Ты настоящий математик!";
    if (percentage >= 60) return "👏 Хорошо! Продолжай учиться!";
    return "💪 Неплохо! Повтори материал и попробуй ещё раз!";
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-2 border-purple-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">
                {score === questions.length ? "🏆" : score >= questions.length * 0.6 ? "🎉" : "📚"}
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Тест завершён!
              </h2>
              <p className="text-xl text-gray-700 mb-6">{getScoreMessage()}</p>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {score} из {questions.length}
                </div>
                <p className="text-gray-700">правильных ответов</p>
              </div>

              <Button
                onClick={handleRestartQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Пройти ещё раз
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎯 Мини-тест
          </h1>
          <p className="text-xl text-gray-600">Проверь свои знания математических терминов!</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
            <span className="text-lg font-semibold text-purple-600">
              Очки: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-2 border-purple-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-6 text-left text-lg rounded-xl border-2 transition-all duration-300 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === questions[currentQuestion].correctAnswer
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-red-500 bg-red-50 text-red-700"
                        : "border-purple-500 bg-purple-50 text-purple-700"
                      : showResult && index === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <div>
                        {index === questions[currentQuestion].correctAnswer ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-6 h-6 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Result and Explanation */}
            {showResult && (
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 animate-fade-in">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? "✅ Правильно!" : "❌ Неправильно"}
                </h3>
                <p className="text-gray-700">{questions[currentQuestion].explanation}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Ответить
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {currentQuestion < questions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
                  <Trophy className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
