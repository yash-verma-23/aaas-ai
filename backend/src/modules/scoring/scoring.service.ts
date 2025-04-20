import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';

@Injectable()
export class ScoringService implements OnModuleInit {
  private embedder: any;

  async onModuleInit() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
  }

  // Method to get the embedding from Hugging Face
  async getEmbedding(text: string): Promise<number[]> {
    const result = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });
    return result.data;
  }

  // Method to compute cosine similarity using TensorFlow.js
  async getCosineSimilarity(text1: string, text2: string): Promise<number> {
    const emb1 = tf.tensor(await this.getEmbedding(text1));
    const emb2 = tf.tensor(await this.getEmbedding(text2));

    // Cosine similarity calculation
    const dotProduct = tf.sum(tf.mul(emb1, emb2));
    const normA = tf.norm(emb1);
    const normB = tf.norm(emb2);

    const similarity = dotProduct.div(normA.mul(normB));
    return similarity.arraySync() as number;
  }
}
