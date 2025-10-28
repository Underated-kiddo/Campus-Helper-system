import { toast as sonnerToast } from "sonner";

// Re-export sonner's toast function from a separate module so the Toaster
// component file only exports a component (avoids React Refresh warnings).
export const toast = sonnerToast;

export default toast;
