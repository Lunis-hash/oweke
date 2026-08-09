export type LiveSessionStatus = 
  | "WAITING"
  | "COUNTDOWN"
  | "IN_ROUND"
  | "SOFT_VIEW"
  | "ROUND_TRANSITION"
  | "SESSION_END";

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  city: string;
  department: string;
  photoUrl: string;
  bio?: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  department: string;
  category: string;
  durationRoundMin: number;
  totalRounds: number;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  city: string;
  photoUrl: string;
}

export interface Round {
  roundNumber: number;
  totalRounds: number;
  partner: Participant | null;
  durationSeconds: number;
  softViewSeconds: number;
}

export interface Match {
  id: string;
  sessionId: string;
  partner: Participant;
  matchedAt: string;
  contactEmail?: string;
  whatsapp?: string;
}

export interface RatingPayload {
  roundNumber: number;
  targetUserId: string;
  liked: boolean;
  note?: string;
}
