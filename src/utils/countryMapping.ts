// Утилиты для работы с названиями стран

export interface CountryInfo {
  code: string;
  name: string;
  shortName: string;
}

export const COUNTRY_MAPPING: Record<string, CountryInfo> = {
  'RU': {
    code: 'RU',
    name: 'РОССИЙСКАЯ ФЕДЕРАЦИЯ',
    shortName: 'Россия'
  },
  'KZ': {
    code: 'KZ', 
    name: 'РЕСПУБЛИКА КАЗАХСТАН',
    shortName: 'Казахстан'
  },
  'CN': {
    code: 'CN',
    name: 'КИТАЙСКАЯ НАРОДНАЯ РЕСПУБЛИКА', 
    shortName: 'Китай'
  },
  'MN': {
    code: 'MN',
    name: 'МОНГОЛИЯ',
    shortName: 'Монголия'
  },
  'UZ': {
    code: 'UZ',
    name: 'РЕСПУБЛИКА УЗБЕКИСТАН',
    shortName: 'Узбекистан'
  },
  'KG': {
    code: 'KG',
    name: 'КЫРГЫЗСКАЯ РЕСПУБЛИКА',
    shortName: 'Кыргызстан'
  },
  'TJ': {
    code: 'TJ',
    name: 'РЕСПУБЛИКА ТАДЖИКИСТАН',
    shortName: 'Таджикистан'
  },
  'AM': {
    code: 'AM',
    name: 'РЕСПУБЛИКА АРМЕНИЯ',
    shortName: 'Армения'
  },
  'GE': {
    code: 'GE',
    name: 'ГРУЗИЯ',
    shortName: 'Грузия'
  },
  'AZ': {
    code: 'AZ',
    name: 'АЗЕРБАЙДЖАНСКАЯ РЕСПУБЛИКА',
    shortName: 'Азербайджан'
  },
  'BY': {
    code: 'BY',
    name: 'РЕСПУБЛИКА БЕЛАРУСЬ',
    shortName: 'Беларусь'
  },
  'UA': {
    code: 'UA',
    name: 'УКРАИНА',
    shortName: 'Украина'
  },
  'TM': {
    code: 'TM',
    name: 'ТУРКМЕНИСТАН',
    shortName: 'Туркменистан'
  },
  'IR': {
    code: 'IR',
    name: 'ИСЛАМСКАЯ РЕСПУБЛИКА ИРАН',
    shortName: 'Иран'
  },
  'TR': {
    code: 'TR',
    name: 'ТУРЕЦКАЯ РЕСПУБЛИКА',
    shortName: 'Турция'
  },
  'PL': {
    code: 'PL',
    name: 'РЕСПУБЛИКА ПОЛЬША',
    shortName: 'Польша'
  },
  'DE': {
    code: 'DE',
    name: 'ФЕДЕРАТИВНАЯ РЕСПУБЛИКА ГЕРМАНИЯ',
    shortName: 'Германия'
  },
  'LT': {
    code: 'LT',
    name: 'ЛИТОВСКАЯ РЕСПУБЛИКА',
    shortName: 'Литва'
  },
  'LV': {
    code: 'LV',
    name: 'ЛАТВИЙСКАЯ РЕСПУБЛИКА',
    shortName: 'Латвия'
  },
  'EE': {
    code: 'EE',
    name: 'ЭСТОНСКАЯ РЕСПУБЛИКА',
    shortName: 'Эстония'
  },
  'FI': {
    code: 'FI',
    name: 'ФИНЛЯНДСКАЯ РЕСПУБЛИКА',
    shortName: 'Финляндия'
  },
  'NO': {
    code: 'NO',
    name: 'КОРОЛЕВСТВО НОРВЕГИЯ',
    shortName: 'Норвегия'
  },
  'SE': {
    code: 'SE',
    name: 'КОРОЛЕВСТВО ШВЕЦИЯ',
    shortName: 'Швеция'
  },
  'DK': {
    code: 'DK',
    name: 'КОРОЛЕВСТВО ДАНИЯ',
    shortName: 'Дания'
  },
  'NL': {
    code: 'NL',
    name: 'КОРОЛЕВСТВО НИДЕРЛАНДОВ',
    shortName: 'Нидерланды'
  },
  'BE': {
    code: 'BE',
    name: 'КОРОЛЕВСТВО БЕЛЬГИЯ',
    shortName: 'Бельгия'
  },
  'FR': {
    code: 'FR',
    name: 'ФРАНЦУЗСКАЯ РЕСПУБЛИКА',
    shortName: 'Франция'
  },
  'IT': {
    code: 'IT',
    name: 'ИТАЛЬЯНСКАЯ РЕСПУБЛИКА',
    shortName: 'Италия'
  },
  'ES': {
    code: 'ES',
    name: 'КОРОЛЕВСТВО ИСПАНИЯ',
    shortName: 'Испания'
  },
  'AT': {
    code: 'AT',
    name: 'АВСТРИЙСКАЯ РЕСПУБЛИКА',
    shortName: 'Австрия'
  },
  'CH': {
    code: 'CH',
    name: 'ШВЕЙЦАРСКАЯ КОНФЕДЕРАЦИЯ',
    shortName: 'Швейцария'
  },
  'CZ': {
    code: 'CZ',
    name: 'ЧЕШСКАЯ РЕСПУБЛИКА',
    shortName: 'Чехия'
  },
  'SK': {
    code: 'SK',
    name: 'СЛОВАЦКАЯ РЕСПУБЛИКА',
    shortName: 'Словакия'
  },
  'HU': {
    code: 'HU',
    name: 'ВЕНГРИЯ',
    shortName: 'Венгрия'
  },
  'RO': {
    code: 'RO',
    name: 'РУМЫНИЯ',
    shortName: 'Румыния'
  },
  'BG': {
    code: 'BG',
    name: 'РЕСПУБЛИКА БОЛГАРИЯ',
    shortName: 'Болгария'
  },
  'RS': {
    code: 'RS',
    name: 'РЕСПУБЛИКА СЕРБИЯ',
    shortName: 'Сербия'
  },
  'HR': {
    code: 'HR',
    name: 'РЕСПУБЛИКА ХОРВАТИЯ',
    shortName: 'Хорватия'
  },
  'SI': {
    code: 'SI',
    name: 'РЕСПУБЛИКА СЛОВЕНИЯ',
    shortName: 'Словения'
  },
  'MD': {
    code: 'MD',
    name: 'РЕСПУБЛИКА МОЛДОВА',
    shortName: 'Молдова'
  },
  'JP': {
    code: 'JP',
    name: 'ЯПОНИЯ',
    shortName: 'Япония'
  },
  'KR': {
    code: 'KR',
    name: 'РЕСПУБЛИКА КОРЕЯ',
    shortName: 'Южная Корея'
  },
  'KP': {
    code: 'KP',
    name: 'КОРЕЙСКАЯ НАРОДНО-ДЕМОКРАТИЧЕСКАЯ РЕСПУБЛИКА',
    shortName: 'Северная Корея'
  },
  'VN': {
    code: 'VN',
    name: 'СОЦИАЛИСТИЧЕСКАЯ РЕСПУБЛИКА ВЬЕТНАМ',
    shortName: 'Вьетнам'
  },
  'TH': {
    code: 'TH',
    name: 'КОРОЛЕВСТВО ТАИЛАНД',
    shortName: 'Таиланд'
  },
  'MY': {
    code: 'MY',
    name: 'МАЛАЙЗИЯ',
    shortName: 'Малайзия'
  },
  'SG': {
    code: 'SG',
    name: 'РЕСПУБЛИКА СИНГАПУР',
    shortName: 'Сингапур'
  },
  'IN': {
    code: 'IN',
    name: 'РЕСПУБЛИКА ИНДИЯ',
    shortName: 'Индия'
  },
  'PK': {
    code: 'PK',
    name: 'ИСЛАМСКАЯ РЕСПУБЛИКА ПАКИСТАН',
    shortName: 'Пакистан'
  },
  'AF': {
    code: 'AF',
    name: 'ИСЛАМСКАЯ РЕСПУБЛИКА АФГАНИСТАН',
    shortName: 'Афганистан'
  }
};

/**
 * Получить полное название страны по коду
 */
export const getCountryFullName = (code: string): string => {
  if (!code) return '';
  
  const country = COUNTRY_MAPPING[code.toUpperCase()];
  if (country) {
    return country.name;
  }
  
  // Если код не найден, возвращаем код как есть
  return code;
};

/**
 * Получить краткое название страны по коду
 */
export const getCountryShortName = (code: string): string => {
  if (!code) return '';
  
  const country = COUNTRY_MAPPING[code.toUpperCase()];
  if (country) {
    return country.shortName;
  }
  
  // Если код не найден, возвращаем код как есть
  return code;
};

/**
 * Получить код страны по полному или краткому названию
 */
export const getCountryCode = (name: string): string => {
  if (!name) return '';
  
  const searchName = name.toUpperCase();
  
  // Ищем по полному названию
  for (const [code, info] of Object.entries(COUNTRY_MAPPING)) {
    if (info.name.toUpperCase() === searchName || 
        info.shortName.toUpperCase() === searchName) {
      return code;
    }
  }
  
  // Если не найдено, возвращаем исходное название
  return name;
};

/**
 * Получить список всех стран для фильтров
 */
export const getAllCountries = (): CountryInfo[] => {
  return Object.values(COUNTRY_MAPPING);
};

/**
 * Проверить является ли строка кодом страны
 */
export const isCountryCode = (value: string): boolean => {
  if (!value || value.length !== 2) return false;
  return value.toUpperCase() in COUNTRY_MAPPING;
};

/**
 * Нормализация названия страны (код -> полное название)
 */
export const normalizeCountryName = (value: string): string => {
  if (!value) return '';
  
  // Если это код страны - возвращаем полное название
  if (isCountryCode(value)) {
    return getCountryFullName(value);
  }
  
  // Если это уже полное название - возвращаем как есть
  return value;
};

/**
 * Получить отображаемое название страны (краткое для UI)
 */
export const getCountryDisplayName = (value: string): string => {
  if (!value) return '';
  
  // Если это код страны - возвращаем краткое название
  if (isCountryCode(value)) {
    return getCountryShortName(value);
  }
  
  // Если это полное название - возвращаем краткое
  const code = getCountryCode(value);
  if (code !== value) {
    return getCountryShortName(code);
  }
  
  // Возвращаем как есть
  return value;
};

/**
 * Проверить совпадает ли название страны с любым из форматов (код, краткое, полное)
 */
export const matchesCountryName = (searchValue: string, recordValue: string): boolean => {
  if (!searchValue || !recordValue) return false;
  
  const searchLower = searchValue.toLowerCase().trim();
  const recordLower = recordValue.toLowerCase().trim();
  
  // Прямое совпадение
  if (recordLower.includes(searchLower)) {
    return true;
  }
  
  // Проверяем все форматы для searchValue
  let searchVariants: string[] = [searchLower];
  
  // Если searchValue это краткое название - добавляем код и полное название
  for (const [code, info] of Object.entries(COUNTRY_MAPPING)) {
    if (info.shortName.toLowerCase() === searchLower) {
      searchVariants.push(code.toLowerCase());
      searchVariants.push(info.name.toLowerCase());
      searchVariants.push(info.code.toLowerCase());
      break;
    }
  }
  
  // Если searchValue это код страны - добавляем названия
  if (isCountryCode(searchValue.toUpperCase())) {
    const info = COUNTRY_MAPPING[searchValue.toUpperCase()];
    if (info) {
      searchVariants.push(info.shortName.toLowerCase());
      searchVariants.push(info.name.toLowerCase());
    }
  }
  
  // Проверяем все форматы для recordValue
  let recordVariants: string[] = [recordLower];
  
  // Если recordValue это код страны - добавляем названия
  if (isCountryCode(recordValue.toUpperCase())) {
    const info = COUNTRY_MAPPING[recordValue.toUpperCase()];
    if (info) {
      recordVariants.push(info.shortName.toLowerCase());
      recordVariants.push(info.name.toLowerCase());
    }
  } else {
    // Если recordValue это название - добавляем код
    for (const [code, info] of Object.entries(COUNTRY_MAPPING)) {
      if (info.shortName.toLowerCase() === recordLower || info.name.toLowerCase() === recordLower) {
        recordVariants.push(code.toLowerCase());
        recordVariants.push(info.shortName.toLowerCase());
        recordVariants.push(info.name.toLowerCase());
        break;
      }
    }
  }
  
  // Проверяем пересечение всех вариантов
  return searchVariants.some(searchVar => 
    recordVariants.some(recordVar => 
      recordVar.includes(searchVar) || searchVar.includes(recordVar)
    )
  );
};

/**
 * Получить код страны по краткому названию (для фильтрации)
 */
export const getCountryCodeByShortName = (shortName: string): string => {
  if (!shortName) return '';
  
  for (const [code, info] of Object.entries(COUNTRY_MAPPING)) {
    if (info.shortName.toLowerCase() === shortName.toLowerCase()) {
      return code;
    }
  }
  
  return shortName;
};