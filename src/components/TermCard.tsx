
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface Term {
  id: string;
  title: string;
  definition: string;
  example: string;
  category: string;
}

interface TermCardProps {
  term: Term;
  delay?: number;
}

const TermCard = ({ term, delay = 0 }: TermCardProps) => {
  const [showExample, setShowExample] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Геометрия":
        return "from-blue-400 to-blue-600";
      case "Арифметика":
        return "from-green-400 to-green-600";
      case "Статистика":
        return "from-purple-400 to-purple-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Геометрия":
        return "🔺";
      case "Арифметика":
        return "🔢";
      case "Статистика":
        return "📊";
      default:
        return "📐";
    }
  };

  return (
    <Card 
      className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        {/* Category Badge */}
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(term.category)} text-white text-sm font-semibold mb-4`}>
          {getCategoryIcon(term.category)} {term.category}
        </div>

        {/* Term Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
          {term.title}
        </h3>

        {/* Definition */}
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          {term.definition}
        </p>

        {/* Example Toggle */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowExample(!showExample)}
            className="w-full flex items-center justify-center space-x-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
          >
            {showExample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showExample ? "Скрыть пример" : "Показать пример"}</span>
          </Button>

          {/* Example */}
          {showExample && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-orange-400 animate-fade-in">
              <p className="text-gray-700 italic">
                <strong>Пример:</strong> {term.example}
              </p>
            </div>
          )}
        </div>

        {/* Learn Button */}
        <div className="mt-4 pt-4 border-t border-purple-100">
          <Button
            onClick={() => setIsLearned(!isLearned)}
            className={`w-full flex items-center justify-center space-x-2 transition-all duration-300 ${
              isLearned
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            }`}
          >
            {isLearned ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Изучено! ✨</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>Отметить как изученное</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermCard;
