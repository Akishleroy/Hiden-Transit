// Страница генерации отчетов

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Mail,
  Clock,
  Eye,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { cn } from '../components/ui/utils';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'anomalies' | 'statistics' | 'routes' | 'custom';
  schedule?: string;
  lastGenerated?: string;
  recipients?: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Ежедневный отчет по аномалиям',
    description: 'Сводка критических и высоких аномалий за сутки',
    type: 'anomalies',
    schedule: 'daily',
    lastGenerated: '2024-01-15T08:00:00Z',
    recipients: ['admin@company.ru', 'operator@company.ru']
  },
  {
    id: '2',
    name: 'Недельная статистика',
    description: 'Общая статистика по всем типам аномалий за неделю',
    type: 'statistics',
    schedule: 'weekly',
    lastGenerated: '2024-01-14T09:00:00Z',
    recipients: ['manager@company.ru']
  },
  {
    id: '3',
    name: 'Анализ маршрутов',
    description: 'Детальный анализ проблемных маршрутов',
    type: 'routes',
    lastGenerated: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'Месячный сводный отчет',
    description: 'Полный анализ за месяц с рекомендациями',
    type: 'custom',
    schedule: 'monthly',
    lastGenerated: '2024-01-01T12:00:00Z',
    recipients: ['director@company.ru', 'analytics@company.ru']
  }
];

const reportHistory = [
  {
    id: '1',
    name: 'Отчет по аномалиям за 14.01.2024',
    type: 'anomalies',
    generatedAt: '2024-01-15T08:00:00Z',
    size: '2.3 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '2',
    name: 'Недельная статистика 08-14.01.2024',
    type: 'statistics',
    generatedAt: '2024-01-14T09:00:00Z',
    size: '1.8 MB',
    format: 'Excel',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Анализ маршрутов за декабрь',
    type: 'routes',
    generatedAt: '2024-01-13T10:00:00Z',
    size: '4.1 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '4',
    name: 'Сводный отчет за декабрь 2023',
    type: 'custom',
    generatedAt: '2024-01-01T12:00:00Z',
    size: '8.7 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '5',
    name: 'Финансовый отчет за Q4 2023',
    type: 'custom',
    generatedAt: '2024-01-10T14:30:00Z',
    size: '6.2 MB',
    format: 'Excel',
    status: 'completed'
  },
  {
    id: '6',
    name: 'Аномалии весовых данных 13.01.2024',
    type: 'anomalies',
    generatedAt: '2024-01-14T07:15:00Z',
    size: '1.9 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '7',
    name: 'Эффективность станций за январь',
    type: 'statistics',
    generatedAt: '2024-01-12T11:20:00Z',
    size: '3.4 MB',
    format: 'Excel',
    status: 'completed'
  },
  {
    id: '8',
    name: 'Критические маршруты 2024',
    type: 'routes',
    generatedAt: '2024-01-08T16:45:00Z',
    size: '5.1 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '9',
    name: 'Временные аномалии по странам',
    type: 'anomalies',
    generatedAt: '2024-01-05T09:30:00Z',
    size: '2.8 MB',
    format: 'PDF',
    status: 'completed'
  },
  {
    id: '10',
    name: 'Прогноз логистических потоков',
    type: 'custom',
    generatedAt: '2024-01-03T13:15:00Z',
    size: '7.3 MB',
    format: 'PDF',
    status: 'completed'
  }
];

export function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'schedule'>('generate');

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'anomalies': return 'Аномалии';
      case 'statistics': return 'Статистика';
      case 'routes': return 'Маршруты';
      case 'custom': return 'Пользовательский';
      default: return 'Неизвестный';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'anomalies': return 'bg-red-100 text-red-800';
      case 'statistics': return 'bg-blue-100 text-blue-800';
      case 'routes': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU');
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Имитация генерации отчета
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 min-h-full pb-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              Система отчетов
            </h1>
            <p className="text-gray-600">Генерация и управление отчетами по транзитным данным</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Новый шаблон
            </Button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'generate', label: 'Генерация', icon: FileText },
              { id: 'templates', label: 'Шаблоны', icon: Settings },
              { id: 'history', label: 'История', icon: Clock },
              { id: 'schedule', label: 'Расписание', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Содержимое вкладок */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Форма генерации */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Генерация нового отчета</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Тип отчета</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип отчета" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anomalies">Отчет по аномалиям</SelectItem>
                          <SelectItem value="statistics">Статистический отчет</SelectItem>
                          <SelectItem value="routes">Анализ маршрутов</SelectItem>
                          <SelectItem value="finance">Финансовый отчет</SelectItem>
                          <SelectItem value="efficiency">Эффективность операций</SelectItem>
                          <SelectItem value="forecast">Прогнозный анализ</SelectItem>
                          <SelectItem value="custom">Пользовательский отчет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Период</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите период" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Сегодня</SelectItem>
                          <SelectItem value="yesterday">Вчера</SelectItem>
                          <SelectItem value="week">Последние 7 дней</SelectItem>
                          <SelectItem value="month">Последние 30 дней</SelectItem>
                          <SelectItem value="quarter">Квартал</SelectItem>
                          <SelectItem value="year">Год</SelectItem>
                          <SelectItem value="custom">Произвольный период</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Формат</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите формат" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF документ</SelectItem>
                          <SelectItem value="excel">Excel таблица</SelectItem>
                          <SelectItem value="csv">CSV файл</SelectItem>
                          <SelectItem value="json">JSON данные</SelectItem>
                          <SelectItem value="powerpoint">PowerPoint презентация</SelectItem>
                          <SelectItem value="word">Word документ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Детализация</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Уровень детализации" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Сводка</SelectItem>
                          <SelectItem value="detailed">Детальный</SelectItem>
                          <SelectItem value="full">Полный отчет</SelectItem>
                          <SelectItem value="analytical">Аналитический</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Регион</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите регион" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все регионы</SelectItem>
                          <SelectItem value="minsk">Минская область</SelectItem>
                          <SelectItem value="brest">Брестская область</SelectItem>
                          <SelectItem value="vitebsk">Витебская область</SelectItem>
                          <SelectItem value="gomel">Гомельская область</SelectItem>
                          <SelectItem value="grodno">Гродненская область</SelectItem>
                          <SelectItem value="mogilev">Могилевская область</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Приоритет</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Приоритет обработки" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="normal">Обычный</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                          <SelectItem value="urgent">Срочный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Название отчета</label>
                    <Input placeholder="Введите название отчета" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Описание (опционально)</label>
                    <Textarea 
                      placeholder="Добавьте описание для отчета"
                      className="resize-none h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email для отправки</label>
                      <Input placeholder="email@company.ru" type="email" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Дополнительные получатели</label>
                      <Input placeholder="manager@company.ru, analyst@company.ru" />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-900">Дополнительные параметры</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Включить графики</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип графиков" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Без графиков</SelectItem>
                            <SelectItem value="basic">Базовые графики</SelectItem>
                            <SelectItem value="advanced">Расширенные графики</SelectItem>
                            <SelectItem value="interactive">Интерактивные диаграммы</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Язык отчета</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите язык" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ru">Русский</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="be">Беларуская</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Теги (через запятую)</label>
                      <Input placeholder="анализ, аномалии, статистика" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button 
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="flex items-center space-x-2"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Генерация...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            <span>Сгенерировать отчет</span>
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Предпросмотр
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        Сохранить как шаблон
                      </Button>
                      <Button variant="ghost" size="sm">
                        Запланировать
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Быстрые шаблоны */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Быстрые шаблоны</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {reportTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                        <Badge className={cn('text-xs', getTypeBadgeColor(template.type))}>
                          {getTypeLabel(template.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      {template.lastGenerated && (
                        <p className="text-xs text-gray-400">
                          Последний: {formatDate(template.lastGenerated)}
                        </p>
                      )}
                      {template.schedule && (
                        <p className="text-xs text-blue-600 mt-1">
                          Расписание: {template.schedule === 'daily' ? 'Ежедневно' : 
                                    template.schedule === 'weekly' ? 'Еженедельно' : 
                                    template.schedule === 'monthly' ? 'Ежемесячно' : template.schedule}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Статистика */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Отчетов за месяц</span>
                    <Badge variant="secondary">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Автоматических</span>
                    <Badge variant="secondary">32</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Размер данных</span>
                    <Badge variant="secondary">127 MB</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>История отчетов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reportHistory.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Создан: {formatDate(report.generatedAt)}</span>
                          <span>Размер: {report.size}</span>
                          <Badge className={cn('text-xs', getTypeBadgeColor(report.type))}>
                            {report.format}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'templates' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Шаблоны отчетов</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать шаблон
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={cn('text-xs', getTypeBadgeColor(template.type))}>
                        {getTypeLabel(template.type)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    {template.schedule && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Расписание: {template.schedule === 'daily' ? 'Ежедневно' : 
                                      template.schedule === 'weekly' ? 'Еженедельно' : 'Ежемесячно'}
                        </span>
                      </div>
                    )}

                    {template.recipients && template.recipients.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {template.recipients.length} получателей
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Редактировать
                      </Button>
                      <Button size="sm" className="flex-1">
                        Запустить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Автоматические отчеты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {reportTemplates.filter(t => t.schedule).map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">
                        {template.schedule === 'daily' ? 'Каждый день в 08:00' :
                         template.schedule === 'weekly' ? 'Каждый понедельник в 09:00' :
                         'Первое число месяца в 12:00'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Активно</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email уведомления</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Уведомления об ошибках</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Еженедельная сводка</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium text-gray-700">Получатели по умолчанию</label>
                  <Textarea 
                    placeholder="admin@company.ru&#10;manager@company.ru"
                    className="resize-none h-20"
                  />
                </div>

                <Button className="w-full">
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}