import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StorageItem, User } from '../types/index.ts';
import {
  FolderArchive,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  User as UserIcon,
  Search,
  ArrowLeft,
  FileCheck,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Users,
  FileCode,
  FileImage,
  FileVideo,
  FileArchive,
} from 'lucide-react';

export const MyStorageView: React.FC = () => {
  const { user, navigate } = useAuth();

  const [items, setItems] = useState<StorageItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shareWithCohort, setShareWithCohort] = useState(true);
  const [targetStudentId, setTargetStudentId] = useState<string>('all');
  const [students, setStudents] = useState<User[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStorage = async () => {
    try {
      setLoading(true);
      const res = await api.getMyStorage();
      setItems(res.items);
    } catch (err) {
      console.error('Failed to load storage items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
    if (user?.role === 'teacher') {
      api.getTeacherStudents().then(res => {
        setStudents(res.students);
      }).catch(err => {
        console.error('Failed to load students for storage:', err);
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) {
        setUploadError('Selected file exceeds the 100 MB limit. Please select a smaller file.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file from your system to upload.');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setUploadError('The selected file exceeds the 100 MB limit.');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title.trim() || selectedFile.name);
      formData.append('description', description.trim());
      formData.append('shareWithCohort', String(shareWithCohort && targetStudentId === 'all'));
      if (targetStudentId !== 'all') {
        formData.append('targetStudentId', targetStudentId);
      }

      await api.uploadStorageFile(formData);

      setSuccessBanner(`"${title.trim() || selectedFile.name}" has been permanently stored in your storage area.`);
      setTimeout(() => setSuccessBanner(null), 5000);

      // Reset modal
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setTargetStudentId('all');
      setUploadModalOpen(false);

      // Refresh storage
      fetchStorage();
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from storage?`)) return;
    try {
      setDeletingId(id);
      await api.deleteStorageItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete storage item:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (item: StorageItem) => {
    if (item.type === 'reward_link') return <ExternalLink className="w-5 h-5 text-amber-600" />;
    if (item.type === 'reward_text') return <FileCheck className="w-5 h-5 text-slate-700" />;

    const ext = item.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return <FileImage className="w-5 h-5 text-amber-600" />;
    }
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
      return <FileVideo className="w-5 h-5 text-slate-700" />;
    }
    if (['zip', 'rar', '7z', 'tar'].includes(ext || '')) {
      return <FileArchive className="w-5 h-5 text-slate-700" />;
    }
    return <FileText className="w-5 h-5 text-slate-700" />;
  };

  const filteredItems = items.filter(item => {
    if (filterType !== 'all') {
      if (filterType === 'files' && item.type !== 'reward_file' && item.type !== 'teacher_file') return false;
      if (filterType === 'links' && item.type !== 'reward_link') return false;
      if (filterType === 'text' && item.type !== 'reward_text') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.senderName.toLowerCase().includes(q) ||
        (item.content && item.content.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Accessing persistent storage vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4 text-amber-600" />
            <span>Persistent Educational Vault</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900">
            📁 Educational Storage Area
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {user?.role === 'teacher'
              ? 'Upload, store, and manage files, study materials, and learning resources permanently for your students.'
              : 'All teacher rewards, downloaded educational materials, links, and saved mentorship guidance in one place.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Upload Button */}
          <button
            onClick={() => {
              setUploadModalOpen(true);
              setUploadError(null);
            }}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white text-xs font-bold shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>Upload New File</span>
          </button>

          <button
            onClick={() => navigate(user?.role === 'student' ? 'student_dashboard' : 'teacher_dashboard')}
            className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-slate-600 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'files', label: 'Stored Files' },
            { id: 'links', label: 'Curated Links' },
            { id: 'text', label: 'Guidance Notes' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, sender..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Items Table / Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-14 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <FolderArchive className="w-14 h-14 text-indigo-300 mx-auto" />
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {searchQuery ? 'No matching storage items' : 'Storage Area is Empty'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : user?.role === 'teacher'
                ? 'Upload learning files, guides, worksheets, and resources directly from your computer to store them permanently.'
                : 'Rewards and uploaded documents from your teacher will automatically populate this storage vault.'}
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition inline-flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload From Your System</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    {getFileIcon(item)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                      {item.sharedWithCohort && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-300 shrink-0">
                          Cohort Shared
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        <span>Uploaded by: {item.senderName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      {item.fileSize && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{item.fileSize}</span>
                        </>
                      )}
                    </div>
                    {item.content && (item.type === 'reward_text' || item.type === 'teacher_file') && item.content !== item.name && (
                      <p className="text-xs text-slate-600 mt-2 italic font-serif bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                        "{item.content}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Download / Open & Delete */}
                <div className="shrink-0 flex items-center space-x-2 w-full sm:w-auto">
                  {item.url && (item.type === 'reward_file' || item.type === 'teacher_file') && (
                    <a
                      href={item.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                  {item.url && item.type === 'reward_link' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>
                  )}
                  {item.type === 'reward_text' && (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl block text-center">
                      Mentorship Note
                    </span>
                  )}

                  {/* Delete button (accessible if user uploaded or owns it) */}
                  {user && (item.userId === user.id || user.role === 'teacher') && (
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                      title="Remove from storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD FILE MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Upload to Storage Area</h3>
                  <p className="text-xs text-slate-500">Persistent storage for educational materials</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {/* Native File Input Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select File from Your System *
                </label>
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0c2340] transition bg-slate-50/50 text-center">
                  <input
                    type="file"
                    id="system-file-picker"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="system-file-picker" className="cursor-pointer block">
                    <Upload className="w-9 h-9 text-[#0c2340] mx-auto mb-2" />
                    <span className="text-sm font-bold text-slate-800 block">
                      {selectedFile ? selectedFile.name : 'Choose File to Upload'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      {selectedFile
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                        : 'Click to browse files on your device (PDF, DOC, PPT, Audio, Video, Images, etc. • Max 100 MB)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Resource Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Character Study Guide, Resilience Exercise..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50"
                />
              </div>

              {/* Optional Description / Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Study Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add notes, guidance, or instructions for this resource..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50"
                />
              </div>

              {/* Teacher Audience / Cohort Sharing Selector */}
              {user?.role === 'teacher' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#0c2340]" />
                    <label className="text-xs font-bold text-slate-800">
                      Share with Student Storage Area
                    </label>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={targetStudentId}
                      onChange={e => setTargetStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340]"
                    >
                      <option value="all">Share with Entire Cohort (All Students)</option>
                      {students.map(st => (
                        <option key={st.id} value={st.id}>
                          Assign to {st.fullName} ({st.pairingCode})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Files are permanently stored on the server and accessible in the student storage area.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-6 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading File...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload & Permanently Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
