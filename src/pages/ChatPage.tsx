// Страница AI чат-ассистента

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Trash2,
  Sparkles,
  BarChart3,
  Activity,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  CheckCircle,
  InfoIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  History
} from 'lucide-react';
import { cn } from '../components/ui/utils';

// Статичная функция генерации ответов AI
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('статистика') || lowerMessage.includes('сегодня')) {
    return `📊 **Статистика за сегодня:**

• Всего операций: 2,847
• Выявленных аномалий: 127 (4.5%)
• Критические: 23 операции
• Высокий риск: 45 операций
• Средний риск: 59 операций
• Общая стоимость операций: 127 456 000 тг

**Топ аномалий:**
1. Весовые отклонения: 67 случаев
2. Временные задержки: 34 случая  
3. Маршрутные нарушения: 26 случаев

**Проблемные компании:**
• КазТрансЛогистик ТОО - 8 аномалий
• АстанаГрузПеревозки ТОО - 6 аномалий

Рекомендую обратить внимание на станцию "Алматы-1" - 18 аномалий за день.`;
  }
  
  if (lowerMessage.includes('критические') || lowerMessage.includes('критич')) {
    return `🚨 **Критические аномалии:**

**Обнаружено 23 критические аномалии:**

1. **КазТрансЛогистик ТОО** - Весовое отклонение +847% (4 567 000 тг)
2. **АстанаГрузПеревозки ТОО** - Временная аномалия: задержка 18 дней (2 340 000 тг)
3. **АлматыТрейдинг ТОО** - Маршрутное нарушение через Туркестан (3 890 000 тг)

**Финансовые потери:** 45 234 000 тг

**Рекомендации:**
• Проверить документы КазТрансЛогистик на перегруз
• Связаться с АстанаГрузПеревозки по задержке
• Расследовать нарушение маршрута АлматыТрейдинг
• Уведомить казахстанскую таможенную службу`;
  }
  
  if (lowerMessage.includes('анализ') && lowerMessage.includes('вес')) {
    return `⚖️ **Анализ весовых отклонений:**

**За последние 7 дней:**
• Среднее отклонение: ±12.3%
• Максимальное отклонение: +847% (КазТрансЛогистик ТОО)
• Количество превышений: 156 случаев
• Финансовые потери: 23 450 000 тг

**Паттерны:**
• 67% отклонений на маршруте Казахстан → Узбекистан
• Пик аномалий: четверг 14:00-16:00
• Проблемные грузы: металлопродукция, зерно
• Проблемные компании: КазТрансЛогистик, АлматыКарго

**Рекомендации:**
• Усилить контроль взвешивания на станции Алматы-1
• Проверить калибровку весов на пограничных станциях
• Провести аудит компаний с частыми нарушениями`;
  }
  
  if (lowerMessage.includes('маршрут') || lowerMessage.includes('проблем')) {
    return `🛣️ **Проблемные маршруты:**

**Топ-5 маршрутов с аномалиями:**

1. **Казахстан → Узбекистан** (67 аномалий)
   - Основная проблема: весовые отклонения
   - Станция: Шымкент
   - Компании: КазТрансЛогистик, АлматыКарго

2. **Казахстан → Китай** (34 аномалии)
   - Основная проблема: временные задержки
   - Станция: Достык
   - Компании: АстанаГрузПеревозки, КазЭкспресс

3. **Казахстан → Кыргызстан** (23 аномалии)
   - Основная проблема: документооборот
   - Станция: Луговая
   - Компании: АлматыТрейдинг, КазЛогистик

**Финансовые потери:** 89 567 000 тг

**Рекомендации:**
• Оптимизировать процедуры на станции Шымкент
• Улучшить координацию с узбекистанской стороной
• Провести аудит проблемных казахстанских компаний`;
  }
  
  if (lowerMessage.includes('рекомендации') || lowerMessage.includes('рекоменд')) {
    return `💡 **Рекомендации по оптимизации:**

**Краткосрочные (1-2 недели):**
• Увеличить частоту проверок на станции Алматы-1 и Шымкент
• Внедрить дополнительный контроль для грузов >50 тонн
• Провести аудит проблемных казахстанских компаний
• Обновить инструкции для операторов

**Среднесрочные (1-3 месяца):**
• Автоматизировать сверку весовых данных
• Интегрировать системы с узбекистанскими и китайскими партнерами
• Обучить персонал новым процедурам
• Внедрить штрафную систему для нарушителей

**Долгосрочные (3-12 месяцев):**
• Внедрить предиктивную аналитику на базе ИИ
• Создать единую цифровую платформу ЕАЭС
• Оптимизировать логистические цепочки по Шелковому пути

**Ожидаемый эффект:** 
• Снижение аномалий на 35-40%
• Экономия 45 000 000 тг в год`;
  }
  
  if (lowerMessage.includes('прогноз') || lowerMessage.includes('завтра')) {
    return `🔮 **Прогноз на завтра:**

**Ожидаемые показатели:**
• Количество операций: 2,650-2,800
• Прогнозируемые аномалии: 98-115 (3.7-4.1%)
• Критические риски: 15-20 случаев
• Прогнозируемый объем: 134 500 000 тг

**Факторы риска:**
• Неблагоприятные погодные условия в Алматинской области
• Планируемые работы на станции Шымкент
• Повышенный грузопоток из Китая
• Проблемы с КазТрансЛогистик ТОО

**Рекомендации на завтра:**
• Усилить контроль с 10:00 до 14:00 на станции Алматы-1
• Подготовить резерв персонала для станции Шымкент
• Дополнительная проверка грузов КазТрансЛогистик
• Уведомить казахстанские службы о возможных задержках

**Вероятность превышения порога аномалий:** 23%
**Потенциальные финансовые потери:** до 12 000 000 тг`;
  }
  
  // Общий ответ
  return `🤖 **AI Ассистент Gray Tranzit**

Я проанализировал ваш запрос: "${message}"

**Доступные команды:**
• "статистика сегодня" - текущая статистика
• "критические аномалии" - срочные проблемы  
• "анализ веса" - весовые отклонения
• "проблемные маршруты" - маршрутная аналитика
• "рекомендации" - советы по оптимизации
• "прогноз завтра" - предсказания

**Система активна:** 728,904+ операций под контролем
**Мониторинг:** Казахстан, Узбекистан, Кыргызстан, Таджикистан, Китай
**Валюта операций:** Казахстанский тенге (тг)
**Точность анализа:** 97.2%
**Время ответа:** <150мс

Чем могу помочь с анализом транзитных операций? 🚀`;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatSession {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
  messages: ChatMessage[];
}

const quickCommands = [
  {
    label: 'Статистика аномалий за сегодня',
    command: 'статистика сегодня',
    icon: BarChart3,
    color: 'text-blue-600'
  },
  {
    label: 'Критические аномалии',
    command: 'критические аномалии',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    label: 'Анализ весовых отклонений',
    command: 'анализ веса',
    icon: Activity,
    color: 'text-purple-600'
  },
  {
    label: 'Проблемные маршруты',
    command: 'проблемные маршруты',
    icon: Target,
    color: 'text-orange-600'
  },
  {
    label: 'Рекомендации по оптимизации',
    command: 'рекомендации',
    icon: Sparkles,
    color: 'text-green-600'
  },
  {
    label: 'Прогноз на завтра',
    command: 'прогноз завтра',
    icon: TrendingUp,
    color: 'text-indigo-600'
  }
];

// Мок данные сессий
const mockSessions: ChatSession[] = [
  {
    id: '1',
    name: 'Анализ аномалий - 12 Сен',
    lastMessage: 'Критические аномалии',
    timestamp: '2024-09-12T10:30:00',
    messageCount: 8,
    messages: [
      { id: '1', content: 'критические аномалии', isUser: true, timestamp: '2024-09-12T10:30:00' },
      { id: '2', content: '🚨 **Критические аномалии:**\n\n**Обнаружено 23 критические аномалии:**\n\n1. **Вагон №8734291** - Весовое отклонение +127%', isUser: false, timestamp: '2024-09-12T10:30:05' }
    ]
  },
  {
    id: '2',
    name: 'Статистика - 11 Сен',
    lastMessage: 'статистика сегодня',
    timestamp: '2024-09-11T14:15:00',
    messageCount: 5,
    messages: [
      { id: '3', content: 'статистика сегодня', isUser: true, timestamp: '2024-09-11T14:15:00' },
      { id: '4', content: '📊 **Статистика за сегодня:**\n\n• Всего операций: 2,847\n• Выявленных аномалий: 127 (4.5%)', isUser: false, timestamp: '2024-09-11T14:15:03' }
    ]
  },
  {
    id: '3',
    name: 'Прогнозы - 10 Сен',
    lastMessage: 'прогноз завтра',
    timestamp: '2024-09-10T16:45:00',
    messageCount: 3,
    messages: [
      { id: '5', content: 'прогноз завтра', isUser: true, timestamp: '2024-09-10T16:45:00' },
      { id: '6', content: '🔮 **Прогноз на завтра:**\n\n**Ожидаемые показатели:**\n• Количество операций: 2,650-2,800', isUser: false, timestamp: '2024-09-10T16:45:02' }
    ]
  },
  {
    id: '4',
    name: 'Маршрутная аналитика - 9 Сен',
    lastMessage: 'проблемные маршруты',
    timestamp: '2024-09-09T11:20:00',
    messageCount: 6,
    messages: []
  },
  {
    id: '5',
    name: 'Весовой анализ - 8 Сен',
    lastMessage: 'анализ веса',
    timestamp: '2024-09-08T15:45:00',
    messageCount: 4,
    messages: []
  },
  {
    id: '6',
    name: 'Оптимизация - 7 Сен',
    lastMessage: 'рекомендации',
    timestamp: '2024-09-07T09:15:00',
    messageCount: 12,
    messages: []
  },
  {
    id: '7',
    name: 'Общая статистика - 6 Сен',
    lastMessage: 'статистика сегодня',
    timestamp: '2024-09-06T16:30:00',
    messageCount: 7,
    messages: []
  },
  {
    id: '8',
    name: 'Системный мониторинг - 5 Сен',
    lastMessage: 'критические аномалии',
    timestamp: '2024-09-05T13:10:00',
    messageCount: 9,
    messages: []
  }
];

export function ChatPage() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Новая сессия - ${new Date().toLocaleDateString('ru-RU')}`,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messageCount: 0,
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    let session = currentSession;
    if (!session) {
      // Создаем новую сессию если её нет
      session = {
        id: Date.now().toString(),
        name: `Сессия - ${new Date().toLocaleDateString('ru-RU')}`,
        lastMessage: message,
        timestamp: new Date().toISOString(),
        messageCount: 1,
        messages: []
      };
      setSessions(prev => [session!, ...prev]);
      setCurrentSession(session);
    }
    
    // Добавляем пользовательское сообщение
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage],
      lastMessage: message,
      messageCount: session.messageCount + 1,
      timestamp: new Date().toISOString()
    };
    
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === session!.id ? updatedSession : s));
    setMessage('');
    setLoading(true);
    
    // Имитируем небольшую задержку для реалистичности (100мс)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        messageCount: updatedSession.messageCount + 1
      };
      
      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === session!.id ? finalSession : s));
      setLoading(false);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  const handleQuickCommandClick = (e: React.MouseEvent, command: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMessage(command);
  };

  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSend();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSessionTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex-shrink-0 p-4 sm:p-6 bg-background/95 backdrop-blur border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Bot className="h-8 w-8 mr-3 text-blue-600" />
              AI Ассистент
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Интеллектуальный анализ транзитных операций и аномалий</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Онлайн
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              title={isPanelCollapsed ? "Показать панель" : "Скрыть панель"}
            >
              {isPanelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createNewSession}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Новая сессия
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Левая панель - Быстрые команды и последние сессии */}
        <AnimatePresence>
          {!isPanelCollapsed && (
            <motion.div 
              className="border-r bg-slate-50/80 dark:bg-slate-800/90 chat-left-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="w-full max-w-[384px] p-4 min-w-0 h-full flex flex-col">
                <div className="flex-1 flex flex-col space-y-4 min-h-0">
                  {/* Быстрые команды */}
                  <Card className="flex-shrink-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span>Быстрые команды</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quickCommands.map((cmd, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2 text-left overflow-hidden"
                          onClick={(e) => handleQuickCommandClick(e, cmd.command)}
                        >
                          <cmd.icon className={cn("h-3 w-3 mr-2 flex-shrink-0", cmd.color)} />
                          <span className="text-xs truncate">{cmd.label}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Последние сессии */}
                  <Card className="flex-1 flex flex-col min-h-0">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <History className="h-4 w-4 text-gray-600" />
                        <span>Последние сессии</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 flex-1 overflow-y-auto">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-colors border",
                            currentSession?.id === session.id
                              ? "bg-blue-50 dark:bg-emerald-900/30 border-blue-200 dark:border-emerald-700 text-blue-900 dark:text-emerald-300"
                              : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                          )}
                          onClick={() => selectSession(session)}
                        >
                          <div className="text-sm font-medium truncate max-w-full">{session.name}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 truncate mt-1 max-w-full">{session.lastMessage}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400 dark:text-slate-500">
                              {formatSessionTime(session.timestamp)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {session.messageCount} сообщ.
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Правая панель - Чат */}
        <div className="flex-1 flex flex-col">
          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentSession || currentSession.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Добро пожаловать в AI Ассистент!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Выберите сессию слева или создайте новую, чтобы начать общение</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                  {quickCommands.slice(0, 4).map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={(e) => handleQuickCommandClick(e, cmd.command)}
                    >
                      <cmd.icon className={cn("h-4 w-4 mr-3", cmd.color)} />
                      <div className="text-left">
                        <div className="font-medium">{cmd.label}</div>
                        <div className="text-xs text-gray-500">{cmd.command}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {currentSession.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3 max-w-4xl',
                      msg.isUser ? 'justify-end ml-auto' : 'justify-start'
                    )}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    
                    <div className={cn(
                      'rounded-lg px-4 py-3 max-w-2xl break-words',
                      msg.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
                    )}>
                      <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                      <div className={cn(
                        'text-xs mt-2 opacity-70',
                        msg.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      )}>
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                    
                    {msg.isUser && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">ИИ анализирует ваш запрос...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Область ввода */}
          <div className="flex-shrink-0 p-4 border-t bg-slate-50/80 dark:bg-slate-800/90">
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите ваш вопрос..."
                className="flex-1"
                disabled={loading}
                tabIndex={1}
                autoComplete="off"
              />
              <Button 
                onClick={handleSendClick} 
                disabled={!message.trim() || loading}
                className="px-6"
                tabIndex={2}
                type="button"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center mt-2">
              <p className="text-xs text-gray-500 flex items-center">
                <InfoIcon className="h-3 w-3 mr-1" />
                ИИ может делать ошибки. Проверяйте важную информацию.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}