// Компонент для выбора типа анимированного фона

import React from 'react';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { 
  Palette, 
  Circle, 
  Shapes, 
  Sparkles, 
  Waves, 
  Grid3X3 
} from 'lucide-react';

interface BackgroundSelectorProps {
  currentVariant: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid';
  onVariantChange: (variant: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid') => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentVariant,
  onVariantChange
}) => {
  const variants = [
    {
      id: 'orbs' as const,
      name: 'Светящиеся орбы',
      icon: Circle,
      description: 'Плавающие светящиеся сферы'
    },
    {
      id: 'geometric' as const,
      name: 'Геометрия',
      icon: Shapes,
      description: 'Вращающиеся фигуры'
    },
    {
      id: 'particles' as const,
      name: 'Частицы',
      icon: Sparkles,
      description: 'Связанные точки'
    },
    {
      id: 'waves' as const,
      name: 'Волны',
      icon: Waves,
      description: 'Плавные волновые формы'
    },
    {
      id: 'grid' as const,
      name: 'Сетка',
      icon: Grid3X3,
      description: 'Анимированная сетка'
    }
  ];

  const currentVariantData = variants.find(v => v.id === currentVariant);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Palette className="h-4 w-4" />
          </motion.div>
          <span className="hidden sm:inline text-xs">
            {currentVariantData?.name || 'Фон'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 mb-2">
            Выберите стиль фона
          </div>
          {variants.map((variant) => {
            const Icon = variant.icon;
            const isActive = currentVariant === variant.id;
            
            return (
              <DropdownMenuItem 
                key={variant.id}
                onClick={() => onVariantChange(variant.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <motion.div
                  animate={isActive ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`h-4 w-4 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </motion.div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    isActive ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {variant.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {variant.description}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <div className="border-t p-2">
          <div className="text-xs text-gray-400 px-2">
            💡 Фон изменяется в реальном времени
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};