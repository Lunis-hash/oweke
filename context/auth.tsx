import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '@/services/api';
import { registerForPushNotificationsAsync } from '@/services/notifications';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  signIn: (token: string, userId: string, refreshToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let globalSignOut: (() => Promise<void>) | null = null;

export const triggerGlobalSignOut = async () => {
  if (globalSignOut) {
    await globalSignOut();
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger le token au démarrage
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedId = await SecureStore.getItemAsync('userId');
        console.log('🔐 [Auth Context] Loading token from storage...');
        console.log('🔐 [Auth Context] Token found:', storedToken ? 'YES (' + storedToken.substring(0, 20) + '...)' : 'NO');
        console.log('🔐 [Auth Context] UserId found:', storedId ? 'YES (' + storedId + ')' : 'NO');
        
        if (storedToken) {
          setToken(storedToken);
          setUserId(storedId);
          console.log('✅ [Auth Context] Auth state restored');
          
          // Enregistrer le push token de l'appareil
          setTimeout(() => {
            registerForPushNotificationsAsync().catch((err: any) => {
              console.error('❌ [Auth Context] Failed to register push notifications:', err);
            });
          }, 1000);
        } else {
          console.log('⚠️  [Auth Context] No token found - user not authenticated');
        }
      } catch (e) {
        console.error('❌ [Auth Context] Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async (newToken: any, newId: any, newRefreshToken?: any) => {
    const tokenStr = typeof newToken === 'string' ? newToken : (newToken ? String(newToken) : '');
    const idStr = typeof newId === 'string' ? newId : (newId ? (typeof newId === 'object' ? (newId.id ? String(newId.id) : String(newId._id || '')) : String(newId)) : '');

    if (tokenStr) {
      await SecureStore.setItemAsync('userToken', tokenStr);
      setToken(tokenStr);
    }
    if (idStr) {
      await SecureStore.setItemAsync('userId', idStr);
      setUserId(idStr);
    }
    if (newRefreshToken) {
      const refreshStr = typeof newRefreshToken === 'string' ? newRefreshToken : String(newRefreshToken);
      if (refreshStr) {
        await SecureStore.setItemAsync('refreshToken', refreshStr);
      }
    }

    // Enregistrer le push token de l'appareil après la connexion
    setTimeout(() => {
      registerForPushNotificationsAsync().catch((err: any) => {
        console.error('❌ [Auth Context] Failed to register push notifications after signin:', err);
      });
    }, 500);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('userToken').catch(() => {});
    await SecureStore.deleteItemAsync('userId').catch(() => {});
    await SecureStore.deleteItemAsync('refreshToken').catch(() => {});
    setToken(null);
    setUserId(null);
    try {
      const { router } = require('expo-router');
      router.replace('/(auth)/login');
    } catch (e) {
      console.log('⚠️ [Auth Context] Redirection login impossible:', e);
    }
  };

  useEffect(() => {
    globalSignOut = signOut;
    return () => {
      globalSignOut = null;
    };
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ token, userId, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
