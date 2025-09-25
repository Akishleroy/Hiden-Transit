// ИСПРАВЛЕНИЯ для TransitDataTable.tsx

// 1. Добавляем сортировку для всех столбцов в функции сортировки

const applyFiltersAndSearch = (data: TransitRecord[], filters?: FilterState, search?: string): TransitRecord[] => {
  // ... существующий код ...

  // Расширенная сортировка с поддержкой всех столбцов
  if (sortDirection && sortColumn) {
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortColumn) {
        case 'nomer_vagona':
          aVal = a.nomer_vagona;
          bVal = b.nomer_vagona;
          break;
        case 'data_prib_import':
          aVal = new Date(a.data_prib_import).getTime();
          bVal = new Date(b.data_prib_import).getTime();
          break;
        case 'data_otpr_export':
          aVal = new Date(a.data_otpr_export).getTime();
          bVal = new Date(b.data_otpr_export).getTime();
          break;
        case 'ves_import':
          aVal = a.ves_import;
          bVal = b.ves_import;
          break;
        case 'ves_export':
          aVal = a.ves_export;
          bVal = b.ves_export;
          break;
        case 'id_import':
          aVal = a.id_import;
          bVal = b.id_import;
          break;
        case 'id_export':
          aVal = a.id_export;
          bVal = b.id_export;
          break;
        case 'strana_otpr_import':
          aVal = a.strana_otpr_import;
          bVal = b.strana_otpr_import;
          break;
        case 'strana_nazn_export':
          aVal = a.strana_nazn_export;
          bVal = b.strana_nazn_export;
          break;
        case 'stancia_pereaddr':
          aVal = a.stancia_pereaddr;
          bVal = b.stancia_pereaddr;
          break;
        case 'stancia_nazn':
          aVal = a.stancia_nazn;
          bVal = b.stancia_nazn;
          break;
        case 'naimenovanie_gruza':
          aVal = a.naimenovanie_gruza;
          bVal = b.naimenovanie_gruza;
          break;
        case 'sovpadeniy':
          aVal = a.probability_category;
          bVal = b.probability_category;
          break;
        case 'anomalies':
          aVal = a.anomalies.length;
          bVal = b.anomalies.length;
          break;
        default:
          aVal = a.id_import;
          bVal = b.id_import;
      }

      // Обработка строковых значений
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal, 'ru') 
          : bVal.localeCompare(aVal, 'ru');
      }

      // Обработка числовых значений
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
};

// 2. Исправляем позиционирование панели фильтров и таблицы
// В JSX части нужно изменить стили для правильного выравнивания