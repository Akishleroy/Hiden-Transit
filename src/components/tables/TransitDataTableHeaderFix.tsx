// ИСПРАВЛЕНИЯ ДЛЯ ЗАГОЛОВКОВ ТАБЛИЦЫ TransitDataTable.tsx
// Все заголовки должны иметь сортировку

// В JSX части заменить заголовки на:

{/* Заголовки таблицы с сортировкой для всех столбцов */}
<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('id_import')}
>
  <div className="flex items-center gap-2">
    ID Импорт
    <SortIcon column="id_import" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('id_export')}
>
  <div className="flex items-center gap-2">
    ID Экспорт
    <SortIcon column="id_export" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('nomer_vagona')}
>
  <div className="flex items-center gap-2">
    Номер вагона
    <SortIcon column="nomer_vagona" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('strana_otpr_import')}
>
  <div className="flex items-center gap-2">
    Страна отправления
    <SortIcon column="strana_otpr_import" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('strana_nazn_export')}
>
  <div className="flex items-center gap-2">
    Страна назначения
    <SortIcon column="strana_nazn_export" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('stancia_pereaddr')}
>
  <div className="flex items-center gap-2">
    Станция переадресовки
    <SortIcon column="stancia_pereaddr" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('stancia_nazn')}
>
  <div className="flex items-center gap-2">
    Станция назначения
    <SortIcon column="stancia_nazn" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('data_prib_import')}
>
  <div className="flex items-center gap-2">
    Дата прибытия
    <SortIcon column="data_prib_import" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('data_otpr_export')}
>
  <div className="flex items-center gap-2">
    Дата отправления
    <SortIcon column="data_otpr_export" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('ves_import')}
>
  <div className="flex items-center gap-2">
    Вес импорт
    <SortIcon column="ves_import" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('ves_export')}
>
  <div className="flex items-center gap-2">
    Вес экспорт
    <SortIcon column="ves_export" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('naimenovanie_gruza')}
>
  <div className="flex items-center gap-2">
    Наименование груза
    <SortIcon column="naimenovanie_gruza" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('sovpadeniy')}
>
  <div className="flex items-center gap-2">
    Совпадения
    <SortIcon column="sovpadeniy" />
  </div>
</TableHead>

<TableHead 
  className="cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
  onClick={() => handleSort('anomalies')}
>
  <div className="flex items-center gap-2">
    Аномалии
    <SortIcon column="anomalies" />
  </div>
</TableHead>