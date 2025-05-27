
import { useState, useMemo } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import TermCard from "@/components/TermCard";
import { useSearchParams } from "react-router-dom";
import { useTerms } from "@/hooks/useTerms";

const Terms = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");

  const { data: allTerms = [], isLoading, error } = useTerms();

  // Создаем категории на основе загруженных терминов
  const categories = useMemo(() => {
    const termCategories = ["Геометрия", "Арифметика", "Статистика", "Алгебра"];
    return ["all", ...termCategories];
  }, []);

  const alphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ".split("");

  // Преобразуем термины из базы данных в формат для TermCard
  const transformedTerms = useMemo(() => {
    return allTerms.map(term => ({
      id: term.id,
      title: term.name,
      definition: term.definition,
      example: term.example || "Пример будет добавлен позже",
      category: "Математика" // Пока используем общую категорию
    }));
  }, [allTerms]);

  const filteredTerms = useMemo(() => {
    return transformedTerms.filter(term => {
      const matchesSearch = term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      const matchesLetter = selectedLetter === "all" || term.title[0].toUpperCase() === selectedLetter;
      
      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [transformedTerms, searchTerm, selectedCategory, selectedLetter]);

  if (error) {
    console.error('Error loading terms:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Ошибка загрузки</h3>
            <p className="text-gray-600 mb-6">Не удалось загрузить термины из базы данных</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
            >
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Загрузка терминов...</h3>
            <p className="text-gray-600">Получаем данные из базы данных</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Terms;
