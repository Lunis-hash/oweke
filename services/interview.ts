import client from './api';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  assistance?: string;
  dependsOn?: {
    questionId: string;
    answerKey: string;
  };
}

export interface InterviewStatus {
  status?: string; // 'none', 'en_cours', 'termine'
  interviewId?: string;
  currentModule: number;
  isCompleted: boolean;
  completedModules?: number[];
}

export const InterviewService = {
  getStatus: async () => {
    const response = await client.get<InterviewStatus>('/interview/status');
    return response.data;
  },

  getQuestions: async (moduleNumber: number, retries = 2): Promise<Question[]> => {
    try {
      const response = await client.get<Question[]>(`/interview/questions/${moduleNumber}`);
      return response.data;
    } catch (error: any) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, 1000));
        return InterviewService.getQuestions(moduleNumber, retries - 1);
      }
      throw error;
    }
  },

  saveModule: async (moduleNumber: number, answers: Record<string, string>, retries = 2): Promise<any> => {
    // Module names mapping (Modules 0 à 10)
    const moduleNames = [
      'Filtres non-négociables',
      'Identité & Culture',
      'Attachement & Régulation émotionnelle',
      'Vécu & Contexte',
      'Vision économique',
      'Dynamique sociale & familiale',
      'Quotidien, Communication réelle & Limites',
      'Trajectoire de vie & Personnalité',
      'Projet de couple',
      'Pouvoir, Effort & Capacité à aimer',
      'Alchimie, Vibe & Désir',
    ];

    try {
      const response = await client.post('/interview/save-module', {
        moduleNumber,
        moduleName: moduleNames[moduleNumber] || `Module ${moduleNumber}`,
        answers,
      });
      return response.data;
    } catch (error: any) {
      if (retries > 0) {
        console.warn(`⚠️ [InterviewService] Retry ${3 - retries} for saveModule ${moduleNumber}...`);
        await new Promise((res) => setTimeout(res, 1200));
        return InterviewService.saveModule(moduleNumber, answers, retries - 1);
      }
      throw error;
    }
  },

  completeInterview: async () => {
    // L'interview se complète automatiquement quand tous les modules sont sauvegardés
    // On utilise save-module avec le dernier module (Module 10) pour trigger la complétion
    const moduleNames = [
      'Filtres non-négociables',
      'Identité & Culture',
      'Attachement & Régulation émotionnelle',
      'Vécu & Contexte',
      'Vision économique',
      'Dynamique sociale & familiale',
      'Quotidien, Communication réelle & Limites',
      'Trajectoire de vie & Personnalité',
      'Projet de couple',
      'Pouvoir, Effort & Capacité à aimer',
      'Alchimie, Vibe & Désir',
    ];

    const response = await client.post('/interview/save-module', {
      moduleNumber: 10,
      moduleName: moduleNames[10],
      answers: {},
    });
    return response.data;
  },

  getSummary: async () => {
    const response = await client.get('/interview/summary');
    return response.data;
  },
};
