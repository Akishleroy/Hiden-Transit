// Улучшенная пагинация с анимациями

import { motion } from 'motion/react';
import { Button } from './button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from './utils';

interface EnhancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
  className?: string;
}

export function EnhancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPageInfo = true,
  className
}: EnhancedPaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Показываем все страницы если их мало
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Логика для большого количества страниц
      if (currentPage <= 4) {
        // Начало списка
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis1');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Конец списка
        pages.push(1);
        pages.push('ellipsis1');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Середина списка
        pages.push(1);
        pages.push('ellipsis1');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis2');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showPageInfo && (
        <motion.div 
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Страница {currentPage} из {totalPages}
        </motion.div>
      )}

      <div className="flex items-center space-x-1">
        {/* Первая страница */}
        {showFirstLast && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Предыдущая страница */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Button>
        </motion.div>

        {/* Номера страниц */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <div key={page} className="flex items-center justify-center h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }

            return (
              <motion.div
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 transition-all duration-200",
                    currentPage === page && "bg-blue-600 text-white shadow-lg"
                  )}
                >
                  {page}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Следующая страница */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-3"
          >
            Вперед
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>

        {/* Последняя страница */}
        {showFirstLast && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}