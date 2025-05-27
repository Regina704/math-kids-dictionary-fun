
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useQuizzes = () => {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      console.log('Fetching quizzes from database...');
      
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
      }

      console.log('Quizzes fetched successfully:', data);
      return data as Quiz[];
    },
  });
};
