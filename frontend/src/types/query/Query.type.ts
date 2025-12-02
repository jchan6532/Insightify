export interface Query {
  id: string;
  question: string;
  answer: string;
  top_k: number;
  model_name?: string | null;
  created_at: string;
}
