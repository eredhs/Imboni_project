"use client";

import { Bell, CheckCheck } from "lucide-react";
import { JobSeekerLayout } from "@/components/layout/job-seeker-layout";
import { useAuth } from "@/lib/auth-context";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/store/api/applications-api";

export default function NotificationsPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const { data, isLoading, isError } = useGetNotificationsQuery(userId, {
    skip: !userId,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const notifications = data?.data ?? [];

  return (
    <JobSeekerLayout>
      <div className="min-h-screen bg-slate-950 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="mt-2 text-slate-400">
                Screening, shortlist, interview, and recruiter updates from the real backend.
              </p>
            </div>
            <button
              type="button"
              onClick={() => userId && void markAllRead(userId)}
              disabled={!userId || isMarkingAll || notifications.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>

          {isLoading ? (
            <PanelMessage title="Loading notifications..." body="Fetching your latest activity." />
          ) : isError ? (
            <PanelMessage title="Notifications unavailable" body="We could not load notifications right now." />
          ) : notifications.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    userId &&
                    !notification.read &&
                    void markNotificationRead({
                      userId,
                      notificationId: notification.id,
                    })
                  }
                  className={`w-full border-b border-slate-800 px-5 py-4 text-left last:border-b-0 ${
                    notification.read ? "bg-slate-900/40" : "bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        {notification.actionUrl ? (
                          <p className="mt-2 text-xs font-semibold text-emerald-400">
                            Linked path: {notification.actionUrl}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {!notification.read ? (
                      <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <PanelMessage title="No notifications yet" body="When screening finishes or recruiters update your applications, notifications will appear here." />
          )}
        </div>
      </div>
    </JobSeekerLayout>
  );
}

function PanelMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}
