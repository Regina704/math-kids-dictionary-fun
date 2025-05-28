
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Term {
  id: string;
  name: string;
  definition: string;
  example: string | null;
  image_url: string | null;
  grade_level: number | null;
  topic_id: string | null;
  created_at: string;
  updated_at: string;
  topics?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export const useTerms = () => {
  return useQuery({
    queryKey: ['terms'],
    queryFn: async () => {
      console.log('Fetching terms from database...');
      
      const { data, error } = await supabase
        .from('terms')
        .select(`
          *,
          topics (
            id,
            name,
            description
          )
        `)
        .order('name');

      if (error) {
        console.error('Error fetching terms:', error);
        throw error;
      }

      console.log('Terms fetched successfully:', data);
      return data as Term[];
    },
  });
};
