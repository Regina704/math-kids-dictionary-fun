
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, BookOpen, HelpCircle, Tag, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTopics, useDeleteTopic } from '@/hooks/useTopics';
import { useGradeLevels, useDeleteGradeLevel } from '@/hooks/useGradeLevels';
import TermForm from './TermForm';
import QuizForm from './QuizForm';
import TopicForm from './TopicForm';
import GradeLevelForm from './GradeLevelForm';

interface Term {
  id: string;
  name: string;
  definition: string;
  example: string | null;
  image_url: string | null;
  grade_level: number | null;
  topic_id: string | null;
  topics?: {
    name: string;
  };
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  time_limit_minutes: number | null;
  difficulty_level: string | null;
}

const AdminPanel = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showTermForm, setShowTermForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showGradeLevelForm, setShowGradeLevelForm] = useState(false);
  const { toast } = useToast();
  const { data: topics = [] } = useTopics();
  const { data: gradeLevels = [] } = useGradeLevels();
  const deleteTopic = useDeleteTopic();
  const deleteGradeLevel = useDeleteGradeLevel();

  useEffect(() => {
    fetchTerms();
    fetchQuizzes();
  }, []);

  const fetchTerms = async () => {
    const { data, error } = await supabase
      .from('terms')
      .select(`
        *,
        topics (
          name
        )
      `)
      .order('name');
    
    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить термины',
        variant: 'destructive',
      });
    } else {
      setTerms(data || []);
    }
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('title');
    
    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить тесты',
        variant: 'destructive',
      });
    } else {
      setQuizzes(data || []);
    }
  };

  const deleteTerm = async (id: string) => {
    const { error } = await supabase
      .from('terms')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить термин',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Термин удален',
      });
      fetchTerms();
    }
  };

  const deleteQuiz = async (id: string) => {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить тест',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: 'Тест удален',
      });
      fetchQuizzes();
    }
  };

  const handleTermSaved = () => {
    setShowTermForm(false);
    setEditingTerm(null);
    fetchTerms();
  };

  const handleQuizSaved = () => {
    setShowQuizForm(false);
    setEditingQuiz(null);
    fetchQuizzes();
  };

  const handleTopicSaved = () => {
    setShowTopicForm(false);
  };

  const handleGradeLevelSaved = () => {
    setShowGradeLevelForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление терминами, темами, классами и тестами</p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Термины
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Темы
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Классы
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Тесты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Управление терминами</h2>
            <Button onClick={() => setShowTermForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить термин
            </Button>
          </div>

          {showTermForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingTerm ? 'Редактировать термин' : 'Добавить новый термин'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TermForm
                  term={editingTerm}
                  onSave={handleTermSaved}
                  onCancel={() => {
                    setShowTermForm(false);
                    setEditingTerm(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {terms.map((term) => (
              <Card key={term.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{term.name}</h3>
                        {term.grade_level && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {term.grade_level} класс
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{term.definition}</p>
                      {term.example && (
                        <p className="text-sm text-blue-600 italic">Пример: {term.example}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTerm(term);
                          setShowTermForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTerm(term.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Управление темами</h2>
            <Button onClick={() => setShowTopicForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить тему
            </Button>
          </div>

          {showTopicForm && (
            <Card>
              <CardHeader>
                <CardTitle>Добавить новую тему</CardTitle>
              </CardHeader>
              <CardContent>
                <TopicForm onCancel={handleTopicSaved} />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {topics.map((topic) => (
              <Card key={topic.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{topic.name}</h3>
                      {topic.description && (
                        <p className="text-gray-600">{topic.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTopic.mutate(topic.id)}
                        disabled={deleteTopic.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Управление классами</h2>
            <Button onClick={() => setShowGradeLevelForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить класс
            </Button>
          </div>

          {showGradeLevelForm && (
            <Card>
              <CardHeader>
                <CardTitle>Добавить новый класс</CardTitle>
              </CardHeader>
              <CardContent>
                <GradeLevelForm onCancel={handleGradeLevelSaved} />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {gradeLevels.map((grade) => (
              <Card key={grade.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{grade.name}</h3>
                      <p className="text-gray-600">Уровень: {grade.level}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGradeLevel.mutate(grade.id)}
                        disabled={deleteGradeLevel.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Управление тестами</h2>
            <Button onClick={() => setShowQuizForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить тест
            </Button>
          </div>

          {showQuizForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingQuiz ? 'Редактировать тест' : 'Добавить новый тест'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuizForm
                  quiz={editingQuiz}
                  onSave={handleQuizSaved}
                  onCancel={() => {
                    setShowQuizForm(false);
                    setEditingQuiz(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        {quiz.difficulty_level && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {quiz.difficulty_level}
                          </span>
                        )}
                        {quiz.time_limit_minutes && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {quiz.time_limit_minutes} мин
                          </span>
                        )}
                      </div>
                      {quiz.description && (
                        <p className="text-gray-600">{quiz.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setShowQuizForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuiz(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
