
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useTopics = () => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      console.log('Fetching topics from database...');
      
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }

      console.log('Topics fetched successfully:', data);
      return data as Topic[];
    },
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topicData: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('topics')
        .insert([topicData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: 'Успешно',
        description: 'Тема добавлена',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить тему',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      toast({
        title: 'Успешно',
        description: 'Тема удалена',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить тему',
        variant: 'destructive',
      });
    },
  });
};
