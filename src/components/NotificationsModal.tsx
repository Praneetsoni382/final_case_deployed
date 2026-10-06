import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { NotificationItem } from '../types/index.ts';
import { Bell, CheckCheck, X, Target, Gift, MessageSquare, Flame, BookOpen, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { navigate, refreshCounts } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markAllRead = async () => {
    try {
      await api.markNotificationRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      refreshCounts();
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    try {
      if (!notif.read) {
        await api.markNotificationRead(notif.id);
        setNotifications(prev => prev.map(n => (n.id === notif.id ? { ...n, read: true } : n)));
        refreshCounts();
      }
    } catch {
      // ignore
    }

    onClose();

    if (notif.link) {
      if (notif.link === '/reflection') navigate('reflection');
      else if (notif.link === '/rewards') navigate('rewards');
      else if (notif.link === '/messages') navigate('messages');
      else if (notif.link.startsWith('/teacher/student/')) {
        const studentId = notif.link.replace('/teacher/student/', '');
        navigate('teacher_student_detail', studentId);
      }
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'test_ready':
      case 'test_completed':
        return <Target className="w-5 h-5 text-[#0c2340]" />;
      case 'reward_received':
        return <Gift className="w-5 h-5 text-amber-600" />;
      case 'streak_milestone':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'message_received':
        return <MessageSquare className="w-5 h-5 text-slate-700" />;
      case 'reflection_submitted':
        return <BookOpen className="w-5 h-5 text-[#0c2340]" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Notification Center</h3>
              <p className="text-xs text-slate-500">Real database events & updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#0c2340] hover:text-slate-900 font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You will receive real updates as daily tests, streaks, and teacher rewards occur.
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
                  notif.read
                    ? 'bg-white border-slate-100 hover:border-slate-200 opacity-80'
                    : 'bg-amber-50/40 border-amber-200/60 hover:bg-amber-50/70 shadow-xs'
                }`}
              >
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold truncate ${notif.read ? 'text-slate-800' : 'text-slate-950 font-bold'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
