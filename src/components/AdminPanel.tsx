
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, BookOpen, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TermForm from './TermForm';
import QuizForm from './QuizForm';

interface Term {
  id: string;
  name: string;
  definition: string;
  example: string | null;
  image_url: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
}

const AdminPanel = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showTermForm, setShowTermForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTerms();
    fetchQuizzes();
  }, []);

  const fetchTerms = async () => {
    const { data, error } = await supabase
      .from('terms')
      .select('*')
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление терминами и тестами</p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Термины
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
                      <h3 className="text-lg font-semibold mb-2">{term.name}</h3>
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
                      <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
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
