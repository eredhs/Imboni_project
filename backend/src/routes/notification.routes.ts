import { Router } from "express";
import {
  getNotifications,
  getNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";
import { requireSelfOrRoles } from "../middleware/authorization.js";

export const notificationRouter = Router();

// Get all notifications for a user
notificationRouter.get("/:userId", requireSelfOrRoles("userId", "system_controller"), getNotifications);

// Get unread notification count
notificationRouter.get("/:userId/count", requireSelfOrRoles("userId", "system_controller"), getNotificationCount);

// Mark single notification as read
notificationRouter.patch("/:userId/:notificationId/read", requireSelfOrRoles("userId", "system_controller"), markNotificationRead);

// Mark all notifications as read
notificationRouter.patch("/:userId/mark-all-read", requireSelfOrRoles("userId", "system_controller"), markAllNotificationsRead);
