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
