import { type RetrievedChunk } from './RetrievedChunk.type';

export type QueryResponse = {
  answer: string;
  chunks: RetrievedChunk[];
};
