
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GradeLevel {
  id: string;
  level: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const useGradeLevels = () => {
  return useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      console.log('Fetching grade levels from database...');
      
      const { data, error } = await supabase
        .from('grade_levels')
        .select('*')
        .order('level');

      if (error) {
        console.error('Error fetching grade levels:', error);
        throw error;
      }

      console.log('Grade levels fetched successfully:', data);
      return data as GradeLevel[];
    },
  });
};

export const useDeleteGradeLevel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grade_levels')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      toast({
        title: 'Успешно',
        description: 'Класс удален',
      });
    },
    onError: (error) => {
      console.error('Error deleting grade level:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить класс',
        variant: 'destructive',
      });
    },
  });
};
