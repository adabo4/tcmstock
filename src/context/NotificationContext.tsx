import { createContext } from "react";
import type { NotificationType } from "./NotificationProvider";

type NotificationContextValue = {
  showNotification: (message: string, type?: NotificationType) => void;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
