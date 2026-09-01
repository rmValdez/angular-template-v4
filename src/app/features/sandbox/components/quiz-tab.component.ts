import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ANGULAR_100_QUIZ_BANK, QuizQuestion } from '../data/quiz-questions.data';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-quiz-tab',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <app-card className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full min-w-0 max-w-full">
      
      <!-- Quiz Header & Score Dashboard -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
              🛠️ Project Engineering Mastery
            </span>
            <app-badge variant="outline">{{ currentCategory() }}</app-badge>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
              [ngClass]="{
                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20': currentDifficulty() === 'BEGINNER',
                'bg-blue-500/10 text-blue-500 border border-blue-500/20': currentDifficulty() === 'INTERMEDIATE',
                'bg-purple-500/10 text-purple-500 border border-purple-500/20': currentDifficulty() === 'ADVANCED',
                'bg-amber-500/10 text-amber-500 border border-amber-500/20': currentDifficulty() === 'EXPERT',
                'bg-accent text-foreground': currentDifficulty() === 'ALL'
              }"
            >
              {{ currentDifficulty() }}
            </span>
            <span class="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              🗄️ PostgreSQL Model: QuizProgress
            </span>
          </div>
          <h3 class="text-2xl font-black text-foreground">🏗️ Angular 19 Project-Building Challenge</h3>
          <p class="text-xs text-muted-foreground">
            All answers and scores are persisted in the PostgreSQL database table <code>QuizProgress</code>.
          </p>
        </div>

        <!-- Score & Progress Stats -->
        <div class="flex items-center gap-3 bg-accent/30 p-3.5 rounded-2xl border shrink-0">
          <div class="text-right">
            <div class="text-xs font-bold text-foreground">
              Score: <span class="text-primary font-mono text-sm font-black">{{ quizScore() }}</span> / {{ answeredCount() }}
            </div>
            <div class="text-[10px] text-muted-foreground font-mono">
              Accuracy: <span class="font-bold text-emerald-500">{{ accuracyPercentage() }}%</span>
            </div>
          </div>
          <div class="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-md">
            🏆
          </div>
        </div>
      </div>

      <!-- Mode Selector & Global Progress -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent/20 p-3 rounded-2xl border">
        <div class="flex items-center gap-2 text-xs font-bold text-foreground flex-wrap">
          <span>Quiz Mode:</span>
          <button
            (click)="setQuizMode('ALL')"
            [class.bg-primary]="quizMode() === 'ALL'"
            [class.text-primary-foreground]="quizMode() === 'ALL'"
            class="px-2.5 py-1 rounded-lg border font-medium transition-all text-xs"
          >
            Full Bank (100 Qs)
          </button>
          <button
            (click)="setQuizMode('SPRINT_20')"
            [class.bg-primary]="quizMode() === 'SPRINT_20'"
            [class.text-primary-foreground]="quizMode() === 'SPRINT_20'"
            class="px-2.5 py-1 rounded-lg border font-medium transition-all text-xs"
          >
            ⚡ 20-Question Sprint
          </button>
        </div>

        <div class="text-xs font-mono text-muted-foreground text-right w-full sm:w-auto">
          Progress: <span class="font-bold text-foreground">{{ answeredCount() }} / {{ displayQuestions().length }}</span> ({{ progressPercentage() }}%)
        </div>
      </div>

      <!-- Animated Progress Bar -->
      <div class="h-2 w-full bg-accent rounded-full overflow-hidden border">
        <div
          class="h-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500 transition-all duration-300 rounded-full"
          [style.width.%]="progressPercentage()"
        ></div>
      </div>

      <!-- Filter Controls: Categories & Difficulty -->
      <div class="space-y-3 pt-1">
        <!-- Category Pills -->
        <div class="space-y-1">
          <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Engineering Domain:</span>
          <div class="flex flex-wrap gap-1.5">
            @for (cat of categories; track cat) {
              <button
                (click)="selectCategory(cat)"
                [class.bg-primary]="currentCategory() === cat"
                [class.text-primary-foreground]="currentCategory() === cat"
                [class.font-bold]="currentCategory() === cat"
                class="px-2.5 py-1 text-xs rounded-lg border font-medium transition-all hover:bg-accent/80 text-muted-foreground"
              >
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <!-- Difficulty Pills -->
        <div class="space-y-1 pt-1">
          <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Seniority Level:</span>
          <div class="flex flex-wrap gap-1.5">
            @for (diff of difficulties; track diff) {
              <button
                (click)="selectDifficulty(diff)"
                [class.bg-foreground]="currentDifficulty() === diff"
                [class.text-background]="currentDifficulty() === diff"
                [class.font-bold]="currentDifficulty() === diff"
                class="px-2.5 py-1 text-xs rounded-lg border font-medium transition-all hover:bg-accent/80 text-muted-foreground font-mono"
              >
                {{ diff }}
              </button>
            }
          </div>
        </div>

        <!-- Search Bar & Top Page Nav -->
        <div class="flex flex-col sm:flex-row gap-2 items-center justify-between pt-2">
          <input
            #searchInput
            type="text"
            placeholder="Search scenarios, code keywords, solutions..."
            [value]="searchTerm()"
            (input)="searchTerm.set(searchInput.value); currentPage.set(1)"
            class="w-full sm:w-80 px-3 py-1.5 text-xs bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div class="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-end">
            <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
            <div class="flex gap-1">
              <button
                (click)="prevPage()"
                [disabled]="currentPage() <= 1"
                class="px-2.5 py-1 rounded bg-accent border font-bold disabled:opacity-30 hover:bg-accent/80"
              >‹ Prev</button>
              <button
                (click)="nextPage()"
                [disabled]="currentPage() >= totalPages()"
                class="px-3 py-1.5 rounded bg-accent border font-bold disabled:opacity-30 hover:bg-accent/80"
              >Next ›</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (quizQuery.isLoading() && allQuestions().length === 0) {
        <div class="space-y-4 py-8">
          @for (i of [1, 2, 3]; track i) {
            <div class="p-6 rounded-2xl bg-accent/30 border animate-pulse space-y-3">
              <div class="h-4 bg-muted rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-8 bg-muted/60 rounded"></div>
                <div class="h-8 bg-muted/60 rounded"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Question List (Current Page) -->
        <div class="space-y-6 pt-2">
          @for (q of paginatedQuestions(); track q.id) {
            <div class="p-5 rounded-2xl bg-accent/20 border space-y-4 shadow-sm w-full min-w-0 max-w-full">
              
              <!-- Question Header: Number, Category, Difficulty -->
              <div class="flex items-start justify-between gap-4 flex-wrap">
                <div class="space-y-2 w-full">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="h-5 px-1.5 rounded-md bg-primary/20 text-primary font-mono font-bold text-[11px] flex items-center justify-center">
                      #{{ q.id }}
                    </span>
                    <span class="text-[10px] font-mono uppercase bg-accent px-2 py-0.5 rounded text-muted-foreground font-bold">
                      {{ q.category }}
                    </span>
                    <span
                      class="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                      [ngClass]="{
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20': q.difficulty === 'BEGINNER',
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20': q.difficulty === 'INTERMEDIATE',
                        'bg-purple-500/10 text-purple-500 border border-purple-500/20': q.difficulty === 'ADVANCED',
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20': q.difficulty === 'EXPERT'
                      }"
                    >
                      {{ q.difficulty }}
                    </span>
                    @if (userAnswers()[q.id] !== undefined) {
                      <span class="text-[10px] font-mono font-bold text-muted-foreground ml-auto">
                        Status: {{ userAnswers()[q.id] === q.correctIndex ? '✅ Completed' : '❌ Needs Practice' }}
                      </span>
                    }
                  </div>

                  <h4 class="text-sm sm:text-base font-bold text-foreground leading-snug">
                    {{ q.question }}
                  </h4>

                  <!-- Code Snippet Box when available -->
                  @if (q.codeSnippet) {
                    <div class="p-3 bg-zinc-950 dark:bg-black/80 rounded-xl border font-mono text-xs text-emerald-400 overflow-x-auto max-h-48 overflow-y-auto">
                      <pre class="whitespace-pre font-mono">{{ q.codeSnippet }}</pre>
                    </div>
                  }
                </div>
              </div>

              <!-- Options Grid -->
              <div class="space-y-2 pt-1">
                @for (opt of q.options; track $index) {
                  <button
                    (click)="answerQuestion(q.id, $index)"
                    [disabled]="userAnswers()[q.id] !== undefined"
                    [ngClass]="{
                      'bg-emerald-500/20 border-emerald-500 text-emerald-600 font-bold': userAnswers()[q.id] !== undefined && $index === q.correctIndex,
                      'bg-rose-500/20 border-rose-500 text-rose-500 font-bold': userAnswers()[q.id] === $index && $index !== q.correctIndex,
                      'bg-background hover:bg-accent/60': userAnswers()[q.id] === undefined
                    }"
                    class="w-full text-left p-3 rounded-xl text-xs font-medium border transition-colors flex items-center justify-between gap-3"
                  >
                    <span class="flex-1 leading-relaxed">{{ opt }}</span>
                    @if (userAnswers()[q.id] !== undefined && $index === q.correctIndex) {
                      <span class="font-bold text-emerald-500 shrink-0 text-xs">✓ Correct</span>
                    }
                    @if (userAnswers()[q.id] === $index && $index !== q.correctIndex) {
                      <span class="font-bold text-rose-500 shrink-0 text-xs">✕ Incorrect</span>
                    }
                  </button>
                }
              </div>

              <!-- In-Depth Technical Explanation -->
              @if (userAnswers()[q.id] !== undefined) {
                <div class="p-4 bg-background/95 rounded-xl border text-xs text-muted-foreground space-y-1.5 shadow-inner">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 text-foreground font-bold">
                      <span>💡 Architectural Rationale:</span>
                    </div>
                    <!-- Retake Individual Question Button -->
                    <button
                      (click)="retakeQuestion(q.id)"
                      class="text-[10px] text-primary hover:underline font-bold"
                    >
                      🔄 Retake This Question
                    </button>
                  </div>
                  <p class="leading-relaxed">{{ q.explanation }}</p>
                </div>
              }

            </div>
          } @empty {
            <div class="p-12 text-center text-muted-foreground text-xs bg-accent/10 rounded-2xl border border-dashed">
              No questions match your current category and difficulty filter.
            </div>
          }
        </div>
      }

      <!-- Bottom Pagination & Retake Controls -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            (click)="resetQuiz()"
            class="px-3.5 py-2 text-xs font-bold bg-accent hover:bg-accent/80 border rounded-xl transition-colors text-foreground"
            title="Clear all answers and restart"
          >
            🔄 Retake Entire Quiz
          </button>

          @if (incorrectCount() > 0) {
            <button
              (click)="retakeIncorrectOnly()"
              class="px-3.5 py-2 text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
              title="Reset only the questions you got wrong to practice until 100%"
            >
              🎯 Retake {{ incorrectCount() }} Incorrect Only
            </button>
          }
        </div>

        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Showing page {{ currentPage() }} of {{ totalPages() }}</span>
          <div class="flex gap-1.5">
            <button
              (click)="prevPage()"
              [disabled]="currentPage() <= 1"
              class="px-3 py-1.5 rounded-lg bg-accent border font-bold disabled:opacity-30 hover:bg-accent/80"
            >‹ Prev</button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() >= totalPages()"
              class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold disabled:opacity-30 hover:opacity-90 shadow-sm"
            >Next ›</button>
          </div>
        </div>
      </div>

    </app-card>
  `
})
export class QuizTabComponent {
  private readonly quizService = inject(QuizService);

  readonly pageSize = 10;
  readonly currentCategory = signal<string>('ALL');
  readonly currentDifficulty = signal<string>('ALL');
  readonly searchTerm = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly userAnswers = signal<Record<number, number>>({});
  readonly quizMode = signal<'ALL' | 'SPRINT_20'>('ALL');

  // TanStack Query: Questions list from PostgreSQL
  readonly quizQuery = this.quizService.getQuizQuestionsQuery(
    this.currentCategory,
    this.currentDifficulty,
    this.searchTerm
  );

  // TanStack Query: Quiz progress from PostgreSQL
  readonly progressQuery = this.quizService.getQuizProgressQuery();

  constructor() {
    // When progress loads from PostgreSQL, populate userAnswers signal
    effect(() => {
      const data = this.progressQuery.data();
      if (data?.answers && typeof data.answers === 'object') {
        const parsed: Record<number, number> = {};
        for (const [k, v] of Object.entries(data.answers)) {
          parsed[Number(k)] = Number(v);
        }
        this.userAnswers.set(parsed);
      }
    });
  }

  readonly categories = [
    'ALL',
    'FUNDAMENTALS',
    'SIGNALS',
    'ARCHITECTURE',
    'ROUTING',
    'FORMS',
    'HTTP_QUERY',
    'PERFORMANCE',
    'TESTING',
    'SECURITY',
    'DEBUGGING'
  ];

  readonly difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  readonly allQuestions = computed<QuizQuestion[]>(() => {
    const data = this.quizQuery.data();
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    return ANGULAR_100_QUIZ_BANK;
  });

  readonly displayQuestions = computed(() => {
    let list = this.allQuestions();
    if (this.quizMode() === 'SPRINT_20') {
      return list.slice(0, 20);
    }
    return list;
  });

  readonly filteredQuestions = computed(() => {
    let list = this.displayQuestions();
    const cat = this.currentCategory();
    if (cat !== 'ALL') {
      list = list.filter(q => q.category === cat);
    }
    const diff = this.currentDifficulty();
    if (diff !== 'ALL') {
      list = list.filter(q => q.difficulty === diff);
    }
    const search = this.searchTerm().toLowerCase();
    if (search) {
      list = list.filter(
        q =>
          q.question.toLowerCase().includes(search) ||
          q.explanation.toLowerCase().includes(search) ||
          (q.codeSnippet && q.codeSnippet.toLowerCase().includes(search)) ||
          q.options.some(opt => opt.toLowerCase().includes(search))
      );
    }
    return list;
  });

  readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredQuestions().length / this.pageSize));
  });

  readonly paginatedQuestions = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredQuestions().slice(start, start + this.pageSize);
  });

  readonly answeredCount = computed(() => {
    const activeIds = new Set(this.displayQuestions().map(q => q.id));
    const answers = this.userAnswers();
    return Object.keys(answers).filter(id => activeIds.has(Number(id))).length;
  });

  readonly quizScore = computed(() => {
    const answers = this.userAnswers();
    let correct = 0;
    for (const q of this.displayQuestions()) {
      if (answers[q.id] === q.correctIndex) {
        correct++;
      }
    }
    return correct;
  });

  readonly incorrectCount = computed(() => {
    const answers = this.userAnswers();
    let incorrect = 0;
    for (const q of this.displayQuestions()) {
      if (answers[q.id] !== undefined && answers[q.id] !== q.correctIndex) {
        incorrect++;
      }
    }
    return incorrect;
  });

  readonly accuracyPercentage = computed(() => {
    const answered = this.answeredCount();
    if (answered === 0) return 0;
    return Math.round((this.quizScore() / answered) * 100);
  });

  readonly progressPercentage = computed(() => {
    const total = this.displayQuestions().length;
    if (total === 0) return 0;
    return Math.round((this.answeredCount() / total) * 100);
  });

  selectCategory(cat: string) {
    this.currentCategory.set(cat);
    this.currentPage.set(1);
  }

  selectDifficulty(diff: string) {
    this.currentDifficulty.set(diff);
    this.currentPage.set(1);
  }

  setQuizMode(mode: 'ALL' | 'SPRINT_20') {
    this.quizMode.set(mode);
    this.currentPage.set(1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  async answerQuestion(questionId: number, optionIndex: number) {
    const newAnswers = {
      ...this.userAnswers(),
      [questionId]: optionIndex
    };
    this.userAnswers.set(newAnswers);

    // Save directly to PostgreSQL QuizProgress table
    try {
      await this.quizService.saveProgressToDb({
        answers: newAnswers,
        score: this.quizScore(),
        answeredCount: this.answeredCount()
      });
    } catch (e) {
      console.error('Failed to save quiz progress to PostgreSQL', e);
    }
  }

  async retakeQuestion(questionId: number) {
    const updated = { ...this.userAnswers() };
    delete updated[questionId];
    this.userAnswers.set(updated);

    try {
      await this.quizService.saveProgressToDb({
        answers: updated,
        score: this.quizScore(),
        answeredCount: this.answeredCount()
      });
    } catch (e) {
      console.error('Failed to update quiz progress in PostgreSQL', e);
    }
  }

  async retakeIncorrectOnly() {
    const updated = { ...this.userAnswers() };
    for (const q of this.allQuestions()) {
      if (updated[q.id] !== undefined && updated[q.id] !== q.correctIndex) {
        delete updated[q.id];
      }
    }
    this.userAnswers.set(updated);

    try {
      await this.quizService.saveProgressToDb({
        answers: updated,
        score: this.quizScore(),
        answeredCount: this.answeredCount()
      });
    } catch (e) {
      console.error('Failed to update quiz progress in PostgreSQL', e);
    }
  }

  async resetQuiz() {
    this.userAnswers.set({});
    this.currentPage.set(1);

    try {
      await this.quizService.resetProgressInDb();
    } catch (e) {
      console.error('Failed to reset quiz progress in PostgreSQL', e);
    }
  }
}
