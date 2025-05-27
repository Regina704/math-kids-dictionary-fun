
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useQuizRating = (quizId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const submitRating = useMutation({
    mutationFn: async (rating: number) => {
      const { error } = await supabase
        .from('quiz_ratings')
        .insert({
          quiz_id: quizId,
          user_id: user?.id || null,
          rating: rating
        });

      if (error) {
        console.error('Error submitting rating:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-ratings', quizId] });
    },
  });

  return { submitRating };
};
