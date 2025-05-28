
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTopic } from '@/hooks/useTopics';

interface TopicFormProps {
  onCancel: () => void;
}

const TopicForm = ({ onCancel }: TopicFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createTopic = useCreateTopic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createTopic.mutateAsync({
      name,
      description: description || undefined,
    });
    
    setName('');
    setDescription('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topicName">Название темы *</Label>
        <Input
          id="topicName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Например: Геометрия"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="topicDescription">Описание</Label>
        <Textarea
          id="topicDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Краткое описание темы"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={createTopic.isPending}>
          {createTopic.isPending ? 'Сохранение...' : 'Добавить тему'}
        </Button>
      </div>
    </form>
  );
};

export default TopicForm;
