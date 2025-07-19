import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedValues<T extends Record<string, any>>(
  oldObj: T,
  newObj: Partial<T>
): Partial<T> {
  const changed = {} as Partial<T>;

  (Object.keys(newObj) as Array<keyof T>).forEach((key) => {
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changed[key] = newValue as T[typeof key];
    }
  });

  return changed;
}

export function buildQueryParams(params: Record<string, any>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value.toString());
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
