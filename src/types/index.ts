export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: object;
    Functions: object;
  };
};

// Veyoyee User Profile with reputation system
export interface VeyoyeeUser {
  id: string;
  username?: string;
  display_name?: string;
  email?: string;
  total_reputation: number;
  surveys_created: number;
  responses_accepted: number;
  responses_rejected: number;
  created_at: string;
  updated_at: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website_url?: string;
}

export interface UserReputationStats {
  totalReputation: number;
  rank: number;
  responsesAccepted: number;
  responsesRejected: number;
  surveysCreated: number;
}

export interface LeaderboardEntry {
  id: string;
  username?: string;
  display_name?: string;
  total_reputation: number;
  responses_accepted: number;
  surveys_created: number;
}

// Enhanced survey response with reputation data
export interface SurveyResponseWithReputation {
  id: string;
  surveyId: string;
  respondent: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected" | "deleted";
  reputationScore: number; // Reputation awarded for this specific response
  totalUserReputation: number; // User's total reputation
  answers: Record<string, string | string[] | number | boolean>;
}

// Re-export survey-related types from survey.ts
export * from "./survey";
