import { Request, Response } from "express";
import { applicationService } from "../services/application.service.js";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const notifications = await applicationService.getNotifications(userId);
    const unread = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount: unread,
      sortedByTime: notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const getNotificationCount = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const notifications = await applicationService.getNotifications(userId);
    const unread = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      unreadCount: unread,
      totalCount: notifications.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const notificationId = firstParam(req.params.notificationId);
    const userId = firstParam(req.params.userId);

    if (!notificationId || !userId) {
      res.status(400).json({ error: "Notification ID and User ID are required" });
      return;
    }

    await applicationService.markNotificationRead(notificationId, userId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const userId = firstParam(req.params.userId);

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    await applicationService.markAllNotificationsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};
