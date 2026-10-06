import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Reward } from '../types/index.ts';
import {
  Gift,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  User,
  Heart,
  FolderArchive,
} from 'lucide-react';

export const MyRewardsView: React.FC = () => {
  const { navigate } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const res = await api.getMyRewards();
        setRewards(res.rewards);
      } catch (err) {
        console.error('Failed to load rewards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Retrieving your teacher rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2.5 border border-white/15">
            <Gift className="w-3.5 h-3.5" />
            <span>Teacher Recognition & Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            🎁 My Rewards & Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-xl font-light">
            Educational files, curated resources, and personal guidance awarded by your teacher in recognition of consistency.
          </p>
        </div>
        <button
          onClick={() => navigate('storage')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center space-x-2 shrink-0"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Go to Resource Storage</span>
        </button>
      </div>

      {rewards.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Gift className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No Rewards Received Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            As you maintain daily test consistency and achieve 7-day milestones, your teacher can award you specialized educational materials, reading files, and personal mentorship notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase tracking-wider border border-slate-200">
                    {reward.type === 'file' ? '📁 Educational File' : reward.type === 'link' ? '🔗 Curated Resource Link' : '💬 Personal Guidance'}
                  </span>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(reward.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-0.5">{reward.title}</h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1.5 mb-3">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Awarded by Teacher: <strong className="text-slate-700">{reward.teacherName}</strong></span>
                </p>

                {/* Content details based on type */}
                {reward.type === 'text' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif italic">
                    "{reward.content}"
                  </div>
                )}

                {reward.type === 'link' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500 block mb-1 text-[11px]">Recommended Link:</span>
                    <a
                      href={reward.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-900 hover:underline break-all flex items-center space-x-1.5"
                    >
                      <span>{reward.content}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                )}

                {reward.type === 'file' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="w-7 h-7 text-slate-700 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {reward.content}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {reward.fileSize ? `${(reward.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Attached File'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {reward.type === 'file' && reward.fileUrl && (
                  <a
                    href={reward.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs transition flex items-center justify-center space-x-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Attachment</span>
                  </a>
                )}
                {reward.type === 'link' && (
                  <a
                    href={reward.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs transition flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Resource URL</span>
                  </a>
                )}
                {reward.type === 'text' && (
                  <div className="text-center text-xs text-slate-600 font-medium py-0.5">
                    Saved in your personal storage archives
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
