import { useState, useMemo } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import TermCard from "@/components/TermCard";
import { useSearchParams } from "react-router-dom";
import { useTerms } from "@/hooks/useTerms";
import { useTopics } from "@/hooks/useTopics";
import { useGradeLevels } from "@/hooks/useGradeLevels";

const Terms = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const { data: allTerms = [], isLoading, error } = useTerms();
  const { data: topics = [] } = useTopics();
  const { data: gradeLevels = [] } = useGradeLevels();

  const alphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ".split("");

  // Преобразуем термины из базы данных в формат для TermCard
  const transformedTerms = useMemo(() => {
    return allTerms.map(term => ({
      id: term.id,
      name: term.name,
      definition: term.definition,
      example: term.example,
      image_url: term.image_url,
      grade_level: term.grade_level,
      topic_id: term.topic_id,
      topics: term.topics
    }));
  }, [allTerms]);

  const filteredTerms = useMemo(() => {
    return transformedTerms.filter(term => {
      const matchesSearch = term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === "all" || (term.grade_level && term.grade_level.toString() === selectedGrade);
      const matchesLetter = selectedLetter === "all" || term.name[0].toUpperCase() === selectedLetter;
      const matchesTopic = selectedTopic === "all" || (term.topics && term.topics.name === selectedTopic);
      
      return matchesSearch && matchesGrade && matchesLetter && matchesTopic;
    });
  }, [transformedTerms, searchTerm, selectedGrade, selectedLetter, selectedTopic]);

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
            
            {/* Grade Filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-48 py-3 rounded-xl border-2 border-purple-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Класс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все классы</SelectItem>
                {gradeLevels.map(grade => (
                  <SelectItem key={grade.id} value={grade.level.toString()}>{grade.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Topic Filter */}
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full md:w-48 py-3 rounded-xl border-2 border-purple-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Тема" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все темы</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter Buttons */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              🎓 Фильтр по классам
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              <Button
                variant={selectedGrade === "all" ? "default" : "outline"}
                onClick={() => setSelectedGrade("all")}
                className="h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
              >
                Все
              </Button>
              {gradeLevels.map(grade => (
                <Button
                  key={grade.id}
                  variant={selectedGrade === grade.level.toString() ? "default" : "outline"}
                  onClick={() => setSelectedGrade(grade.level.toString())}
                  className="h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
                >
                  {grade.level}
                </Button>
              ))}
            </div>
          </div>

          {/* Topic Filter Buttons */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              📚 Фильтр по темам
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTopic === "all" ? "default" : "outline"}
                onClick={() => setSelectedTopic("all")}
                className="h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110 whitespace-nowrap"
              >
                Все темы
              </Button>
              {topics.map(topic => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.name ? "default" : "outline"}
                  onClick={() => setSelectedTopic(topic.name)}
                  className="h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110 whitespace-nowrap"
                >
                  {topic.name}
                </Button>
              ))}
            </div>
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
                    setSelectedGrade("all");
                    setSelectedLetter("all");
                    setSelectedTopic("all");
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
