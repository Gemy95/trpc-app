interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();
  return value === 'true' || value === '1' ? true : false;
}

export function toIntNumber(value: string, num: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(num.default));

  if (Number.isNaN(newValue)) {
    newValue = num?.default || undefined;
  }

  if (num.min) {
    if (newValue < num.min) {
      newValue = num.min;
    }

    if (newValue > num.max) {
      newValue = num.max;
    }
  }

  return newValue;
}
