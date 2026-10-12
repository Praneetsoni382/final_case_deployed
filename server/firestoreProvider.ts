import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firestore } from './firebase.ts';
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
  TeacherObservation,
  MainGrowthParameter,
  GrowthLevel,
  Challenge,
  Attempt,
  ChallengeReflection,
  Evaluation,
  GrowthRecord,
} from '../src/types/index.ts';

export function calculateLevel(score: number): GrowthLevel {
  if (score >= 85) return 'Strong Evidence';
  if (score >= 65) return 'Consistent';
  if (score >= 45) return 'Growing';
  if (score >= 25) return 'Developing';
  return 'Beginning';
}

export type DbUser = User & {
  passwordHash: string;
  verificationOtp?: string | null;
  otpExpiresAt?: number | null;
  updatedAt?: string;
};

// Strips out undefined values recursively so Firestore never throws unsupported field value error
function cleanData<T>(obj: T): T {
  if (obj === null || obj === undefined) return null as any;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanData(item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanData(value);
      }
    }
    return cleaned;
  }
  return obj;
}

// In-memory local cache database to eliminate redundant Firestore queries and accelerate responses
const serverCache = new Map<string, { data: any; expiresAt: number }>();

function getFromCache<T>(key: string): T | null {
  const item = serverCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    serverCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setInCache<T>(key: string, data: T, ttlMs: number = 60 * 1000): void {
  serverCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function invalidateServerCache(prefix?: string): void {
  if (!prefix) {
    serverCache.clear();
    return;
  }
  for (const k of serverCache.keys()) {
    if (k.startsWith(prefix)) {
      serverCache.delete(k);
    }
  }
}

export const firestoreProvider = {
  // 1. Users Collection (/users)
  users: {
    async findById(id: string): Promise<DbUser | null> {
      const cacheKey = `user_id_${id}`;
      const cached = getFromCache<DbUser>(cacheKey);
      if (cached) return cached;

      try {
        const docRef = doc(firestore, 'users', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        const user = snapshot.data() as DbUser;
        setInCache(cacheKey, user, 60 * 1000); // 60s cache
        return user;
      } catch (err) {
        console.error(`Error fetching user ${id} from Firestore:`, err);
        return null;
      }
    },

    async findByEmail(email: string): Promise<DbUser | null> {
      const cleanEmail = email.toLowerCase().trim();
      const cacheKey = `user_email_${cleanEmail}`;
      const cached = getFromCache<DbUser>(cacheKey);
      if (cached) return cached;

      try {
        const q = query(
          collection(firestore, 'users'),
          where('email', '==', cleanEmail),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const user = snapshot.docs[0].data() as DbUser;
        setInCache(cacheKey, user, 60 * 1000); // 60s cache
        return user;
      } catch (err) {
        console.error(`Error querying user by email ${email}:`, err);
        return null;
      }
    },

    async findByPairingCode(code: string): Promise<DbUser | null> {
      try {
        const cleanCode = code.toUpperCase().trim();
        const q = query(
          collection(firestore, 'users'),
          where('pairingCode', '==', cleanCode),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as DbUser;
      } catch (err) {
        console.error(`Error querying user by pairing code ${code}:`, err);
        return null;
      }
    },

    async findByVerificationToken(token: string): Promise<DbUser | null> {
      try {
        if (!token) return null;
        const q = query(
          collection(firestore, 'users'),
          where('verificationToken', '==', token),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as DbUser;
      } catch (err) {
        console.error(`Error querying user by verificationToken:`, err);
        return null;
      }
    },

    async findByResetToken(token: string): Promise<DbUser | null> {
      try {
        if (!token) return null;
        const q = query(
          collection(firestore, 'users'),
          where('resetToken', '==', token),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as DbUser;
      } catch (err) {
        console.error(`Error querying user by resetToken:`, err);
        return null;
      }
    },

    async create(user: DbUser): Promise<DbUser> {
      const now = new Date().toISOString();
      const payload: DbUser = cleanData({
        ...user,
        email: user.email.toLowerCase().trim(),
        createdAt: user.createdAt || now,
        updatedAt: now,
      });

      const docRef = doc(firestore, 'users', user.id);
      await setDoc(docRef, payload);

      // Also create document in /students or /teachers
      if (user.role === 'student') {
        const studentRef = doc(firestore, 'students', user.id);
        await setDoc(
          studentRef,
          cleanData({
            id: user.id,
            userId: user.id,
            name: user.fullName,
            email: user.email,
            role: 'student',
            pairingCode: user.pairingCode,
            teacherId: user.teacherId || null,
            age: user.age || null,
            createdAt: payload.createdAt,
            updatedAt: now,
          })
        );
      } else if (user.role === 'teacher') {
        const teacherRef = doc(firestore, 'teachers', user.id);
        await setDoc(
          teacherRef,
          cleanData({
            id: user.id,
            userId: user.id,
            name: user.fullName,
            email: user.email,
            role: 'teacher',
            createdAt: payload.createdAt,
            updatedAt: now,
          })
        );
      }

        invalidateServerCache('user_');
        invalidateServerCache('students_');
        invalidateServerCache('teachers_');
        return payload;
    },

    async update(id: string, updates: Partial<DbUser>): Promise<DbUser | null> {
      try {
        const docRef = doc(firestore, 'users', id);
        const now = new Date().toISOString();
        const cleanUpdates = cleanData({ ...updates, updatedAt: now });
        await updateDoc(docRef, cleanUpdates);

        invalidateServerCache(`user_id_${id}`);
        invalidateServerCache('user_email_');
        invalidateServerCache('students_');
        invalidateServerCache('teachers_');

        const updated = await this.findById(id);
        return updated;
      } catch (err) {
        console.error(`Error updating user ${id}:`, err);
        return null;
      }
    },

    async listStudentsForTeacher(teacherId: string): Promise<User[]> {
      try {
        const q = query(
          collection(firestore, 'users'),
          where('role', '==', 'student')
        );
        const snapshot = await getDocs(q);
        const students: User[] = [];
        snapshot.forEach(docSnap => {
          const u = docSnap.data() as DbUser;
          if (u.teacherId === teacherId || !u.teacherId) {
            students.push({
              id: u.id,
              role: u.role,
              fullName: u.fullName,
              email: u.email,
              age: u.age,
              isVerified: u.isVerified,
              pairingCode: u.pairingCode,
              teacherId: u.teacherId,
              createdAt: u.createdAt,
            });
          }
        });
        return students;
      } catch (err) {
        console.error(`Error listing students for teacher ${teacherId}:`, err);
        return [];
      }
    },

    async assignStudentToTeacher(studentId: string, teacherId: string): Promise<User | null> {
      try {
        const userRef = doc(firestore, 'users', studentId);
        const studentRef = doc(firestore, 'students', studentId);
        const now = new Date().toISOString();

        await updateDoc(userRef, { teacherId, updatedAt: now });
        try {
          await updateDoc(studentRef, { teacherId, updatedAt: now });
        } catch {
          // student doc might not exist yet
        }

        const updated = await this.findById(studentId);
        return updated;
      } catch (err) {
        console.error(`Error assigning student ${studentId} to teacher ${teacherId}:`, err);
        return null;
      }
    },

    async listTeachers(): Promise<User[]> {
      try {
        const q = query(
          collection(firestore, 'users'),
          where('role', '==', 'teacher')
        );
        const snapshot = await getDocs(q);
        const teachers: User[] = [];
        snapshot.forEach(docSnap => {
          const u = docSnap.data() as DbUser;
          teachers.push({
            id: u.id,
            role: u.role,
            fullName: u.fullName,
            email: u.email,
            age: u.age,
            isVerified: u.isVerified,
            pairingCode: u.pairingCode,
            teacherId: u.teacherId,
            createdAt: u.createdAt,
          });
        });
        return teachers;
      } catch (err) {
        console.error(`Error listing teachers:`, err);
        return [];
      }
    },
  },

  // 2. Student Profiles (/students)
  profiles: {
    async getByUserId(userId: string): Promise<StudentProfile | null> {
      const cacheKey = `profile_${userId}`;
      const cached = getFromCache<StudentProfile>(cacheKey);
      if (cached) return cached;

      try {
        const docRef = doc(firestore, 'studentProfiles', userId);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        const profile = snapshot.data() as StudentProfile;
        setInCache(cacheKey, profile, 60 * 1000);
        return profile;
      } catch (err) {
        console.error(`Error getting student profile for ${userId}:`, err);
        return null;
      }
    },

    async upsert(profile: StudentProfile): Promise<StudentProfile> {
      const docRef = doc(firestore, 'studentProfiles', profile.userId);
      const now = new Date().toISOString();
      const payload: StudentProfile = cleanData({
        ...profile,
        updatedAt: now,
      });
      await setDoc(docRef, payload, { merge: true });
      invalidateServerCache(`profile_${profile.userId}`);
      return payload;
    },
  },

  // 3. Challenges Collection (/challenges)
  challenges: {
    async listActive(): Promise<Challenge[]> {
      const cacheKey = 'challenges_active';
      const cached = getFromCache<Challenge[]>(cacheKey);
      if (cached) return cached;

      try {
        const q = query(
          collection(firestore, 'challenges'),
          where('active', '==', true)
        );
        const snapshot = await getDocs(q);
        const list: Challenge[] = [];
        snapshot.forEach(d => list.push(d.data() as Challenge));
        setInCache(cacheKey, list, 120 * 1000);
        return list;
      } catch (err) {
        console.error('Error listing challenges:', err);
        return [];
      }
    },

    async getById(id: string): Promise<Challenge | null> {
      try {
        const docRef = doc(firestore, 'challenges', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as Challenge;
      } catch (err) {
        console.error(`Error fetching challenge ${id}:`, err);
        return null;
      }
    },

    async create(challenge: Challenge): Promise<Challenge> {
      const now = new Date().toISOString();
      const payload: Challenge = cleanData({
        ...challenge,
        active: challenge.active !== undefined ? challenge.active : true,
        createdAt: challenge.createdAt || now,
        updatedAt: now,
      });
      const docRef = doc(firestore, 'challenges', challenge.id);
      await setDoc(docRef, payload);
      return payload;
    },

    async update(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
      try {
        const docRef = doc(firestore, 'challenges', id);
        const now = new Date().toISOString();
        await updateDoc(docRef, cleanData({ ...updates, updatedAt: now }));
        return await this.getById(id);
      } catch (err) {
        console.error(`Error updating challenge ${id}:`, err);
        return null;
      }
    },
  },

  // 4. Attempts Collection (/attempts)
  attempts: {
    async getById(id: string): Promise<Attempt | null> {
      try {
        const docRef = doc(firestore, 'attempts', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as Attempt;
      } catch (err) {
        console.error(`Error getting attempt ${id}:`, err);
        return null;
      }
    },

    async listForStudent(studentId: string): Promise<Attempt[]> {
      try {
        const q = query(
          collection(firestore, 'attempts'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        const list: Attempt[] = [];
        snapshot.forEach(d => list.push(d.data() as Attempt));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing attempts for student ${studentId}:`, err);
        return [];
      }
    },

    async listForChallenge(challengeId: string): Promise<Attempt[]> {
      try {
        const q = query(
          collection(firestore, 'attempts'),
          where('challengeId', '==', challengeId)
        );
        const snapshot = await getDocs(q);
        const list: Attempt[] = [];
        snapshot.forEach(d => list.push(d.data() as Attempt));
        return list;
      } catch (err) {
        console.error(`Error listing attempts for challenge ${challengeId}:`, err);
        return [];
      }
    },

    async create(attempt: Attempt): Promise<Attempt> {
      const now = new Date().toISOString();
      const payload: Attempt = cleanData({
        ...attempt,
        createdAt: attempt.createdAt || now,
        updatedAt: now,
      });
      const docRef = doc(firestore, 'attempts', attempt.id);
      await setDoc(docRef, payload);
      return payload;
    },

    async update(id: string, updates: Partial<Attempt>): Promise<Attempt | null> {
      try {
        const docRef = doc(firestore, 'attempts', id);
        const now = new Date().toISOString();
        await updateDoc(docRef, cleanData({ ...updates, updatedAt: now }));
        return await this.getById(id);
      } catch (err) {
        console.error(`Error updating attempt ${id}:`, err);
        return null;
      }
    },
  },

  // 5. Daily Tests (Bridge model for daily tests)
  tests: {
    async getByUserAndDate(userId: string, date: string): Promise<DailyTest | null> {
      try {
        const q = query(
          collection(firestore, 'dailyTests'),
          where('userId', '==', userId),
          where('date', '==', date),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as DailyTest;
      } catch (err) {
        console.error(`Error getting daily test for ${userId} on ${date}:`, err);
        return null;
      }
    },

    async getById(testId: string): Promise<DailyTest | null> {
      try {
        const docRef = doc(firestore, 'dailyTests', testId);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as DailyTest;
      } catch (err) {
        console.error(`Error getting test ${testId}:`, err);
        return null;
      }
    },

    async listForUser(userId: string): Promise<DailyTest[]> {
      try {
        const q = query(
          collection(firestore, 'dailyTests'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const list: DailyTest[] = [];
        snapshot.forEach(d => list.push(d.data() as DailyTest));
        return list.sort((a, b) => b.date.localeCompare(a.date));
      } catch (err) {
        console.error(`Error listing tests for ${userId}:`, err);
        return [];
      }
    },

    async create(test: DailyTest): Promise<DailyTest> {
      const docRef = doc(firestore, 'dailyTests', test.id);
      await setDoc(docRef, cleanData(test));
      return test;
    },

    async update(testId: string, updates: Partial<DailyTest>): Promise<DailyTest | null> {
      try {
        const docRef = doc(firestore, 'dailyTests', testId);
        await updateDoc(docRef, cleanData(updates));
        return await this.getById(testId);
      } catch (err) {
        console.error(`Error updating test ${testId}:`, err);
        return null;
      }
    },
  },

  // 6. Reflections Collection (/reflections)
  reflections: {
    async getByTestId(testId: string): Promise<Reflection | null> {
      try {
        const q = query(
          collection(firestore, 'reflections'),
          where('testId', '==', testId),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as Reflection;
      } catch (err) {
        console.error(`Error getting reflection for test ${testId}:`, err);
        return null;
      }
    },

    async getByAttemptId(attemptId: string): Promise<Reflection | null> {
      try {
        const q = query(
          collection(firestore, 'reflections'),
          where('testId', '==', attemptId),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as Reflection;
      } catch (err) {
        console.error(`Error getting reflection for attempt ${attemptId}:`, err);
        return null;
      }
    },

    async getById(id: string): Promise<Reflection | null> {
      try {
        const docRef = doc(firestore, 'reflections', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as Reflection;
      } catch (err) {
        console.error(`Error getting reflection ${id}:`, err);
        return null;
      }
    },

    async listForUser(userId: string): Promise<Reflection[]> {
      try {
        const q = query(
          collection(firestore, 'reflections'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const list: Reflection[] = [];
        snapshot.forEach(d => list.push(d.data() as Reflection));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing reflections for ${userId}:`, err);
        return [];
      }
    },

    async create(ref: Reflection): Promise<Reflection> {
      const docRef = doc(firestore, 'reflections', ref.id);
      await setDoc(docRef, cleanData(ref));
      return ref;
    },
  },

  // 7. Evaluations Collection (/evaluations)
  evaluations: {
    async getById(id: string): Promise<Evaluation | null> {
      try {
        const docRef = doc(firestore, 'evaluations', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as Evaluation;
      } catch (err) {
        console.error(`Error getting evaluation ${id}:`, err);
        return null;
      }
    },

    async getByAttemptId(attemptId: string): Promise<Evaluation | null> {
      try {
        const q = query(
          collection(firestore, 'evaluations'),
          where('attemptId', '==', attemptId),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as Evaluation;
      } catch (err) {
        console.error(`Error getting evaluation for attempt ${attemptId}:`, err);
        return null;
      }
    },

    async listForStudent(studentId: string): Promise<Evaluation[]> {
      try {
        const q = query(
          collection(firestore, 'evaluations'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        const list: Evaluation[] = [];
        snapshot.forEach(d => list.push(d.data() as Evaluation));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing evaluations for ${studentId}:`, err);
        return [];
      }
    },

    async create(evalDoc: Evaluation): Promise<Evaluation> {
      const now = new Date().toISOString();
      const payload: Evaluation = cleanData({
        ...evalDoc,
        createdAt: evalDoc.createdAt || now,
        updatedAt: now,
      });
      const docRef = doc(firestore, 'evaluations', evalDoc.id);
      await setDoc(docRef, payload);
      return payload;
    },
  },

  // 8. Growth Evidence & Records (/growthRecords & /growthEvidence)
  growthRecords: {
    async add(record: GrowthRecord): Promise<GrowthRecord> {
      const docRef = doc(firestore, 'growthRecords', record.id);
      await setDoc(docRef, cleanData(record));
      return record;
    },

    async listForStudent(studentId: string): Promise<GrowthRecord[]> {
      try {
        const q = query(
          collection(firestore, 'growthRecords'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        const list: GrowthRecord[] = [];
        snapshot.forEach(d => list.push(d.data() as GrowthRecord));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing growth records for ${studentId}:`, err);
        return [];
      }
    },
  },

  evidence: {
    async add(ev: GrowthEvidence): Promise<GrowthEvidence> {
      const docRef = doc(firestore, 'growthEvidence', ev.id);
      await setDoc(docRef, cleanData(ev));
      return ev;
    },

    async listForUser(userId: string): Promise<GrowthEvidence[]> {
      try {
        const q = query(
          collection(firestore, 'growthEvidence'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const list: GrowthEvidence[] = [];
        snapshot.forEach(d => list.push(d.data() as GrowthEvidence));
        return list;
      } catch (err) {
        console.error(`Error listing growth evidence for ${userId}:`, err);
        return [];
      }
    },

    async calculateParameters(userId: string): Promise<ParameterGrowth[]> {
      const userEvidences = await this.listForUser(userId);
      const params: MainGrowthParameter[] = [
        'Self-Reliance',
        'Confidence',
        'Fearlessness',
        'Initiative',
        'Perseverance',
        'Critical Thinking',
        'Judgement',
        'Responsibility',
        'Adaptability',
        'Resourcefulness',
        'Empathy',
        'Cooperation',
        'Harmony',
        'Reflection',
        'Concentration',
      ];

      return params.map(paramName => {
        const evs = userEvidences.filter(e => e.parameter === paramName);
        let calculated = 0;
        evs.forEach(e => {
          calculated += e.delta;
        });

        const score = Math.max(0, Math.min(100, Math.round(calculated)));
        const level = calculateLevel(score);

        let prevScore = 0;
        if (evs.length > 1) {
          evs.slice(0, -1).forEach(e => {
            prevScore += e.delta;
          });
        }
        const previousLevel = calculateLevel(
          Math.max(0, Math.min(100, Math.round(prevScore)))
        );

        let trend: 'up' | 'down' | 'steady' = 'steady';
        if (score > prevScore) trend = 'up';
        else if (score < prevScore) trend = 'down';

        return {
          name: paramName,
          score,
          level,
          previousLevel,
          trend,
          evidenceCount: evs.length,
          recentEvidences: evs.slice(-6).reverse(),
        };
      });
    },
  },

  // 9. Streaks Collection (/streaks)
  streaks: {
    async getForUser(userId: string): Promise<StreakInfo> {
      try {
        const docRef = doc(firestore, 'streaks', userId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return snapshot.data() as StreakInfo;
        }

        const fresh: StreakInfo = {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          history: [],
        };
        await setDoc(docRef, cleanData(fresh));
        return fresh;
      } catch (err) {
        console.error(`Error getting streak for ${userId}:`, err);
        return {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
          history: [],
        };
      }
    },

    async recordCompletion(
      userId: string,
      date: string
    ): Promise<{ streak: StreakInfo; milestoneReached: boolean }> {
      const streak = await this.getForUser(userId);
      const today = new Date(date);

      if (streak.lastCompletedDate === date) {
        return { streak, milestoneReached: false };
      }

      let isConsecutive = false;
      if (streak.lastCompletedDate) {
        const lastDate = new Date(streak.lastCompletedDate);
        const diffMs = today.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 3600 * 24));
        if (diffDays === 1) {
          isConsecutive = true;
        }
      }

      if (isConsecutive || streak.currentStreak === 0) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }

      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      streak.lastCompletedDate = date;
      streak.history.push({ date, completed: true });

      const milestoneReached =
        streak.currentStreak === 7 ||
        (streak.currentStreak > 0 && streak.currentStreak % 7 === 0);

      const docRef = doc(firestore, 'streaks', userId);
      await setDoc(docRef, cleanData(streak));

      return { streak, milestoneReached };
    },
  },

  // 10. Rewards Collection (/rewards)
  rewards: {
    async create(reward: Reward): Promise<Reward> {
      const docRef = doc(firestore, 'rewards', reward.id);
      await setDoc(docRef, cleanData(reward));
      return reward;
    },

    async listForStudent(studentId: string): Promise<Reward[]> {
      try {
        const q = query(
          collection(firestore, 'rewards'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        const list: Reward[] = [];
        snapshot.forEach(d => list.push(d.data() as Reward));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing rewards for student ${studentId}:`, err);
        return [];
      }
    },

    async listForTeacher(teacherId: string): Promise<Reward[]> {
      try {
        const q = query(
          collection(firestore, 'rewards'),
          where('teacherId', '==', teacherId)
        );
        const snapshot = await getDocs(q);
        const list: Reward[] = [];
        snapshot.forEach(d => list.push(d.data() as Reward));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing rewards for teacher ${teacherId}:`, err);
        return [];
      }
    },
  },

  // 11. Storage Items Collection (/storageItems)
  storage: {
    async create(item: StorageItem): Promise<StorageItem> {
      const docRef = doc(firestore, 'storageItems', item.id);
      await setDoc(docRef, cleanData(item));
      return item;
    },

    async findById(id: string): Promise<StorageItem | null> {
      try {
        const docRef = doc(firestore, 'storageItems', id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return snapshot.data() as StorageItem;
      } catch (err) {
        console.error(`Error finding storage item ${id}:`, err);
        return null;
      }
    },

    async listForUser(userId: string): Promise<StorageItem[]> {
      try {
        const user = await firestoreProvider.users.findById(userId);
        const snapshot = await getDocs(collection(firestore, 'storageItems'));
        const allItems: StorageItem[] = [];
        snapshot.forEach(d => allItems.push(d.data() as StorageItem));

        if (user && user.role === 'teacher') {
          return allItems
            .filter(s => s.userId === userId || s.senderName === user.fullName)
            .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        }

        return allItems
          .filter(s => {
            if (s.userId === userId) return true;
            if (
              user?.teacherId &&
              s.sharedWithCohort &&
              s.userId === user.teacherId
            )
              return true;
            return false;
          })
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing storage items for ${userId}:`, err);
        return [];
      }
    },

    async delete(id: string, userId: string): Promise<boolean> {
      try {
        const item = await this.findById(id);
        if (!item || item.userId !== userId) return false;

        const docRef = doc(firestore, 'storageItems', id);
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        console.error(`Error deleting storage item ${id}:`, err);
        return false;
      }
    },
  },

  // 12. Messages Collection (/messages)
  messages: {
    async create(msg: Message): Promise<Message> {
      const docRef = doc(firestore, 'messages', msg.id);
      await setDoc(docRef, cleanData(msg));
      return msg;
    },

    async getConversation(user1: string, user2: string): Promise<Message[]> {
      try {
        const snapshot = await getDocs(collection(firestore, 'messages'));
        const list: Message[] = [];
        snapshot.forEach(d => {
          const m = d.data() as Message;
          if (
            (m.senderId === user1 && m.receiverId === user2) ||
            (m.senderId === user2 && m.receiverId === user1)
          ) {
            list.push(m);
          }
        });
        return list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      } catch (err) {
        console.error(`Error fetching conversation between ${user1} and ${user2}:`, err);
        return [];
      }
    },

    async markRead(userReceiverId: string, senderId: string): Promise<void> {
      try {
        const q = query(
          collection(firestore, 'messages'),
          where('receiverId', '==', userReceiverId),
          where('senderId', '==', senderId),
          where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        const promises = snapshot.docs.map(docSnap =>
          updateDoc(docSnap.ref, { read: true })
        );
        await Promise.all(promises);
      } catch (err) {
        console.error(`Error marking messages as read:`, err);
      }
    },

    async getUnreadCount(userId: string): Promise<number> {
      try {
        const q = query(
          collection(firestore, 'messages'),
          where('receiverId', '==', userId),
          where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (err) {
        console.error(`Error getting unread message count for ${userId}:`, err);
        return 0;
      }
    },
  },

  // 13. Notifications Collection (/notifications)
  notifications: {
    async create(notif: NotificationItem): Promise<NotificationItem> {
      const docRef = doc(firestore, 'notifications', notif.id);
      await setDoc(docRef, cleanData(notif));
      return notif;
    },

    async listForUser(userId: string): Promise<NotificationItem[]> {
      try {
        const q = query(
          collection(firestore, 'notifications'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        const list: NotificationItem[] = [];
        snapshot.forEach(d => list.push(d.data() as NotificationItem));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing notifications for ${userId}:`, err);
        return [];
      }
    },

    async markRead(userId: string, notifId?: string): Promise<void> {
      try {
        if (notifId) {
          const docRef = doc(firestore, 'notifications', notifId);
          await updateDoc(docRef, { read: true });
        } else {
          const q = query(
            collection(firestore, 'notifications'),
            where('userId', '==', userId),
            where('read', '==', false)
          );
          const snapshot = await getDocs(q);
          const promises = snapshot.docs.map(docSnap =>
            updateDoc(docSnap.ref, { read: true })
          );
          await Promise.all(promises);
        }
      } catch (err) {
        console.error(`Error marking notifications as read:`, err);
      }
    },

    async getUnreadCount(userId: string): Promise<number> {
      try {
        const q = query(
          collection(firestore, 'notifications'),
          where('userId', '==', userId),
          where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
      } catch (err) {
        console.error(`Error getting unread notifications count for ${userId}:`, err);
        return 0;
      }
    },
  },

  // 14. Teacher Observations Collection (/teacherObservations)
  observations: {
    async create(obs: TeacherObservation): Promise<TeacherObservation> {
      const docRef = doc(firestore, 'teacherObservations', obs.id);
      await setDoc(docRef, cleanData(obs));
      return obs;
    },

    async listForStudent(studentId: string): Promise<TeacherObservation[]> {
      try {
        const q = query(
          collection(firestore, 'teacherObservations'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        const list: TeacherObservation[] = [];
        snapshot.forEach(d => list.push(d.data() as TeacherObservation));
        return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch (err) {
        console.error(`Error listing teacher observations for ${studentId}:`, err);
        return [];
      }
    },
  },
};

export const db = firestoreProvider;
