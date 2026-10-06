import React, { useState } from 'react';
import { api } from '../lib/api.ts';
import {
  X,
  Gift,
  FileText,
  ExternalLink,
  Upload,
  AlertCircle,
  RefreshCw,
  Heart,
} from 'lucide-react';

interface SendRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onRewardSent: () => void;
}

export const SendRewardModal: React.FC<SendRewardModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  onRewardSent,
}) => {
  const [rewardType, setRewardType] = useState<'file' | 'link' | 'text'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files ? e.target.files[0] : null;
    if (selected) {
      if (selected.size > 100 * 1024 * 1024) {
        setError('Selected file exceeds the 100 MB size limit. Please choose a smaller file.');
        setFile(null);
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a reward title.');
      return;
    }

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('type', rewardType);
    formData.append('title', title.trim());

    if (rewardType === 'file') {
      if (!file) {
        setError('Please select a file to upload.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('The file exceeds the 100 MB limit.');
        return;
      }
      formData.append('rewardFile', file);
    } else if (rewardType === 'link') {
      if (!content.trim().startsWith('http')) {
        setError('Please enter a valid link starting with http:// or https://');
        return;
      }
      formData.append('content', content.trim());
    } else {
      if (content.trim().length < 5) {
        setError('Please enter at least 5 characters of personal guidance.');
        return;
      }
      formData.append('content', content.trim());
    }

    try {
      setLoading(true);
      await api.sendReward(formData);
      onRewardSent();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send reward.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-amber-300 flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Send Milestone Recognition</h3>
              <p className="text-xs text-slate-500">Student: <strong className="text-slate-800">{studentName}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Reward Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Reward Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { type: 'text', label: 'Guidance Text', icon: Heart },
                { type: 'file', label: 'Upload File', icon: FileText },
                { type: 'link', label: 'Curated Link', icon: ExternalLink },
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = rewardType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setRewardType(opt.type as any);
                      setError(null);
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition flex flex-col items-center text-center space-y-1.5 ${
                      isSelected
                        ? 'border-[#0c2340] bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reward Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 7-Day Consistency Honor, Reading on Character..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50"
            />
          </div>

          {/* File Upload Option */}
          {rewardType === 'file' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach Document / Learning Resource
              </label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 transition bg-slate-50/40 text-center">
                <input
                  type="file"
                  id="reward-file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="reward-file" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-[#0c2340] mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800 block truncate px-4">
                    {file ? file.name : 'Click to select PDF, PPT, DOC, Audio, Video, or Image file'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Persistent real storage • Max 100 MB
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Link Option */}
          {rewardType === 'link' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resource URL</label>
              <input
                type="url"
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="https://example.com/essay-on-resilience"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50"
              />
            </div>
          )}

          {/* Text Option */}
          {rewardType === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personal Guidance & Encouragement
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write personal words of recognition acknowledging their consistency and character..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50 leading-relaxed"
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4 text-amber-300" />}
              <span>Send Recognition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
