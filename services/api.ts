import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API URL : Backend distant Render par défaut (ou variable EXPO_PUBLIC_API_URL)
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://boligo-back.onrender.com/api';

export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');
console.log('🎯 [API Config] Final API URL:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout (laisse le temps au serveur Render de se réveiller)
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper pour assigner un token dans les headers Axios v1.x compatible
const setAuthHeader = (headers: any, token: string) => {
  if (!headers) return;
  if (typeof headers.set === 'function') {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers['Authorization'] = `Bearer ${token}`;
  }
};

// Intercepteur pour les requêtes
client.interceptors.request.use(
  async (config) => {
    console.log('📤 [API Request]', config.method?.toUpperCase(), config.baseURL + config.url);
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      setAuthHeader(config.headers, token);
      console.log('🔑 [API Request] Token attached (first 30 chars):', token.substring(0, 30) + '...');
    } else {
      console.log('⚠️  [API Request] No token found');
    }
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Extrait un message d'erreur lisible par l'utilisateur
const extractErrorMessage = (data: any, defaultMsg: string) => {
  if (!data) return defaultMsg;
  let rawMsg = '';
  if (typeof data.message === 'string') rawMsg = data.message;
  else if (Array.isArray(data.message)) rawMsg = data.message.join('\n');
  else if (typeof data.error === 'string') rawMsg = data.error;
  else rawMsg = defaultMsg;

  const lower = rawMsg.toLowerCase();
  if (lower.includes('invalid credentials') || lower.includes('unauthorized') || lower.includes('bad credentials')) {
    return 'Adresse e-mail ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
  }
  if (lower.includes('user already exists') || lower.includes('email already exists') || lower.includes('unique constraint')) {
    return 'Un compte existe déjà avec cette adresse e-mail ou ce numéro.';
  }
  if (lower.includes('user not found')) {
    return 'Aucun compte associé à cette adresse e-mail.';
  }
  return rawMsg;
};

// Intercepteur pour les réponses
client.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response]', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Attacher un message lisible par l'utilisateur
    if (!error.readableMessage) {
      if (!error.response) {
        if (error.code === 'ECONNABORTED') {
          error.readableMessage = 'Le serveur met trop de temps à répondre. Veuillez réessayer.';
        } else {
          error.readableMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        }
      } else {
        error.readableMessage = extractErrorMessage(
          error.response?.data,
          error.message || 'Une erreur de connexion est survenue.'
        );
      }
    }

    if (error.response) {
      const status = error.response.status;

      // Détecter si c'est un 401 transparent qui peut être rafraîchi sans polluer les logs d'erreur
      const isRefreshable401 =
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        originalRequest.url !== '/auth/refresh' &&
        originalRequest.url !== '/auth/login' &&
        originalRequest.url !== '/auth/register';

      if (isRefreshable401) {
        console.log('🔄 [API 401] Token expiré, tentative de rafraîchissement en arrière-plan pour:', originalRequest?.url);

        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) setAuthHeader(originalRequest.headers, token);
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (!refreshToken) {
            throw new Error('Aucun token de rafraîchissement disponible');
          }

          const { AuthService } = require('./auth');
          const result = await AuthService.refresh(refreshToken);

          const newToken = result.access_token;
          const newRefreshToken = result.refresh_token;

          await SecureStore.setItemAsync('userToken', newToken);
          if (newRefreshToken) {
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
          }

          setAuthHeader(client.defaults.headers.common, newToken);
          setAuthHeader(originalRequest.headers, newToken);

          processQueue(null, newToken);

          console.log('✅ [API 401] Token rafraîchi avec succès');
          return client(originalRequest);
        } catch (err: any) {
          processQueue(err, null);
          console.warn('🔐 [API] Échec du rafraîchissement de la session. Déconnexion automatique.');

          try {
            await SecureStore.deleteItemAsync('userToken').catch(() => {});
            await SecureStore.deleteItemAsync('userId').catch(() => {});
            await SecureStore.deleteItemAsync('refreshToken').catch(() => {});

            const { triggerGlobalSignOut } = require('../context/auth');
            await triggerGlobalSignOut();

            const { router } = require('expo-router');
            if (router) {
              router.replace('/(auth)/login');
            }
          } catch (e) {
            console.error('❌ [API] Erreur lors de la déconnexion d\'urgence:', e);
          }

          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Si ce n'est pas un 401 silencieux (erreur 400, 403, 404, 500, ou 401 sur login/refresh), on log l'erreur normalement
      console.error('❌ [API Error]', status, originalRequest?.url, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ [API Timeout]', error.config?.baseURL + error.config?.url);
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🌐 [API Network Error]', error.config?.baseURL + error.config?.url);
    } else {
      console.error('❌ [API Unknown Error]', error.message);
    }

    return Promise.reject(error);
  }
);

export default client;

