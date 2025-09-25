// Компонент анимированного фона

import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  variant?: 'orbs' | 'geometric' | 'particles' | 'waves' | 'grid';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'orbs' 
}) => {
  if (variant === 'orbs') {
    return <OrbsBackground />;
  }
  
  if (variant === 'geometric') {
    return <GeometricBackground />;
  }
  
  if (variant === 'particles') {
    return <ParticlesBackground />;
  }
  
  if (variant === 'waves') {
    return <WavesBackground />;
  }
  
  if (variant === 'grid') {
    return <GridBackground />;
  }

  return <OrbsBackground />;
};

// Плавающие светящиеся орбы
const OrbsBackground: React.FC = () => {
  const orbs = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Анимированный градиент фон */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 50%, rgba(236, 72, 153, 0.02) 100%)',
            'linear-gradient(135deg, rgba(147, 51, 234, 0.02) 0%, rgba(236, 72, 153, 0.02) 50%, rgba(59, 130, 246, 0.02) 100%)',
            'linear-gradient(225deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 50%, rgba(147, 51, 234, 0.02) 100%)',
            'linear-gradient(315deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 50%, rgba(236, 72, 153, 0.02) 100%)'
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Большие орбы */}
      {orbs.slice(0, 6).map((i) => (
        <motion.div
          key={`large-${i}`}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 3 === 0 ? 'rgba(59, 130, 246, 0.15)' :
              i % 3 === 1 ? 'rgba(147, 51, 234, 0.15)' :
              'rgba(236, 72, 153, 0.15)'
            } 0%, transparent 70%)`,
            width: `${200 + (i * 40)}px`,
            height: `${200 + (i * 40)}px`,
            filter: 'blur(40px)',
          }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: [
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            ],
            y: [
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            ],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.3, 0.1, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + (i * 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
      
      {/* Маленькие орбы */}
      {orbs.slice(6).map((i) => (
        <motion.div
          key={`small-${i}`}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(249, 115, 22, 0.2)'
            } 0%, transparent 60%)`,
            width: `${80 + (i * 15)}px`,
            height: `${80 + (i * 15)}px`,
            filter: 'blur(20px)',
          }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: [
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920) * 0.8,
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920) * 0.2,
            ],
            y: [
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) * 0.8,
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) * 0.2,
            ],
            scale: [0.8, 1.5, 0.8],
            opacity: [0.4, 0.1, 0.3],
          }}
          transition={{
            duration: 12 + (i * 2),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
};

// Геометрические фигуры
const GeometricBackground: React.FC = () => {
  const shapes = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Базовый градиентный фон */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(60deg, rgba(16, 185, 129, 0.02) 0%, rgba(59, 130, 246, 0.03) 100%)',
            'linear-gradient(120deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.02) 100%)',
            'linear-gradient(180deg, rgba(147, 51, 234, 0.02) 0%, rgba(16, 185, 129, 0.02) 100%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {shapes.map((i) => {
        const shapeType = i % 4;
        const size = 30 + (i * 15);
        const colors = [
          'rgba(59, 130, 246, 0.1)',
          'rgba(147, 51, 234, 0.1)', 
          'rgba(236, 72, 153, 0.1)',
          'rgba(16, 185, 129, 0.1)'
        ];
        
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              ],
              rotate: [0, 360, 720],
              scale: [0.3, 1.2, 0.6, 1],
              opacity: [0, 0.4, 0.1, 0.3],
            }}
            transition={{
              duration: 25 + (i * 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            {shapeType === 0 && (
              // Круг
              <div 
                className="w-full h-full rounded-full border"
                style={{
                  borderColor: colors[i % colors.length],
                  borderWidth: '2px',
                  background: `${colors[i % colors.length]}20`,
                }}
              />
            )}
            {shapeType === 1 && (
              // Треугольник
              <div 
                className="w-0 h-0"
                style={{
                  borderLeft: `${size/2}px solid transparent`,
                  borderRight: `${size/2}px solid transparent`,
                  borderBottom: `${size}px solid ${colors[i % colors.length]}`,
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
                }}
              />
            )}
            {shapeType === 2 && (
              // Квадрат (ромб)
              <div 
                className="w-full h-full border transform rotate-45"
                style={{
                  borderColor: colors[i % colors.length],
                  borderWidth: '2px',
                  background: `linear-gradient(45deg, ${colors[i % colors.length]}30, transparent)`,
                }}
              />
            )}
            {shapeType === 3 && (
              // Шестиугольник (эмуляция через CSS)
              <div 
                className="relative w-full h-full"
                style={{
                  background: colors[i % colors.length],
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  filter: 'blur(1px)',
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Частицы с соединениями
const ParticlesBackground: React.FC = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        {/* Соединительные линии */}
        {particles.map((particle, i) =>
          particles.slice(i + 1).map((otherParticle, j) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) +
              Math.pow(particle.y - otherParticle.y, 2)
            );
            
            if (distance < 200) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke="rgba(59, 130, 246, 0.1)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: [0, 0.3, 0],
                    strokeDasharray: [0, distance, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: (i + j) * 0.1,
                  }}
                />
              );
            }
            return null;
          })
        )}
      </svg>
      
      {/* Частицы */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
          initial={{
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 400,
            y: particle.y + (Math.random() - 0.5) * 400,
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Волны
const WavesBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(${
              i % 2 === 0 ? '59, 130, 246' : '147, 51, 234'
            }, 0.05) 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 12 + (i * 2),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

// Анимированная сетка
const GridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Вертикальные линии */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-200/10 to-transparent"
          style={{ left: `${(i * 5)}%` }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Горизонтальные линии */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-200/10 to-transparent"
          style={{ top: `${(i * 6.67)}%` }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Пересечения */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`intersection-${i}`}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 8)}%`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

