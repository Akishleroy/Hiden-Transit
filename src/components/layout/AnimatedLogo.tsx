// Анимированный логотип Gray Tranzit

import { motion } from 'motion/react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function AnimatedLogo({ size = 'md', showText = true }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center space-x-3">
      <motion.div 
        className={`${sizeClasses[size]} relative`}
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25 
        }}
      >
        {/* Железнодорожные пути */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Горизонтальные рельсы */}
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-gray-400 to-gray-600" style={{ top: '35%' }} />
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-gray-400 to-gray-600" style={{ top: '65%' }} />
          
          {/* Шпалы */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-3 bg-gradient-to-b from-amber-600 to-amber-800"
              style={{ left: `${20 + i * 20}%`, top: '30%' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </motion.div>
        
        {/* Поезд */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ 
            x: [0, 2, 0, -2, 0],
            opacity: 1
          }}
          transition={{ 
            x: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { delay: 0.7 }
          }}
        >
          <svg
            className="w-full h-full text-gray-700 dark:text-gray-300"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            {/* Корпус локомотива */}
            <motion.rect
              x="8" y="10" width="16" height="8" rx="2"
              className="fill-gray-600 dark:fill-gray-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            />
            
            {/* Кабина машиниста */}
            <motion.rect
              x="20" y="8" width="6" height="6" rx="1"
              className="fill-gray-700 dark:fill-gray-300"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            />
            
            {/* Окна */}
            <motion.rect
              x="21" y="9" width="1.5" height="1.5" rx="0.2"
              className="fill-blue-300 dark:fill-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            />
            <motion.rect
              x="23.5" y="9" width="1.5" height="1.5" rx="0.2"
              className="fill-blue-300 dark:fill-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            />
            
            {/* Колеса */}
            {[10, 14, 18, 22].map((x, i) => (
              <motion.circle
                key={i}
                cx={x} cy="19" r="2"
                className="fill-gray-800 dark:fill-gray-200"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { delay: 1.0 + i * 0.1, type: "spring" },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              />
            ))}
            
            {/* Дым из трубы */}
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={i}
                cx={6 - i * 2} cy={8 - i} r={0.5 + i * 0.2}
                className="fill-gray-400 dark:fill-gray-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 1.5],
                  y: [0, -3, -6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3 + 1.5,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Фара */}
            <motion.circle
              cx="26" cy="11" r="1"
              className="fill-yellow-300 dark:fill-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.3
              }}
            />
          </svg>
        </motion.div>
        
        {/* Эффект движения */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(107, 114, 128, 0)',
              '0 0 0 4px rgba(107, 114, 128, 0.1)',
              '0 0 0 0 rgba(107, 114, 128, 0)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2 
            className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-gray-600 via-gray-800 to-slate-700 dark:from-gray-300 dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent`}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            Gray Tranzit
          </motion.h2>
          <motion.p 
            className="text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Railway Analytics System
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}