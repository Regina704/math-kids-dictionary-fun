
import { useState } from "react";
import { Search, BookOpen, Users, Award, ArrowRight, Calculator, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import TermCard from "@/components/TermCard";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const featuredTerms = [
    {
      id: "perimeter",
      title: "Периметр",
      definition: "Сумма длин всех сторон многоугольника",
      example: "Периметр квадрата со стороной 5 см = 5 + 5 + 5 + 5 = 20 см",
      gradeLevel: 5,
      topic: { name: "Геометрия" }
    },
    {
      id: "fraction",
      title: "Дробь",
      definition: "Число, записанное в виде a/b, где a — числитель, b — знаменатель",
      example: "3/4 означает, что целое разделено на 4 части, взято 3 части",
      gradeLevel: 6,
      topic: { name: "Арифметика" }
    },
    {
      id: "diagram",
      title: "Диаграмма",
      definition: "Графическое представление данных в виде столбцов, кругов или линий",
      example: "Круговая диаграмма показывает, сколько учеников выбрали разные предметы",
      gradeLevel: 7,
      topic: { name: "Статистика" }
    }
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/terms?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fade-in">
            📚 Математический Словарь
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in">
            Интерактивный словарь математических терминов для школьников 5-7 классов
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in">
            Изучай математику легко и весело! Здесь ты найдёшь понятные объяснения, примеры и интерактивные задания.
          </p>
          
          {!user && (
            <div className="mb-8">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Войти в систему
              </Button>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-12 animate-scale-in">
            <Input
              type="text"
              placeholder="Найди термин... (например: площадь)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg px-6 py-4 rounded-full border-2 border-purple-200 focus:border-purple-400"
            />
            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Искать
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/terms')}>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Все термины</h3>
                <p className="opacity-90">Полный алфавитный список</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/quiz')}>
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Мини-тесты</h3>
                <p className="opacity-90">Проверь свои знания</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/about')}>
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">О проекте</h3>
                <p className="opacity-90">Узнай больше о словаре</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Terms */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🌟 Популярные термины
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTerms.map((term, index) => (
            <TermCard 
              key={term.id} 
              term={term} 
              delay={index * 200}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/terms')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Смотреть все термины
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🎯 Зачем нужен математический словарь?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 hover:scale-105 transition-transform duration-300">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-orange-600" />
            <h3 className="text-xl font-bold mb-4 text-gray-800">Понятные объяснения</h3>
            <p className="text-gray-700">Сложные термины объясняются простым языком с примерами из жизни</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-100 to-teal-100 hover:scale-105 transition-transform duration-300">
            <Users className="w-16 h-16 mx-auto mb-4 text-teal-600" />
            <h3 className="text-xl font-bold mb-4 text-gray-800">Интерактивное обучение</h3>
            <p className="text-gray-700">Тесты и задания помогают лучше запомнить и понять материал</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 hover:scale-105 transition-transform duration-300">
            <Award className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-bold mb-4 text-gray-800">Быстрый поиск</h3>
            <p className="text-gray-700">Найди нужный термин за секунды с помощью поиска и алфавитного указателя</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
