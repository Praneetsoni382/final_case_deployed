import {
  User,
  StudentProfile,
  ParameterGrowth,
  GrowthEvidence,
  DailyTest,
  Reflection,
  StreakInfo,
  Reward,
  StorageItem,
  Message,
  NotificationItem,
  TeacherObservation
} from '../types/index.ts';

const TOKEN_KEY = 'manmaker_auth_token';
const CACHE_PREFIX = 'manav_local_db_';

// Client-side local indexed storage cache for zero-latency retrieval and caching
export const localClientDb = {
  get<T>(key: string, maxAgeMs: number = 60 * 1000): T | null {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > maxAgeMs) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return parsed.data as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch {
      // quota or private mode fallback
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch {}
  },

  clearAll(): void {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  },
};

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localClientDb.clearAll();
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg) as any;
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data as T;
  },

  // Auth
  async register(payload: {
    role: 'student' | 'teacher';
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    age?: number;
  }) {
    return this.request<{
      message: string;
      email: string;
      role: string;
      verificationLinkPreview?: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async verifyEmail(token: string) {
    const data = await this.request<{
      message: string;
      token: string;
      user: User;
      onboardingCompleted: boolean;
    }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    localClientDb.set('session', { user: data.user, onboardingCompleted: data.onboardingCompleted });
    return data;
  },

  async resendVerification(email: string) {
    return this.request<{ message: string; verificationLinkPreview?: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async login(payload: { email: string; password: string }) {
    const data = await this.request<{
      message: string;
      token: string;
      user: User;
      onboardingCompleted: boolean;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    localClientDb.set('session', { user: data.user, onboardingCompleted: data.onboardingCompleted });
    return data;
  },

  async forgotPassword(email: string) {
    return this.request<{ message: string; resetLinkPreview?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(payload: { token: string; newPassword: string; confirmPassword?: string }) {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout() {
    try {
      await this.request<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
      localClientDb.clearAll();
    }
  },

  async getMe() {
    // Check local client storage cache first for instant render
    const cached = localClientDb.get<{ user: User; onboardingCompleted: boolean }>('session', 2 * 60 * 1000);
    if (cached) {
      return cached;
    }
    const data = await this.request<{ user: User; onboardingCompleted: boolean }>('/api/auth/me');
    localClientDb.set('session', data);
    return data;
  },

  // Student Profile
  async getStudentProfile() {
    return this.request<{ profile: StudentProfile | null }>('/api/student/profile');
  },

  async saveStudentProfile(payload: { developmentGoals: string[]; struggles: string[] }) {
    return this.request<{ message: string; profile: StudentProfile }>('/api/student/profile', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Daily Test
  async getTodayTest() {
    return this.request<{ test: DailyTest; reflectionSubmitted: boolean }>('/api/student/daily-test/today');
  },

  async submitTest(payload: {
    testId: string;
    answers: Array<{ questionId: string; selectedOptionId: string; writtenResponse?: string }>;
  }) {
    return this.request<{ message: string; test: DailyTest; requiresReflection: boolean }>('/api/student/daily-test/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Reflections
  async submitReflection(payload: {
    testId: string;
    mainReflection: string;
    whatLearned?: string;
    improveTomorrow?: string;
    thoughtProvokingAnswer?: string;
    relatedDevelopmentAreas?: string[];
  }) {
    return this.request<{ message: string; reflection: Reflection; streak: StreakInfo; milestoneReached: boolean }>(
      '/api/student/reflection',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async getReflections() {
    return this.request<{ reflections: Reflection[] }>('/api/student/reflections');
  },

  async getReflection(id: string) {
    return this.request<{ reflection: Reflection }>(`/api/student/reflections/${id}`);
  },

  // Growth & Streaks
  async getGrowth(studentId?: string) {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    return this.request<{
      parameters: ParameterGrowth[];
      evidenceHistory: GrowthEvidence[];
      testHistory: DailyTest[];
    }>(`/api/student/growth${query}`);
  },

  async getStreak() {
    return this.request<{ streak: StreakInfo }>('/api/student/streak');
  },

  // Rewards & Storage
  async sendReward(formData: FormData) {
    return this.request<{ message: string; reward: Reward }>('/api/teacher/rewards', {
      method: 'POST',
      body: formData,
    });
  },

  async getMyRewards() {
    return this.request<{ rewards: Reward[] }>('/api/rewards/my-rewards');
  },

  async getTeacherRewardHistory() {
    return this.request<{ rewards: Reward[] }>('/api/rewards/teacher-history');
  },

  async getMyStorage() {
    return this.request<{ items: StorageItem[] }>('/api/storage/my-storage');
  },

  async uploadStorageFile(formData: FormData) {
    return this.request<{ message: string; item: StorageItem }>('/api/storage/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteStorageItem(id: string) {
    return this.request<{ message: string }>(`/api/storage/${id}`, {
      method: 'DELETE',
    });
  },

  // Messages
  async getMessages(partnerId: string) {
    return this.request<{ messages: Message[] }>(`/api/messages/thread/${partnerId}`);
  },

  async sendMessage(receiverId: string, text: string) {
    return this.request<{ message: Message }>('/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiverId, text }),
    });
  },

  async getUnreadMessageCount() {
    return this.request<{ unreadCount: number }>('/api/messages/unread-count');
  },

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: NotificationItem[] }>('/api/notifications');
  },

  async markNotificationRead(id?: string) {
    return this.request<{ success: boolean }>('/api/notifications/mark-read', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  // Teacher Endpoints
  async getTeachers() {
    return this.request<{ teachers: User[] }>('/api/teachers');
  },

  async getTeacherStudents() {
    return this.request<{
      students: Array<
        User & {
          developmentGoals: string[];
          struggles: string[];
          currentStreak: number;
          todayTestCompleted: boolean;
          latestReflectionDate: string | null;
          parameters: ParameterGrowth[];
        }
      >;
    }>('/api/teacher/students');
  },

  async pairStudent(studentCodeOrEmail: string) {
    return this.request<{ message: string; student: Partial<User> }>('/api/teacher/pair-student', {
      method: 'POST',
      body: JSON.stringify({ studentCodeOrEmail }),
    });
  },

  async getStudentDetail(studentId: string) {
    return this.request<{
      student: User;
      profile: StudentProfile | null;
      streak: StreakInfo;
      parameters: ParameterGrowth[];
      evidenceHistory: GrowthEvidence[];
      testHistory: DailyTest[];
      reflections: Reflection[];
      rewards: Reward[];
      observations: TeacherObservation[];
    }>(`/api/teacher/student/${studentId}`);
  },

  async addObservation(studentId: string, note: string) {
    return this.request<{ message: string; observation: TeacherObservation }>('/api/teacher/observations', {
      method: 'POST',
      body: JSON.stringify({ studentId, note }),
    });
  },

  // ==========================================
  // SCENARIO CHALLENGES & ATTEMPTS
  // ==========================================

  async getChallenges() {
    return this.request<{ challenges: any[] }>('/api/challenges');
  },

  async getChallenge(id: string) {
    return this.request<{ challenge: any }>(`/api/challenges/${id}`);
  },

  async createAttempt(payload: {
    challengeId: string;
    selectedOption?: string;
    optionalReasoning?: string;
    hintsUsed?: number;
    hintIdsUsed?: string[];
  }) {
    return this.request<{ attempt: any }>('/api/attempts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAttempt(id: string) {
    return this.request<{ attempt: any }>(`/api/attempts/${id}`);
  },

  async updateAttempt(id: string, updates: Record<string, any>) {
    return this.request<{ attempt: any }>(`/api/attempts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async submitAttempt(id: string, payload?: Record<string, any>) {
    return this.request<{ attempt: any }>(`/api/attempts/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  async submitChallengeReflection(payload: {
    attemptId: string;
    challengeId?: string;
    difficulty?: string;
    changedApproach?: boolean;
    whatChanged?: string;
    whatLearned?: string;
  }) {
    return this.request<{ reflection: any }>('/api/reflections', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async recordEvaluation(payload: {
    attemptId: string;
    studentId: string;
    challengeId?: string;
    criteriaResults?: any[];
    strengths?: string[];
    growthAreas?: string[];
    feedback?: string;
  }) {
    return this.request<{ evaluation: any }>('/api/evaluations/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getStudentGrowthRecords(studentId: string) {
    return this.request<{ growthRecords: any[]; parameters: any[] }>(`/api/students/${studentId}/growth`);
  },

  async checkHealth() {
    return this.request<{ status: string; database: string }>('/api/health');
  },
};

