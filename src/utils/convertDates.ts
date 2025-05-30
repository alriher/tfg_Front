// utils/convertDates.ts
export const isIsoDate = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d+)?Z$/.test(value)
  );
};

export const convertDates = <T>(input: T, timeZone = 'Europe/Madrid'): T => {
  const convert = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(convert);
    if (value && typeof value === 'object') {
      const newObj: Record<string, unknown> = {};
      for (const key in value) {
        newObj[key] = convert((value as Record<string, unknown>)[key]);
      }
      return newObj;
    }

    if (value instanceof Date || isIsoDate(value)) {
      
      return new Intl.DateTimeFormat('es-ES', {

        timeZone,
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value));
    }
    return value;
  };

  return convert(input) as T;
};