
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, EyeOff, CheckCircle } from "lucide-react";

interface Term {
  id: string;
  name: string;
  definition: string;
  example: string | null;
  image_url: string | null;
  grade_level: number | null;
  topic_id: string | null;
  topics?: {
    id: string;
    name: string;
    description: string | null;
  };
}

interface TermCardProps {
  term: Term;
  delay?: number;
}

const TermCard = ({ term, delay = 0 }: TermCardProps) => {
  const [showExample, setShowExample] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  const getGradeColor = (grade: number | null) => {
    if (!grade) return "from-gray-400 to-gray-600";
    if (grade <= 6) return "from-green-400 to-green-600";
    if (grade <= 8) return "from-blue-400 to-blue-600";
    return "from-purple-400 to-purple-600";
  };

  const getGradeIcon = (grade: number | null) => {
    if (!grade) return "📐";
    if (grade <= 6) return "🌱";
    if (grade <= 8) return "📏";
    return "📊";
  };

  const getTopicColor = (topicName: string | undefined) => {
    if (!topicName) return "from-gray-100 to-gray-200";
    switch (topicName.toLowerCase()) {
      case 'арифметика': return "from-orange-100 to-orange-200";
      case 'геометрия': return "from-blue-100 to-blue-200";
      case 'алгебра': return "from-purple-100 to-purple-200";
      case 'статистика': return "from-green-100 to-green-200";
      case 'дроби': return "from-yellow-100 to-yellow-200";
      case 'проценты': return "from-pink-100 to-pink-200";
      default: return "from-indigo-100 to-indigo-200";
    }
  };

  return (
    <Card 
      className={`bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in flex flex-col ${
        showExample ? 'h-auto' : 'h-[400px]'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {/* Topic Badge */}
        {term.topics && (
          <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getTopicColor(term.topics.name)} text-gray-700 text-sm font-semibold mb-3 border border-gray-200 w-fit`}>
            📚 {term.topics.name}
          </div>
        )}

        {/* Grade Badge */}
        {term.grade_level && (
          <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getGradeColor(term.grade_level)} text-white text-sm font-semibold mb-4 w-fit ${term.topics ? 'ml-2' : ''}`}>
            {getGradeIcon(term.grade_level)} {term.grade_level} класс
          </div>
        )}

        {/* Term Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
          {term.name}
        </h3>

        {/* Definition */}
        <div className="flex-1 flex flex-col">
          <p className="text-gray-700 text-lg leading-relaxed mb-4 flex-1">
            {term.definition}
          </p>

          {/* Example Toggle */}
          {term.example && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowExample(!showExample)}
                className="w-full flex items-center justify-center space-x-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              >
                {showExample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showExample ? "Скрыть пример" : "Показать пример"}</span>
              </Button>

              {/* Example with Image */}
              {showExample && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-orange-400 animate-fade-in space-y-3">
                  <p className="text-gray-700 italic">
                    <strong>Пример:</strong> {term.example}
                  </p>
                  
                  {/* Image */}
                  {term.image_url && (
                    <div className="mt-3">
                      <img 
                        src={term.image_url} 
                        alt={`Изображение для термина ${term.name}`}
                        className="max-w-full h-auto rounded-lg shadow-md border border-orange-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
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
