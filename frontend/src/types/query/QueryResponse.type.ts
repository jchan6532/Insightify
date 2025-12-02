import { type RetrievedChunk } from './RetrievedChunk.type';

export type QueryResponse = {
  query_id: string;
  answer: string;
  chunks: RetrievedChunk[];
};
