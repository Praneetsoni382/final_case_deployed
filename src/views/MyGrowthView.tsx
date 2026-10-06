import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { ParameterGrowth, GrowthEvidence, DailyTest, MainGrowthParameter } from '../types/index.ts';
import {
  TrendingUp,
  Target,
  BarChart3,
  LineChart,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ShieldCheck,
  ChevronRight,
  Check,
  Activity,
} from 'lucide-react';

export const MyGrowthView: React.FC = () => {
  const { user } = useAuth();

  const [parameters, setParameters] = useState<ParameterGrowth[]>([]);
  const [evidenceHistory, setEvidenceHistory] = useState<GrowthEvidence[]>([]);
  const [testHistory, setTestHistory] = useState<DailyTest[]>([]);
  const [selectedParam, setSelectedParam] = useState<string>('Perseverance');
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        setLoading(true);
        const res = await api.getGrowth();
        setParameters(res.parameters);
        setEvidenceHistory(res.evidenceHistory);
        setTestHistory(res.testHistory);
        if (res.parameters && res.parameters.length > 0) {
          setSelectedParam(res.parameters[0].name);
        }
      } catch (err) {
        console.error('Failed to load growth data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Calculating your human potential growth matrix...</p>
        </div>
      </div>
    );
  }

  // Calculate the overall Main Mean Score across all parameters
  const hasSubmittedAny = parameters.some(p => p.evidenceCount > 0) || testHistory.length > 0 || evidenceHistory.length > 0;
  const meanScore =
    hasSubmittedAny && parameters.length > 0
      ? Math.round(parameters.reduce((acc, curr) => acc + curr.score, 0) / parameters.length)
      : 0;

  // Active parameter details
  const activeParameter = parameters.find(p => p.name === selectedParam) || parameters[0];
  const activeEvidences = evidenceHistory
    .filter(e => e.parameter === selectedParam)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Primary parameters order emphasizing Perseverance, Judgement, Adaptability, Self-Reliance, etc.
  const priorityList = [
    'Perseverance',
    'Judgement',
    'Adaptability',
    'Self-Reliance',
    'Confidence',
    'Fearlessness',
    'Initiative',
    'Responsibility',
    'Critical Thinking',
    'Resourcefulness',
    'Empathy',
    'Cooperation',
    'Harmony',
    'Reflection',
  ];

  const sortedParameters = [...parameters].sort((a, b) => {
    const indexA = priorityList.indexOf(a.name);
    const indexB = priorityList.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return b.score - a.score;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2.5 border border-white/15">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Human Potential Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              My Growth & Evidence Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-light">
              Calculated strictly from observable daily scenario decisions, honest reflection, and unbroken daily practice.
            </p>
          </div>

          {/* Main Mean Score Badge */}
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 block">
              Overall Growth Mean
            </span>
            <div className="text-3xl font-extrabold text-amber-300 font-mono mt-0.5">
              {meanScore}
              <span className="text-sm text-slate-300 font-normal"> / 100</span>
            </div>
            <span className="text-[10px] text-slate-300/80 block mt-0.5">
              Average across {parameters.length} dimensions
            </span>
          </div>
        </div>
      </div>

      {/* Unsubmitted Assessment Banner */}
      {!hasSubmittedAny && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start space-x-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">No Tests or Scenario Challenges Submitted Yet</p>
            <p className="mt-0.5 text-amber-800/90">
              Your growth metrics are set to 0. As you submit daily tests, scenario challenges, and reflections, Gemini AI evaluates your decision evidence and updates parameter scores in real-time.
            </p>
          </div>
        </div>
      )}

      {/* BAR / LINE GRAPH ANALYTICS SECTION (REPLACED PENTAGON STRUCTURE) */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#0c2340]" />
              <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900">
                Development Parameters Distribution
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive score comparison showing Perseverance, Judgement, Adaptability, and key Vivekananda indicators alongside the composite Mean.
            </p>
          </div>

          {/* Toggle View: Bar vs Line */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                chartMode === 'bar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode('line')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                chartMode === 'line'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Line Trend</span>
            </button>
          </div>
        </div>

        {/* Dynamic Visual Graph Canvas */}
        <div className="space-y-3">
          {/* Main Mean Benchmark Indicator */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 bg-amber-500 border-t-2 border-dashed border-amber-500" />
              <span className="font-semibold text-slate-700">Composite Mean Benchmark:</span>
              <span className="font-bold text-slate-900 font-mono">{meanScore} / 100</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Click any bar to inspect underlying evidence records
            </span>
          </div>

          {chartMode === 'bar' ? (
            /* ==========================================
               VERTICAL BARS CHART WITH BENCHMARK
               ========================================== */
            <div className="pt-6 pb-2 overflow-x-auto">
              <div className="min-w-[700px] h-[280px] relative flex items-end justify-between gap-3 px-4 border-b border-slate-200">
                {/* Horizontal Guide Grid Lines */}
                {[100, 75, 50, 25, 0].map(val => (
                  <div
                    key={val}
                    className="absolute left-0 right-0 border-b border-slate-100 flex items-center pointer-events-none"
                    style={{ bottom: `${(val / 100) * 240}px` }}
                  >
                    <span className="text-[10px] font-mono font-semibold text-slate-400 -translate-y-2.5">
                      {val}
                    </span>
                  </div>
                ))}

                {/* Main Mean Dashed Reference Line across chart */}
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500 z-10 pointer-events-none flex items-center justify-end pr-2"
                  style={{ bottom: `${(meanScore / 100) * 240}px` }}
                >
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow-xs -translate-y-3">
                    Mean: {meanScore}
                  </span>
                </div>

                {/* Bars for every score */}
                {sortedParameters.map(p => {
                  const isSelected = selectedParam === p.name;
                  const heightPercent = Math.max(8, Math.min(100, (p.score / 100) * 240));

                  return (
                    <div
                      key={p.name}
                      onClick={() => setSelectedParam(p.name)}
                      className="flex-1 flex flex-col items-center group cursor-pointer relative z-20"
                    >
                      {/* Score Tooltip on Hover / Select */}
                      <div
                        className={`text-[11px] font-mono font-bold mb-1 transition-all ${
                          isSelected
                            ? 'text-[#0c2340] scale-110'
                            : 'text-slate-600 group-hover:text-slate-900'
                        }`}
                      >
                        {p.score}
                      </div>

                      {/* Bar Column */}
                      <div className="w-full max-w-[38px] bg-slate-100 rounded-t-lg h-[240px] flex items-end overflow-hidden p-0.5">
                        <div
                          style={{ height: `${heightPercent}px` }}
                          className={`w-full rounded-t transition-all duration-500 ${
                            isSelected
                              ? 'bg-gradient-to-t from-[#0c2340] to-slate-700 shadow-md ring-2 ring-[#0c2340]'
                              : p.score >= meanScore
                              ? 'bg-[#0c2340] group-hover:bg-slate-700'
                              : 'bg-slate-400 group-hover:bg-slate-600'
                          }`}
                        />
                      </div>

                      {/* Parameter Label */}
                      <div className="mt-2 text-center">
                        <span
                          className={`text-[10px] font-bold block truncate max-w-[55px] ${
                            isSelected
                              ? 'text-[#0c2340] font-extrabold underline'
                              : 'text-slate-600 group-hover:text-slate-900'
                          }`}
                          title={p.name}
                        >
                          {p.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ==========================================
               LINE / CONTINUOUS TREND GRAPH
               ========================================== */
            <div className="pt-6 pb-2 overflow-x-auto">
              <div className="min-w-[700px] h-[280px] relative px-4 border-b border-slate-200">
                {/* Horizontal Grid */}
                {[100, 75, 50, 25, 0].map(val => (
                  <div
                    key={val}
                    className="absolute left-0 right-0 border-b border-slate-100 flex items-center pointer-events-none"
                    style={{ bottom: `${(val / 100) * 220 + 30}px` }}
                  >
                    <span className="text-[10px] font-mono font-semibold text-slate-400 -translate-y-2.5">
                      {val}
                    </span>
                  </div>
                ))}

                {/* SVG Line Graph */}
                <svg className="w-full h-[220px] mt-4 overflow-visible" viewBox="0 0 700 220">
                  {/* Mean Line */}
                  <line
                    x1="0"
                    y1={220 - (meanScore / 100) * 200}
                    x2="700"
                    y2={220 - (meanScore / 100) * 200}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Area Fill */}
                  <path
                    d={`M 0 220 ${sortedParameters
                      .map((p, i) => {
                        const x = (i / (sortedParameters.length - 1)) * 680 + 10;
                        const y = 220 - (p.score / 100) * 200;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')} L 700 220 Z`}
                    fill="rgba(12, 35, 64, 0.08)"
                  />

                  {/* Trend Polyline */}
                  <polyline
                    fill="none"
                    stroke="#0c2340"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sortedParameters
                      .map((p, i) => {
                        const x = (i / (sortedParameters.length - 1)) * 680 + 10;
                        const y = 220 - (p.score / 100) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Data Nodes */}
                  {sortedParameters.map((p, i) => {
                    const x = (i / (sortedParameters.length - 1)) * 680 + 10;
                    const y = 220 - (p.score / 100) * 200;
                    const isSelected = selectedParam === p.name;
                    return (
                      <g key={p.name} className="cursor-pointer" onClick={() => setSelectedParam(p.name)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '7' : '4.5'}
                          fill={isSelected ? '#f59e0b' : '#0c2340'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-transform hover:scale-125"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className={`text-[10px] font-mono font-bold ${
                            isSelected ? 'fill-[#0c2340] font-black' : 'fill-slate-600'
                          }`}
                        >
                          {p.score}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Labels for Line Chart */}
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600 font-semibold">
                  {sortedParameters.map(p => (
                    <span
                      key={p.name}
                      onClick={() => setSelectedParam(p.name)}
                      className={`cursor-pointer truncate max-w-[50px] ${
                        selectedParam === p.name ? 'text-[#0c2340] font-black underline' : 'hover:text-slate-900'
                      }`}
                      title={p.name}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Level Scale Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] text-slate-500 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Development Levels:</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Beginning (0–20)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Developing (21–40)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Growing (41–60)</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Consistent (61–80)</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-bold">Strong Evidence (81+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PARAMETER SELECTION CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-bold text-slate-900 text-sm">
            All Tracked Vivekananda Parameters ({parameters.length})
          </h3>
          <span className="text-xs text-slate-500">Click to view verified evidence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedParameters.map(p => {
            const isSelected = selectedParam === p.name;
            return (
              <div
                key={p.name}
                onClick={() => setSelectedParam(p.name)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0c2340] bg-slate-100/90 shadow-xs ring-1 ring-[#0c2340]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{p.name}</span>
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {p.score} / 100
                    </span>
                  </div>

                  {/* Horizontal mini progress */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#0c2340] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(5, p.score))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {p.level}
                    </span>
                    <div className="flex items-center space-x-0.5">
                      {p.trend === 'up' && (
                        <span className="text-slate-900 flex items-center font-semibold">
                          <ArrowUpRight className="w-3 h-3 text-slate-900" /> Upward
                        </span>
                      )}
                      {p.trend === 'down' && (
                        <span className="text-rose-600 flex items-center font-semibold">
                          <ArrowDownRight className="w-3 h-3 text-rose-600" /> Adjusting
                        </span>
                      )}
                      {p.trend === 'steady' && (
                        <span className="text-slate-400 flex items-center font-semibold">
                          <Minus className="w-3 h-3" /> Steady
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{p.evidenceCount} Stored Evidences</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED EVIDENCE AUDIT FOR SELECTED PARAMETER */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0c2340]" />
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Evidence Audit: {activeParameter?.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Level: <strong>{activeParameter?.level}</strong> ({activeParameter?.score}/100) • Previous: {activeParameter?.previousLevel}
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            {activeEvidences.length} Verifiable Events Recorded
          </span>
        </div>

        {activeEvidences.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No specific evidence recorded yet for this parameter. Complete daily scenario challenges to generate evidence.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeEvidences.map(ev => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{ev.action}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] uppercase font-semibold text-slate-600">
                      {ev.source.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Date: {ev.date}</span>
                    <span>•</span>
                    <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                      ev.delta > 0
                        ? 'bg-slate-100 text-slate-900 border border-slate-300'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ev.delta > 0 ? `+${ev.delta}` : ev.delta} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROGRESSION TIMELINE */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold font-serif text-slate-900">
            Daily Scenario Activity Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Shows completed days and timeline milestones. Stored permanently in Cloud Firestore.
          </p>
        </div>

        {testHistory.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No scenario cycles submitted yet. Today’s scenario challenge will be your first timeline milestone.
          </div>
        ) : (
          <div className="space-y-2.5">
            {testHistory.map((t, idx) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                    Day {testHistory.length - idx}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Completed Scenario Cycle • {t.date}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Status: {t.alignmentRating || 'Completed'} • Demonstrated: {t.strongAreas?.slice(0, 3).join(', ') || t.growthParametersAffected?.join(', ') || 'Self-Reliance'}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold shrink-0">
                  Verified Stored Record ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
