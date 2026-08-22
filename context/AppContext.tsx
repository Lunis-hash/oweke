import React, { createContext, useContext, useState, useCallback } from 'react';
import client from '@/services/api';
import cacheService from '@/services/cacheService';

interface AppContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  activeJourneyId: string | null;
  setActiveJourneyId: (id: string | null) => void;
  userState: any;
  setUserState: (state: any) => void;
  credits: number;
  spendCredit: (...args: any[]) => boolean;
  addCredits: (...args: any[]) => void;
  matches: any[];
  addMatch: (...args: any[]) => void;
  loadMatches: (forceRefresh?: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [userState, setUserState] = useState<any>(null);
  const [credits, setCredits] = useState(10);
  const [matches, setMatches] = useState<any[]>([]);

  const spendCredit = () => {
    if (credits <= 0) return false;
    setCredits((prev) => prev - 1);
    return true;
  };

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const addMatch = (match: any) => {
    setMatches((prev) => [...prev, match]);
  };

  const loadMatches = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'user_my_matches';
    if (!forceRefresh) {
      const cached = cacheService.get<any[]>(cacheKey, 20000); // 20s cache TTL
      if (cached) {
        setMatches(cached);
        return;
      }
    }

    try {
      const res = await client.get('/matching/my-matches');
      const data = res.data ?? [];
      setMatches(data);
      cacheService.set(cacheKey, data);
    } catch (e) {
      console.log('⚠️ [AppContext] Impossible de charger les matchs:', e);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        activeJourneyId,
        setActiveJourneyId,
        userState,
        setUserState,
        credits,
        spendCredit,
        addCredits,
        matches,
        addMatch,
        loadMatches,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    return {
      unreadCount: 0,
      setUnreadCount: () => {},
      activeJourneyId: null,
      setActiveJourneyId: () => {},
      userState: null,
      setUserState: () => {},
      credits: 10,
      spendCredit: () => true,
      addCredits: () => {},
      matches: [],
      addMatch: () => {},
      loadMatches: async () => {},
    };
  }
  return context;
};

export default AppContext;
