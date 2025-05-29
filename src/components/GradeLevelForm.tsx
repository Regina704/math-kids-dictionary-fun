
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface GradeLevelFormProps {
  onCancel: () => void;
}

const GradeLevelForm = ({ onCancel }: GradeLevelFormProps) => {
  const [level, setLevel] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('grade_levels')
        .insert({
          level: parseInt(level),
          name: name.trim(),
        });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Класс добавлен',
      });

      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      onCancel();
    } catch (error) {
      console.error('Error creating grade level:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить класс',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="level">Номер класса</Label>
        <Input
          id="level"
          type="number"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Например: 8"
          required
          min="1"
          max="11"
        />
      </div>

      <div>
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: 8 класс"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Добавление...' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default GradeLevelForm;
