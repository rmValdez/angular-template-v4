import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { QuizQuestion } from '../data/quiz-questions.data';

export interface QuizApiResponse {
  status: string;
  message: string;
  data: {
    items: QuizQuestion[];
    total: number;
  };
}

export interface QuizProgressResponse {
  status: string;
  message: string;
  data: {
    id?: string;
    sessionId: string;
    answers: Record<number, number>;
    score: number;
    answeredCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002/api/v1/quiz';

  /**
   * Fetch quiz questions dynamically from PostgreSQL backend
   */
  getQuizQuestionsQuery(
    categorySignal: Signal<string>,
    difficultySignal: Signal<string>,
    searchSignal: Signal<string>
  ) {
    return injectQuery(() => {
      const category = categorySignal();
      const difficulty = difficultySignal();
      const search = searchSignal();

      return {
        queryKey: ['quiz-questions', { category, difficulty, search }],
        queryFn: async () => {
          let params = new HttpParams();
          if (category && category !== 'ALL') {
            params = params.set('category', category);
          }
          if (difficulty && difficulty !== 'ALL') {
            params = params.set('difficulty', difficulty);
          }
          if (search) {
            params = params.set('search', search);
          }

          const res = await firstValueFrom(
            this.http.get<QuizApiResponse>(this.apiUrl, { params })
          );
          return res.data;
        },
        staleTime: 1000 * 60 * 5,
      };
    });
  }

  /**
   * Fetch user quiz progress from PostgreSQL database
   */
  getQuizProgressQuery() {
    return injectQuery(() => ({
      queryKey: ['quiz-progress'],
      queryFn: async () => {
        const res = await firstValueFrom(
          this.http.get<QuizProgressResponse>(`${this.apiUrl}/progress`)
        );
        return res.data;
      },
      staleTime: 1000 * 60 * 2,
    }));
  }

  /**
   * Save quiz answers to PostgreSQL database
   */
  async saveProgressToDb(payload: {
    answers: Record<number, number>;
    score: number;
    answeredCount: number;
  }) {
    return firstValueFrom(
      this.http.post<QuizProgressResponse>(`${this.apiUrl}/progress`, payload)
    );
  }

  /**
   * Reset quiz progress in PostgreSQL database
   */
  async resetProgressInDb() {
    return firstValueFrom(
      this.http.post<QuizProgressResponse>(`${this.apiUrl}/progress/reset`, {})
    );
  }
}
