
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  created_at: string;
}

export const useQuizQuestions = (quizId: string | null) => {
  return useQuery({
    queryKey: ['quiz-questions', quizId],
    queryFn: async () => {
      if (!quizId) return [];
      
      console.log('Fetching quiz questions for quiz:', quizId);
      
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at');

      if (error) {
        console.error('Error fetching quiz questions:', error);
        throw error;
      }

      console.log('Quiz questions fetched successfully:', data);
      return data as QuizQuestion[];
    },
    enabled: !!quizId,
  });
};
