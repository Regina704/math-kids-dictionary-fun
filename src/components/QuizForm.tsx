
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  title: string;
  description: string | null;
}

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizFormProps {
  quiz?: Quiz | null;
  onSave: () => void;
  onCancel: () => void;
}

const QuizForm = ({ quiz, onSave, onCancel }: QuizFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correct_answer: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description || '');
      fetchQuestions();
    }
  }, [quiz]);

  const fetchQuestions = async () => {
    if (!quiz) return;

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id);

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить вопросы',
        variant: 'destructive',
      });
    } else {
      const formattedQuestions = data.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options as string[],
        correct_answer: q.correct_answer
      }));
      setQuestions(formattedQuestions.length > 0 ? formattedQuestions : [
        { question: '', options: ['', '', '', ''], correct_answer: 0 }
      ]);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_answer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === 'options') {
      updated[index] = { ...updated[index], options: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[questionIndex].options];
    newOptions[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const quizData = {
        title,
        description: description || null,
      };

      let quizId;
      let error;

      if (quiz) {
        const result = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', quiz.id);
        error = result.error;
        quizId = quiz.id;
      } else {
        const result = await supabase
          .from('quizzes')
          .insert([quizData])
          .select()
          .single();
        error = result.error;
        quizId = result.data?.id;
      }

      if (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить тест',
          variant: 'destructive',
        });
        return;
      }

      // Delete existing questions if editing
      if (quiz) {
        await supabase
          .from('quiz_questions')
          .delete()
          .eq('quiz_id', quiz.id);
      }

      // Insert new questions
      const questionsData = questions
        .filter(q => q.question.trim() && q.options.some(opt => opt.trim()))
        .map(q => ({
          quiz_id: quizId,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer
        }));

      if (questionsData.length > 0) {
        const { error: questionsError } = await supabase
          .from('quiz_questions')
          .insert(questionsData);

        if (questionsError) {
          toast({
            title: 'Ошибка',
            description: 'Не удалось сохранить вопросы',
            variant: 'destructive',
          });
          return;
        }
      }

      toast({
        title: 'Успешно',
        description: quiz ? 'Тест обновлен' : 'Тест создан',
      });
      onSave();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла неожиданная ошибка',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название теста *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Вопросы</h3>
          <Button type="button" onClick={addQuestion} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить вопрос
          </Button>
        </div>

        {questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Вопрос {questionIndex + 1}</span>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Текст вопроса</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Варианты ответов</Label>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <Input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correct_answer === optionIndex}
                      onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                      placeholder={`Вариант ${optionIndex + 1}`}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-16">
                      {question.correct_answer === optionIndex ? 'Верный' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;
