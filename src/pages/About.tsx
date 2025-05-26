
import { BookOpen, Users, Target, Heart, Lightbulb, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            💡 О проекте
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            МатСловарь — это современный интерактивный словарь математических терминов, созданный специально для школьников 5-7 классов
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <Card className="bg-white/60 backdrop-blur-md border-2 border-purple-200 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Наша миссия
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Сделать изучение математики интересным, понятным и доступным для каждого школьника. 
                Мы верим, что правильное объяснение сложных терминов простым языком может изменить отношение к математике навсегда!
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Особенности проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/60 backdrop-blur-md border-2 border-blue-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Простые объяснения</h3>
                <p className="text-gray-700">Сложные математические понятия объясняются простым и понятным языком с примерами из повседневной жизни</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-2 border-green-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Интерактивность</h3>
                <p className="text-gray-700">Мини-тесты, примеры и интерактивные элементы помогают лучше понять и запомнить материал</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-2 border-purple-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Удобный поиск</h3>
                <p className="text-gray-700">Быстрый поиск по названию термина и алфавитный указатель для лёгкой навигации</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-2 border-orange-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Для всех устройств</h3>
                <p className="text-gray-700">Адаптивный дизайн позволяет комфортно использовать словарь на телефоне, планшете и компьютере</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-2 border-pink-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Дружелюбный интерфейс</h3>
                <p className="text-gray-700">Яркий и современный дизайн создаёт позитивную атмосферу для изучения математики</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-2 border-teal-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-teal-600" />
                <h3 className="text-xl font-bold mb-4 text-gray-800">Постоянное развитие</h3>
                <p className="text-gray-700">Мы регулярно добавляем новые термины и улучшаем функциональность для лучшего обучения</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Target Audience */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-200 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                👥 Для кого создан словарь?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Школьники 5-7 классов</h3>
                  <p className="text-gray-700">Основная аудитория — ученики средней школы, изучающие базовые математические понятия</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍🏫</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Учителя</h3>
                  <p className="text-gray-700">Помощник для педагогов в объяснении сложных терминов и создании интерактивных уроков</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">👪</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Родители</h3>
                  <p className="text-gray-700">Ресурс для родителей, которые помогают детям с домашними заданиями по математике</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Статистика проекта
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">50+</div>
                <p className="text-blue-100">Математических терминов</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">15+</div>
                <p className="text-green-100">Интерактивных тестов</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <p className="text-purple-100">Бесплатный доступ</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <p className="text-orange-100">Доступность</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-6">📧</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Обратная связь</h2>
              <p className="text-gray-700 mb-6">
                У тебя есть идеи для улучшения словаря? Нашёл ошибку? Хочешь предложить новый термин? 
                Мы всегда рады обратной связи!
              </p>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-gray-600 font-medium">📚 МатСловарь — учим математику с удовольствием!</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
