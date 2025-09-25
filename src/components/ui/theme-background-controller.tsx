// Контроллер для изменения веса/прозрачности фона темы

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Minus, Plus } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { useTheme } from './theme-provider';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';

interface ThemeBackgroundControllerProps {
  onBackgroundChange?: (opacity: number) => void;
}

export function ThemeBackgroundController({ onBackgroundChange }: ThemeBackgroundControllerProps) {
  const { theme } = useTheme();
  const [backgroundOpacity, setBackgroundOpacity] = useState(80);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setBackgroundOpacity(newOpacity);
    onBackgroundChange?.(newOpacity);
    
    // Применяем изменения к CSS переменным
    const root = document.documentElement;
    root.style.setProperty('--background-opacity', (newOpacity / 100).toString());
    
    // Обновляем фон для разных элементов с учетом текущей темы
    const backgroundColorLight = `rgba(255, 255, 255, ${newOpacity / 100})`;
    const backgroundColorDark = `rgba(17, 24, 39, ${newOpacity / 100})`;
    
    root.style.setProperty('--dynamic-bg-light', backgroundColorLight);
    root.style.setProperty('--dynamic-bg-dark', backgroundColorDark);
    
    // Применяем изменения к фону приложения
    updateAppBackground(newOpacity);
  };

  const updateAppBackground = (opacity: number) => {
    const root = document.documentElement;
    const opacityValue = opacity / 100;
    
    // Обновляем градиенты фона приложения
    const lightGradient = `linear-gradient(135deg, 
      rgba(248, 250, 252, ${0.7 + opacityValue * 0.3}) 0%, 
      rgba(226, 232, 240, ${0.5 + opacityValue * 0.4}) 50%, 
      rgba(241, 245, 249, ${0.7 + opacityValue * 0.3}) 100%)`;
      
    const darkGradient = `linear-gradient(135deg, 
      rgba(17, 24, 39, ${0.7 + opacityValue * 0.3}) 0%, 
      rgba(31, 41, 55, ${0.5 + opacityValue * 0.4}) 50%, 
      rgba(15, 23, 42, ${0.7 + opacityValue * 0.3}) 100%)`;
    
    root.style.setProperty('--bg-gradient-light', lightGradient);
    root.style.setProperty('--bg-gradient-dark', darkGradient);
    
    // Обновляем фон динамических элементов
    const dynamicBgLight = `rgba(255, 255, 255, ${0.7 + opacityValue * 0.3})`;
    const dynamicBgDark = `rgba(17, 24, 39, ${0.7 + opacityValue * 0.3})`;
    
    root.style.setProperty('--color-dynamic-bg-light', dynamicBgLight);
    root.style.setProperty('--color-dynamic-bg-dark', dynamicBgDark);
  };

  // Инициализация при изменении темы
  useEffect(() => {
    updateAppBackground(backgroundOpacity);
    
    // Добавляем визуальную обратную связь
    const root = document.documentElement;
    root.style.setProperty('--backdrop-blur', `${12 + (backgroundOpacity / 100) * 8}px`);
  }, [theme, backgroundOpacity]);

  const presets = [
    { name: 'Прозрачный', value: 20, color: 'bg-gray-200/20 dark:bg-gray-700/20' },
    { name: 'Легкий', value: 50, color: 'bg-gray-200/50 dark:bg-gray-700/50' },
    { name: 'Средний', value: 80, color: 'bg-gray-200/80 dark:bg-gray-700/80' },
    { name: 'Плотный', value: 95, color: 'bg-gray-200/95 dark:bg-gray-700/95' },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9 rounded-full"
            aria-label="Настройка фона"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end" side="bottom" sideOffset={8}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h4 className="font-medium mb-2">Настройка фона</h4>
            <p className="text-sm text-muted-foreground">
              Измените прозрачность фона интерфейса
            </p>
          </div>

          {/* Слайдер */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Плотность</span>
              <span className="text-sm font-mono">{backgroundOpacity}%</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpacityChange([Math.max(0, backgroundOpacity - 10)]);
                }}
                aria-label="Уменьшить плотность"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={[backgroundOpacity]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpacityChange([Math.min(100, backgroundOpacity + 10)]);
                }}
                aria-label="Увеличить плотность"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Пресеты */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Быстрые настройки:</span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <motion.button
                  key={preset.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpacityChange([preset.value]);
                  }}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    backgroundOpacity === preset.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${preset.color} border`} />
                    <span>{preset.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Предварительный просмотр */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Предпросмотр:</span>
            <div 
              className="h-12 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden"
              style={{
                background: theme === 'dark' 
                  ? `linear-gradient(45deg, #374151 25%, transparent 25%), linear-gradient(-45deg, #374151 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #374151 75%), linear-gradient(-45deg, transparent 75%, #374151 75%)`
                  : `linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)`,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
              }}
            >
              <div 
                className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center text-sm"
                style={{ opacity: backgroundOpacity / 100 }}
              >
                Фон {backgroundOpacity}%
              </div>
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}