import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },

  error: (error: any, fallbackMessage = "An error occurred") => {
    let message = fallbackMessage;

    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === "object") {
      message = error.message || error.error || fallbackMessage;
    }

    sonnerToast.error(message);
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },

  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};
