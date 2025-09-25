import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { Upload, FileSpreadsheet, Database, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { parseCSV, validateCSVFile, createPreview, CSVParseResult } from '../../utils/csvParser';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: any[], mode: 'replace' | 'append') => void;
}

interface ImportStats {
  totalRows: number;
  successRows: number;
  errorRows: number;
  duplicates: number;
}

export function ImportDataModal({ isOpen, onClose, onImportComplete }: ImportDataModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверяем доступность рефа при открытии модала
  useEffect(() => {
    if (isOpen) {
      // Даем время для рендеринга
      const timer = setTimeout(() => {
        if (!fileInputRef.current) {
          console.warn('FileInput ref недоступен, используем fallback');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Валидируем файл
    const validationErrors = validateCSVFile(selectedFile);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      // Сбрасываем input для повторного выбора
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    setFile(selectedFile);
    setPreviewData([]);
    setImportStats(null);
    setErrors([]);
    
    // Создаем превью данных
    generatePreview(selectedFile);
    
    toast.success(`Файл "${selectedFile.name}" загружен успешно!`);
  };

  const generatePreview = async (file: File) => {
    try {
      const text = await file.text();
      const preview = createPreview(text, 5);
      setPreviewData(preview);
    } catch (error) {
      toast.error('Ошибка чтения файла');
    }
  };

  const processImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setErrors([]);

    try {
      // Читаем файл
      const text = await file.text();
      setProgress(20);

      // Парсим CSV с помощью утилиты
      const parseResult: CSVParseResult = parseCSV(text);
      setProgress(60);

      if (parseResult.data.length === 0) {
        throw new Error('Файл не содержит валидных данных для импорта');
      }

      // Дополнительная обработка для выявления дубликатов
      const validData: any[] = [];
      const errorMessages: string[] = [...parseResult.errors];
      let duplicateCount = 0;

      // Простая проверка дубликатов по комбинации ключевых полей
      const seenIds = new Set<string>();

      for (let i = 0; i < parseResult.data.length; i++) {
        const record = parseResult.data[i];
        
        // Проверяем дубликаты
        if (seenIds.has(record.id)) {
          duplicateCount++;
          errorMessages.push(`Дубликат записи: ${record.order_number || record.message_code || 'неизвестно'}`);
          continue;
        }

        seenIds.add(record.id);
        validData.push(record);
        
        // Обновляем прогресс
        setProgress(60 + (i / parseResult.data.length) * 30);
      }

      const stats: ImportStats = {
        totalRows: parseResult.totalRows,
        successRows: validData.length,
        errorRows: errorMessages.length,
        duplicates: duplicateCount
      };

      setImportStats(stats);
      setErrors(errorMessages);
      setProgress(100);

      // Показываем сводку результатов
      if (stats.successRows > 0) {
        toast.success(`Импорт завершен: ${stats.successRows} записей готово к загрузке`);
        
        // Передаем данные в родительский компонент для применения
        if (window.confirm(
          `Обработано ${stats.successRows} записей.\n` +
          `Режим: ${importMode === 'replace' ? 'Заменить все данные' : 'Добавить к существующим'}.\n` +
          `${stats.errorRows > 0 ? `Ошибок: ${stats.errorRows}\n` : ''}` +
          `${stats.duplicates > 0 ? `Дубликатов: ${stats.duplicates}\n` : ''}` +
          `\nПродолжить импорт?`
        )) {
          onImportComplete(validData, importMode);
          toast.success(`${importMode === 'replace' ? 'База данных заменена' : 'Данные добавлены'}: ${stats.successRows} записей`);
        }
      } else {
        toast.error('Не найдено валидных записей для импорта');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка импорта';
      toast.error(errorMessage);
      setErrors([errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFile(null);
      setPreviewData([]);
      setImportStats(null);
      setErrors([]);
      setProgress(0);
      onClose();
    }
  };

  const handleFileButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Даем React время для обновления рефа
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        // Пытаемся найти элемент по ID как fallback
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.click();
        } else {
          toast.error('Ошибка: не удается открыть диалог выбора файла');
        }
      }
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Импорт данных в базу знаний
          </DialogTitle>
          <DialogDescription>
            Загрузите CSV, XLS или XLSX файл с транзитными данными для импорта в систему. Максимальный размер файла: 500MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Выбор файла */}
          <div className="space-y-4">
            <Label htmlFor="file-upload">Выберите файл для импорта</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="hidden"
                style={{ display: 'none' }}
              />
              <Button
                onClick={handleFileButtonClick}
                disabled={isProcessing}
                variant="outline"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300"
                type="button"
              >
                <Upload className="w-4 h-4" />
                {file ? 'Выбрать другой файл' : 'Выбрать файл'}
              </Button>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Режим импорта */}
          {file && (
            <div className="space-y-4">
              <Label>Режим импорта</Label>
              <RadioGroup
                value={importMode}
                onValueChange={(value: 'replace' | 'append') => setImportMode(value)}
                disabled={isProcessing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="append" id="append" />
                  <Label htmlFor="append" className="cursor-pointer">
                    Добавить к существующим данным
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id="replace" />
                  <Label htmlFor="replace" className="cursor-pointer text-destructive">
                    Очистить БД и загрузить новые данные
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Превью данных */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <Label>Превью данных (первые 5 строк)</Label>
              <div className="border rounded-lg overflow-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      {previewData[0]?.map((header: string, index: number) => (
                        <th key={index} className="p-2 text-left border-r whitespace-nowrap">
                          {header || `Колонка ${index + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell: string, cellIndex: number) => (
                          <td key={cellIndex} className="p-2 border-r truncate max-w-32">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Прогресс импорта */}
          {isProcessing && (
            <div className="space-y-4">
              <Label>Обработка данных...</Label>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {progress}% завершено
              </p>
            </div>
          )}

          {/* Статистика импорта */}
          {importStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {importStats.totalRows}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Всего строк
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {importStats.successRows}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Успешно
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {importStats.errorRows}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Ошибки
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {importStats.duplicates}
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Дубликаты
                </div>
              </div>
            </motion.div>
          )}

          {/* Ошибки */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Обнаружены ошибки при импорте:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm max-h-32 overflow-y-auto">
                    {errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li className="text-muted-foreground">
                        и еще {errors.length - 10} ошибок...
                      </li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Формат данных */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Поддерживаемые форматы:</strong> CSV, XLS, XLSX</p>
                <p><strong>Разделитель:</strong> точка с запятой (;)</p>
                <p><strong>Кодировка:</strong> UTF-8</p>
                <p><strong>Максимальный размер:</strong> 500MB</p>
                <p><strong>Образец структуры:</strong></p>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
                  Код сооб;КПП;Дата передачи;Номер наряда;Общ.вес;Груз;...
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
          <Button
            onClick={processImport}
            disabled={!file || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Обработка...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Импортировать
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}