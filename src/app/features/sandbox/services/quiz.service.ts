import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { injectSafeQuery } from '../../../shared/query';
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
  // No backend in this ecosystem actually serves this route — every call
  // always fails. That's intentional: the sandbox quiz works standalone
  // with zero backend setup. The consumer (quiz-tab.component.ts's
  // `allQuestions` computed) falls back to the bundled ANGULAR_100_QUIZ_BANK
  // dataset whenever this query has no data. Point this at a real endpoint
  // only if you build one.
  private readonly apiUrl = 'http://localhost:3002/api/v1/quiz';

  /**
   * Fetch quiz questions dynamically from PostgreSQL backend with SafeQuery
   */
  getQuizQuestionsQuery(
    categorySignal: Signal<string>,
    difficultySignal: Signal<string>,
    searchSignal: Signal<string>
  ) {
    return injectSafeQuery<{ items: QuizQuestion[]; total: number }>(() => {
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
   * Fetch user quiz progress from PostgreSQL database with SafeQuery
   */
  getQuizProgressQuery() {
    return injectSafeQuery<QuizProgressResponse['data']>(() => ({
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
