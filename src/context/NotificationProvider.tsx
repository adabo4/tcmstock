import { useRef, useState, type ReactNode } from "react";
import { NotificationContext } from "./NotificationContext";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

type Notification = {
  message: string;
  type: NotificationType;
};
type NotificationProviderProps = {
  children: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const timeoutRef = useRef<number | null>(null);

  function hideNotification() {
    setNotification(null);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function showNotification(
    message: string,
    type: NotificationType = "success",
  ) {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setNotification({
      message,
      type,
    });

    timeoutRef.current = window.setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 3500);
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <NotificationToast
          notification={notification}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

type NotificationToastProps = {
  notification: Notification;
  onClose: () => void;
};

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const styles = {
    success: {
      wrapper: "border-green-200 bg-green-50 text-green-800",
      icon: <CheckCircle2 className="text-green-600" size={22} />,
    },
    error: {
      wrapper: "border-red-200 bg-red-50 text-red-800",
      icon: <CircleAlert className="text-red-600" size={22} />,
    },
    info: {
      wrapper: "border-blue-200 bg-blue-50 text-blue-800",
      icon: <Info className="text-blue-600" size={22} />,
    },
  };

  const selectedStyle = styles[notification.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-5 top-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl ${selectedStyle.wrapper}`}
    >
      <div className="mt-0.5 shrink-0">{selectedStyle.icon}</div>

      <p className="flex-1 text-sm font-semibold">{notification.message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 opacity-60 transition hover:opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  );
}
