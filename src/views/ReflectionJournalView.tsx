import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Reflection } from '../types/index.ts';
import {
  BookOpen,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowLeft,
  Clock,
  Compass,
} from 'lucide-react';

export const ReflectionJournalView: React.FC = () => {
  const { navigate } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        const res = await api.getReflections();
        setReflections(res.reflections);
        if (res.reflections.length > 0) {
          setExpandedId(res.reflections[0].id);
        }
      } catch (err) {
        console.error('Failed to load reflections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Opening your reflection archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Permanent Inward Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
            Reflection Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Observe how your perspective, intentions, and self-awareness evolve day by day.
          </p>
        </div>
        <button
          onClick={() => navigate('student_dashboard')}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      {reflections.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">Your Journal is Currently Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Complete today’s development test and submit your first daily reflection to start your permanent journal.
          </p>
          <button
            onClick={() => navigate('student_test')}
            className="px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition"
          >
            Take Today’s Test
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {reflections.map(ref => {
            const isExpanded = expandedId === ref.id;
            return (
              <div
                key={ref.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 transition overflow-hidden"
              >
                {/* Accordion header with clickable date */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ref.id)}
                  className="p-4 sm:p-5 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                      <Calendar className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 font-serif">
                        {formatDate(ref.date)}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">
                        "{ref.mainReflection}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                      Recorded Entry
                    </span>
                    <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded complete reflection */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3.5 bg-slate-50/40">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        What today's questions made you realize:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs italic font-serif">
                        "{ref.mainReflection}"
                      </p>
                    </div>

                    {ref.whatLearned && (
                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-1">Key Insight / Learning:</strong>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">{ref.whatLearned}</div>
                      </div>
                    )}

                    {ref.improveTomorrow && (
                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-1">Tomorrow's Focus:</strong>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">{ref.improveTomorrow}</div>
                      </div>
                    )}

                    {ref.thoughtProvokingAnswer && (
                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-1">Most Thought-Provoking Question:</strong>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">{ref.thoughtProvokingAnswer}</div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/60 text-[10px] text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Tag className="w-3 h-3 text-amber-600" />
                        <span>Development Focus: {ref.relatedDevelopmentAreas.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Timestamp: {new Date(ref.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
