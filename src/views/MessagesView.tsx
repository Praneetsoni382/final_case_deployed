import React, { useEffect, useState, useRef } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Message, User } from '../types/index.ts';
import {
  MessageSquare,
  Send,
  User as UserIcon,
  Clock,
  ArrowLeft,
  CheckCheck,
  RefreshCw,
  Search,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { user, navigate, refreshCounts } = useAuth();

  const [partners, setPartners] = useState<User[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load candidate partners based on role
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoadingPartners(true);
        if (user?.role === 'teacher') {
          const res = await api.getTeacherStudents();
          setPartners(res.students);
          if (res.students.length > 0) {
            setSelectedPartner(res.students[0]);
          } else {
            setSelectedPartner(null);
          }
        } else {
          // Fetch real teacher accounts from backend
          const res = await api.getTeachers();
          const teachers = res.teachers || [];
          setPartners(teachers);

          if (teachers.length > 0) {
            const matchedTeacher = teachers.find(t => t.id === user?.teacherId) || teachers[0];
            setSelectedPartner(matchedTeacher);
          } else {
            setSelectedPartner(null);
          }
        }
      } catch (err) {
        console.error('Failed to load messaging contacts:', err);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, [user]);

  // Load message thread
  const loadThread = async (partnerId: string, quiet = false) => {
    try {
      if (!quiet) setLoadingMessages(true);
      const res = await api.getMessages(partnerId);
      setMessages(res.messages);
      refreshCounts();
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      if (!quiet) setLoadingMessages(false);
    }
  };

  // Real-time synchronization & fast polling
  useEffect(() => {
    if (!selectedPartner) return;

    // Initial load
    loadThread(selectedPartner.id, false);

    // High frequency real-time polling interval (every 1.5 seconds)
    const interval = setInterval(() => {
      loadThread(selectedPartner.id, true);
    }, 1500);

    // Immediate sync when window regains focus
    const handleFocus = () => {
      loadThread(selectedPartner.id, true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner || !text.trim() || !user || sending) return;

    const messageContent = text.trim();
    const tempId = `temp-${Date.now()}`;

    // Instant optimistic message append (0ms latency for sender)
    const tempMessage: Message = {
      id: tempId,
      senderId: user.id,
      senderName: user.fullName,
      senderRole: user.role,
      receiverId: selectedPartner.id,
      receiverName: selectedPartner.fullName,
      text: messageContent,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, tempMessage]);
    setText('');

    try {
      setSending(true);
      const res = await api.sendMessage(selectedPartner.id, messageContent);
      // Replace temporary optimistic message with confirmed server message
      setMessages(prev => prev.map(m => (m.id === tempId ? res.message : m)));
      refreshCounts();
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // Rollback optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert(err?.message || 'Recipient not found. Please select a valid contact.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Private Dialogue</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900">
            💬 Mentorship Messaging
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            1-on-1 private exchange between students and authorized teachers. No public social feed.
          </p>
        </div>
        <button
          onClick={() => navigate(user?.role === 'student' ? 'student_dashboard' : 'teacher_dashboard')}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Contact / Partner List */}
        <div className="md:col-span-4 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {user?.role === 'teacher' ? 'Your Students' : 'Assigned Teacher'}
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {loadingPartners ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading contacts...</div>
            ) : partners.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {user?.role === 'teacher'
                  ? 'No students connected yet. Connect using student pairing codes.'
                  : 'Teacher connection pending.'}
              </div>
            ) : (
              partners.map(p => {
                const isSelected = selectedPartner?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPartner(p)}
                    className={`w-full p-4 text-left transition flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-slate-200/80 border-r-4 border-[#0c2340]'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0c2340] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                      {p.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{p.fullName}</h4>
                      <p className="text-[11px] text-slate-500 capitalize">{p.role}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-8 flex flex-col h-[580px] bg-white">
          {selectedPartner ? (
            <>
              {/* Top Chat Partner Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0c2340] text-white font-bold flex items-center justify-center text-xs">
                    {selectedPartner.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedPartner.fullName}</h3>
                    <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-semibold mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Real-Time Live Sync Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20">
                {loadingMessages ? (
                  <div className="py-16 text-center text-xs text-slate-400">Loading conversation history...</div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No messages yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Send a message to begin your mentorship conversation. Messages persist permanently in the database.
                    </p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMine
                              ? 'bg-[#0c2340] text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1 px-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="p-3.5 border-t border-slate-100 flex items-center space-x-2 bg-white">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={`Write message to ${selectedPartner.fullName}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="p-2.5 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white transition disabled:opacity-40 shadow-sm"
                >
                  {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-amber-300" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation partner from the list to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
