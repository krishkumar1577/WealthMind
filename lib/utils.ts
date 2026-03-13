import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, messages),
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    if (typeof result === 'string') {
      errors[field] = result;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue;
  }
};

export const clearLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
