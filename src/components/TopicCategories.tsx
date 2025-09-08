import React from 'react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'animals', label: 'Animals', emoji: '🦁', color: 'bg-pastel-green' },
  { id: 'space', label: 'Space', emoji: '🚀', color: 'bg-pastel-blue' },
  { id: 'science', label: 'Science', emoji: '🔬', color: 'bg-pastel-purple' },
  { id: 'history', label: 'History', emoji: '⏰', color: 'bg-pastel-yellow' },
  { id: 'nature', label: 'Nature', emoji: '🌳', color: 'bg-pastel-green' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'bg-pastel-pink' },
  { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦕', color: 'bg-pastel-purple' },
  { id: 'ocean', label: 'Ocean', emoji: '🐠', color: 'bg-pastel-blue' },
];

interface TopicCategoriesProps {
  onCategoryClick: (category: string) => void;
}

export const TopicCategories: React.FC<TopicCategoriesProps> = ({ onCategoryClick }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
        What do you want to explore today? 🌈
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryClick(category.label)}
            variant="ghost"
            className={`${category.color} hover:scale-105 transition-all duration-300 h-auto py-4 px-3 rounded-2xl border-2 border-transparent hover:border-primary/20`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">{category.emoji}</span>
              <span className="text-sm font-semibold text-foreground">{category.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};