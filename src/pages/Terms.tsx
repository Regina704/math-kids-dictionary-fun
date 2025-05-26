
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import TermCard from "@/components/TermCard";
import { useSearchParams } from "react-router-dom";

const Terms = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");

  const allTerms = [
    {
      id: "perimeter",
      title: "Периметр",
      definition: "Сумма длин всех сторон многоугольника",
      example: "Периметр квадрата со стороной 5 см = 5 + 5 + 5 + 5 = 20 см",
      category: "Геометрия"
    },
    {
      id: "fraction",
      title: "Дробь",
      definition: "Число, записанное в виде a/b, где a — числитель, b — знаменатель",
      example: "3/4 означает, что целое разделено на 4 части, взято 3 части",
      category: "Арифметика"
    },
    {
      id: "diagram",
      title: "Диаграмма",
      definition: "Графическое представление данных в виде столбцов, кругов или линий",
      example: "Круговая диаграмма показывает, сколько учеников выбрали разные предметы",
      category: "Статистика"
    },
    {
      id: "area",
      title: "Площадь",
      definition: "Размер поверхности, измеряемый в квадратных единицах",
      example: "Площадь прямоугольника со сторонами 4 см и 6 см = 4 × 6 = 24 см²",
      category: "Геометрия"
    },
    {
      id: "percentage",
      title: "Процент",
      definition: "Доля числа, выраженная в сотых частях и обозначаемая знаком %",
      example: "25% от 100 = 25, потому что 25/100 × 100 = 25",
      category: "Арифметика"
    },
    {
      id: "average",
      title: "Среднее арифметическое",
      definition: "Сумма всех чисел, делённая на их количество",
      example: "Среднее арифметическое чисел 2, 4, 6 = (2+4+6)/3 = 4",
      category: "Статистика"
    }
  ];

  const categories = ["all", ...Array.from(new Set(allTerms.map(term => term.category)))];
  const alphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ".split("");

  const filteredTerms = useMemo(() => {
    return allTerms.filter(term => {
      const matchesSearch = term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      const matchesLetter = selectedLetter === "all" || term.title[0].toUpperCase() === selectedLetter;
      
      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [searchTerm, selectedCategory, selectedLetter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📖 Все термины
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Найди нужный математический термин с помощью поиска или алфавитного указателя
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 mb-8 border border-purple-100">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Поиск терминов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-purple-200 focus:border-purple-400"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 py-3 rounded-xl border-2 border-purple-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alphabet Filter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              🔤 Алфавитный указатель
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 lg:grid-cols-17 gap-2">
              <Button
                variant={selectedLetter === "all" ? "default" : "outline"}
                onClick={() => setSelectedLetter("all")}
                className="h-10 w-10 p-0 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
              >
                Все
              </Button>
              {alphabet.map(letter => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  onClick={() => setSelectedLetter(letter)}
                  className="h-10 w-10 p-0 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            Найдено терминов: <span className="font-bold text-purple-600">{filteredTerms.length}</span>
          </p>
        </div>

        {/* Terms Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTerms.map((term, index) => (
              <TermCard 
                key={term.id} 
                term={term} 
                delay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Термины не найдены</h3>
            <p className="text-gray-600 mb-6">Попробуй изменить поисковый запрос или фильтры</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLetter("all");
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
