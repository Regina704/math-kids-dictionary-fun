
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Term {
  id: string;
  name: string;
  definition: string;
  example: string | null;
  image_url: string | null;
}

interface TermFormProps {
  term?: Term | null;
  onSave: () => void;
  onCancel: () => void;
}

const TermForm = ({ term, onSave, onCancel }: TermFormProps) => {
  const [name, setName] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (term) {
      setName(term.name);
      setDefinition(term.definition);
      setExample(term.example || '');
      setImageUrl(term.image_url || '');
    }
  }, [term]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const termData = {
        name,
        definition,
        example: example || null,
        image_url: imageUrl || null,
      };

      let error;
      if (term) {
        const result = await supabase
          .from('terms')
          .update(termData)
          .eq('id', term.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('terms')
          .insert([termData]);
        error = result.error;
      }

      if (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить термин',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Успешно',
          description: term ? 'Термин обновлен' : 'Термин добавлен',
        });
        onSave();
      }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Название термина *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="definition">Определение *</Label>
        <Textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="example">Пример</Label>
        <Textarea
          id="example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL изображения</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
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

export default TermForm;
