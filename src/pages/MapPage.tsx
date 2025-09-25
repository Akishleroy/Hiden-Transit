// Страница карты маршрутов и аномалий

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Map, 
  Layers, 
  Filter,
  MapPin,
  Route,
  Globe,
  BarChart3,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { cn } from '../components/ui/utils';
import AnomalyAPI from '../services/api';
import { RouteAnomaly, RegionStats } from '../types/anomalies';

// Имитация карты (в реальном проекте здесь был бы React-Leaflet)
function MapContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-gray-100 rounded-lg relative overflow-hidden', className)}>
      {/* Имитация карты с градиентом */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-200">
        {/* Имитация границ стран */}
        <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-lg opacity-30"></div>
        <div className="absolute top-8 left-8 w-32 h-24 border border-gray-400 rounded opacity-40"></div>
        <div className="absolute top-12 right-12 w-28 h-20 border border-gray-400 rounded opacity-40"></div>
        <div className="absolute bottom-16 left-16 w-24 h-18 border border-gray-400 rounded opacity-40"></div>
      </div>
      {children}
    </div>
  );
}

function MapMarker({ 
  position, 
  severity, 
  label,
  onClick 
}: { 
  position: { top: string; left: string }; 
  severity: string;
  label: string;
  onClick?: () => void;
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 border-red-600';
      case 'high': return 'bg-orange-500 border-orange-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ top: position.top, left: position.left }}
      onClick={onClick}
    >
      <div className={cn(
        'w-4 h-4 rounded-full border-2 shadow-lg',
        getSeverityColor(severity),
        'animate-pulse group-hover:scale-150 transition-transform'
      )}>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapPage() {
  const [routes, setRoutes] = useState<RouteAnomaly[]>([]);
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<'routes' | 'regions' | 'stations'>('routes');
  const [selectedRoute, setSelectedRoute] = useState<RouteAnomaly | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        const data = await AnomalyAPI.getRouteAnomalies();
        setRoutes(data.routes);
        setRegions(data.regions);
      } catch (error) {
        console.error('Ошибка загрузки данных карты:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Критичный';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестный';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  // Мокованные позиции маркеров для демонстрации
  const mockMarkers = [
    { id: '1', position: { top: '20%', left: '30%' }, severity: 'critical', label: 'Москва-Товарная' },
    { id: '2', position: { top: '25%', left: '85%' }, severity: 'high', label: 'Владивосток' },
    { id: '3', position: { top: '35%', left: '25%' }, severity: 'medium', label: 'Санкт-Петербург' },
    { id: '4', position: { top: '45%', left: '35%' }, severity: 'high', label: 'Екатеринбург' },
    { id: '5', position: { top: '60%', left: '40%' }, severity: 'low', label: 'Астана' },
    { id: '6', position: { top: '70%', left: '75%' }, severity: 'medium', label: 'Улан-Батор' }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Map className="h-8 w-8 mr-3 text-blue-600" />
            Карта аномалий
          </h1>
          <p className="text-gray-600">Географическое распределение транзитных аномалий</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Maximize2 className="h-4 w-4 mr-2" />
            Полный экран
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Обновить
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Панель управления */}
        <div className="lg:col-span-1 space-y-6">
          {/* Слои карты */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Слои карты</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Отображение</label>
                <Select value={mapLayer} onValueChange={(value: any) => setMapLayer(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routes">Маршруты</SelectItem>
                    <SelectItem value="regions">Регионы</SelectItem>
                    <SelectItem value="stations">Станции</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Тип карты</label>
                <Select defaultValue="transport">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transport">Транспортная</SelectItem>
                    <SelectItem value="satellite">Спутниковая</SelectItem>
                    <SelectItem value="terrain">Рельеф</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Фильтры */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Фильтры</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Серьезность</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="critical">Критичные</SelectItem>
                    <SelectItem value="high">Высокие</SelectItem>
                    <SelectItem value="medium">Средние</SelectItem>
                    <SelectItem value="low">Низкие</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Тип аномалии</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="weight">Весовые</SelectItem>
                    <SelectItem value="time">Временные</SelectItem>
                    <SelectItem value="route">Маршрутные</SelectItem>
                    <SelectItem value="duplicate">Дубликаты</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Легенда */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Легенда</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Критичные аномалии</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Высокие аномалии</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Средние аномалии</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Низкие аномалии</span>
              </div>
            </CardContent>
          </Card>

          {/* Статистика по регионам */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>По регионам</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                regions.map((region) => (
                  <div key={region.region} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{region.region}</span>
                      <Badge className={cn('text-xs', getSeverityColor(region.severity))}>
                        {region.anomaly_percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {region.anomaly_count.toLocaleString('ru-RU')} из {region.total_operations.toLocaleString('ru-RU')}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Основная карта */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Интерактивная карта</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{mockMarkers.length} станций</Badge>
                  <Badge variant="secondary">{routes.length} маршрутов</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-full relative">
                {loading ? (
                  <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Загрузка карты...</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer className="h-full">
                    {/* Маркеры станций */}
                    {mockMarkers.map((marker) => (
                      <MapMarker
                        key={marker.id}
                        position={marker.position}
                        severity={marker.severity}
                        label={marker.label}
                        onClick={() => console.log('Clicked on:', marker.label)}
                      />
                    ))}

                    {/* Имитация маршрутных линий */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                          refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                        </marker>
                      </defs>
                      
                      {/* Примеры маршрутных линий */}
                      <line x1="30%" y1="20%" x2="85%" y2="25%" 
                        stroke="#dc2626" strokeWidth="3" strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)" opacity="0.7" />
                      <line x1="25%" y1="35%" x2="35%" y2="45%" 
                        stroke="#ea580c" strokeWidth="2" strokeDasharray="3,3"
                        markerEnd="url(#arrowhead)" opacity="0.7" />
                      <line x1="40%" y1="60%" x2="75%" y2="70%" 
                        stroke="#d97706" strokeWidth="2"
                        markerEnd="url(#arrowhead)" opacity="0.7" />
                    </svg>

                    {/* Информационная панель при выборе маршрута */}
                    {selectedRoute && (
                      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {selectedRoute.from_station} → {selectedRoute.to_station}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Аномалий: {selectedRoute.anomaly_count}</p>
                          <p>Всего операций: {selectedRoute.total_operations}</p>
                          <p>Процент аномалий: {selectedRoute.anomaly_percentage}%</p>
                        </div>
                        <Badge className={cn('mt-2', getSeverityColor(selectedRoute.severity))}>
                          {getSeverityLabel(selectedRoute.severity)}
                        </Badge>
                      </div>
                    )}

                    {/* Элементы управления картой */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border">
                      <div className="flex flex-col">
                        <Button variant="ghost" size="sm" className="rounded-b-none">+</Button>
                        <Button variant="ghost" size="sm" className="rounded-t-none border-t">-</Button>
                      </div>
                    </div>
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}