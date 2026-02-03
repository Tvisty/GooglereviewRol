export interface FeedbackData {
  rating: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  googleRedirectTriggered: boolean;
  customerName?: string;
  customerPhone?: string;
  customerMessage?: string;
  timestamp: string;
}

export enum FlowStep {
  RATING = 'RATING',
  NEGATIVE_FEEDBACK = 'NEGATIVE_FEEDBACK',
  POSITIVE_REDIRECT = 'POSITIVE_REDIRECT',
  SUCCESS = 'SUCCESS'
}