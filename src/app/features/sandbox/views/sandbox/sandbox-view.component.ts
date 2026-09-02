import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe, JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { AngularTopicService } from '../../services/angular-topic.service';
import { SignalChildDemoComponent } from '../../components/signal-child-demo.component';
import { HeavyChartDemoComponent } from '../../components/heavy-chart-demo.component';
import { LearningGuideTabComponent } from '../../components/learning-guide-tab.component';
import { QuizTabComponent } from '../../components/quiz-tab.component';

interface SandboxTodo {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-sandbox-view',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    UpperCasePipe,
    JsonPipe,
    ReactiveFormsModule,
    CardComponent,
    BadgeComponent,
    SignalChildDemoComponent,
    HeavyChartDemoComponent,
    LearningGuideTabComponent,
    QuizTabComponent,
  ],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto pb-16 w-full min-w-0 max-w-full">
      
      <!-- Top Sandbox Hero Banner -->
      <div class="p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/15 via-accent/30 to-background border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Angular 19 Sandbox
            </span>
            <span class="text-xs text-muted-foreground font-mono">100% Comprehensive Master Suite</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground break-words">
            Interactive Learning Sandbox
          </h1>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Live playground exploring Signals, Control Flow, Reactive Forms, &#64;defer lazy loading, Signal Inputs/Outputs, Pipes, and an interactive Quiz!
          </p>
        </div>

        <!-- Real-time Quick Status Indicator -->
        <div class="flex items-center gap-3 bg-card/80 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border shrink-0">
          <div class="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
          <div>
            <div class="text-xs font-bold text-foreground">Backend Connected</div>
            <div class="text-[10px] text-muted-foreground font-mono">PostgreSQL :3002</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 bg-accent/40 rounded-xl border border-border/60 w-full max-w-full">
        @for (tab of tabs; track tab.id) {
          <button
            (click)="activeTab.set(tab.id)"
            [class.bg-background]="activeTab() === tab.id"
            [class.text-primary]="activeTab() === tab.id"
            [class.shadow-md]="activeTab() === tab.id"
            [class.font-bold]="activeTab() === tab.id"
            class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </button>
        }
      </div>

      <!-- =================================================================== -->
      <!-- TAB 1: PRISMA ANGULAR TOPICS (DATABASE MODEL) -->
      <!-- =================================================================== -->
      @if (activeTab() === 'topics') {
        <app-card className="p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  Prisma Model
                </span>
                <h3 class="text-lg font-bold text-foreground">AngularTopic (PostgreSQL Database)</h3>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                Connected directly to <code>AngularTopic</code> table in PostgreSQL via TanStack Query &amp; Express.
              </p>
            </div>
            <button
              (click)="topicsQuery.refetch()"
              class="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              🔄 Refresh Topics
            </button>
          </div>

          @if (topicsQuery.isLoading()) {
            <div class="p-12 text-center bg-accent/20 rounded-xl border border-dashed animate-pulse">
              <p class="text-sm font-semibold text-primary">Loading Angular topics from database...</p>
            </div>
          } @else if (topicsQuery.isError()) {
            <div class="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
              Error fetching topics: {{ topicsQuery.error().message }}
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (topic of topicsList(); track topic.id) {
                <div class="p-5 rounded-xl bg-card border hover:border-primary/50 transition-all space-y-3 shadow-sm flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <app-badge variant="outline">{{ topic.category }}</app-badge>
                      <span class="text-[10px] font-mono text-muted-foreground uppercase font-bold px-2 py-0.5 rounded bg-accent">
                        {{ topic.difficulty }}
                      </span>
                    </div>
                    <h4 class="text-base font-bold text-foreground leading-snug">{{ topic.title }}</h4>
                    <p class="text-xs text-muted-foreground">{{ topic.description }}</p>

                    @if (topic.codeSnippet) {
                      <div class="mt-3 p-3 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                        <pre>{{ topic.codeSnippet }}</pre>
                      </div>
                    }
                  </div>

                  <div class="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Slug: /{{ topic.slug }}</span>
                    <span class="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Verified Topic
                    </span>
                  </div>
                </div>
              }
            </div>
          }
        </app-card>
      }

      <!-- =================================================================== -->
      <!-- TAB 2: SIGNALS & REACTIVITY -->
      <!-- =================================================================== -->
      @if (activeTab() === 'signals') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-card className="p-6 space-y-5">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-lg font-bold text-foreground">1. Reactive Price Calculator</h3>
                <p class="text-xs text-muted-foreground">Writable Signals + Computed Signals</p>
              </div>
              <app-badge variant="outline">signal() + computed()</app-badge>
            </div>

            <div class="space-y-4 bg-accent/20 p-5 rounded-xl border">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Unit Price:</span>
                <div class="flex items-center gap-2">
                  <button (click)="decrementPrice()" class="h-8 w-8 rounded-lg bg-background border flex items-center justify-center font-bold hover:bg-accent">-</button>
                  <span class="font-mono font-bold text-sm w-12 text-center">\${{ unitPrice() }}</span>
                  <button (click)="incrementPrice()" class="h-8 w-8 rounded-lg bg-background border flex items-center justify-center font-bold hover:bg-accent">+</button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Quantity:</span>
                <div class="flex items-center gap-2">
                  <button (click)="decrementQty()" [disabled]="quantity() <= 1" class="h-8 w-8 rounded-lg bg-background border flex items-center justify-center font-bold disabled:opacity-30 hover:bg-accent">-</button>
                  <span class="font-mono font-bold text-sm w-12 text-center">{{ quantity() }}</span>
                  <button (click)="incrementQty()" class="h-8 w-8 rounded-lg bg-background border flex items-center justify-center font-bold hover:bg-accent">+</button>
                </div>
              </div>

              <div class="pt-3 border-t flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Subtotal:</span>
                <span class="font-mono font-bold text-emerald-500">\${{ subtotal() }}</span>
              </div>

              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tax (8% Auto-Calculated):</span>
                <span class="font-mono font-semibold">\${{ taxAmount() }}</span>
              </div>

              <div class="p-3.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between">
                <span class="text-sm font-bold text-primary">Grand Total:</span>
                <span class="text-2xl font-black text-primary font-mono">\${{ grandTotal() }}</span>
              </div>
            </div>

            <div class="text-xs text-muted-foreground bg-background p-3 rounded-lg border">
              <strong>Code in action:</strong> <code>const grandTotal = computed(() => subtotal() + taxAmount())</code>
            </div>
          </app-card>

          <!-- Signals State Inspector -->
          <app-card className="p-6 space-y-5">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-lg font-bold text-foreground">2. Live Signal State Inspector</h3>
                <p class="text-xs text-muted-foreground">Automatic DOM reflection</p>
              </div>
              <app-badge variant="outline">Live State</app-badge>
            </div>

            <div class="space-y-3 font-mono text-xs">
              <div class="p-3 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 space-y-1">
                <div class="text-slate-400">// Current Reactive Signal Values</div>
                <div>unitPrice: <span class="text-amber-400">{{ unitPrice() }}</span></div>
                <div>quantity: <span class="text-amber-400">{{ quantity() }}</span></div>
                <div>subtotal: <span class="text-cyan-400">{{ subtotal() }}</span></div>
                <div>taxAmount: <span class="text-cyan-400">{{ taxAmount() }}</span></div>
                <div>grandTotal: <span class="text-emerald-400 font-bold">{{ grandTotal() }}</span></div>
              </div>

              <div class="p-4 bg-accent/30 rounded-xl border space-y-2 font-sans">
                <h4 class="text-xs font-bold text-foreground">Quick Action Presets:</h4>
                <div class="flex flex-wrap gap-2">
                  <button (click)="setPreset(10, 1)" class="px-2.5 py-1.5 text-xs bg-background border rounded-lg hover:bg-accent font-semibold">Small ($10 x 1)</button>
                  <button (click)="setPreset(49, 3)" class="px-2.5 py-1.5 text-xs bg-background border rounded-lg hover:bg-accent font-semibold">Medium ($49 x 3)</button>
                  <button (click)="setPreset(199, 5)" class="px-2.5 py-1.5 text-xs bg-background border rounded-lg hover:bg-accent font-semibold">Enterprise ($199 x 5)</button>
                </div>
              </div>
            </div>
          </app-card>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 3: CONTROL FLOW (@if, @for, @switch) -->
      <!-- =================================================================== -->
      @if (activeTab() === 'control-flow') {
        <app-card className="p-6 space-y-5">
          <div class="flex items-center justify-between border-b pb-3">
            <div>
              <h3 class="text-lg font-bold text-foreground">Modern Native Control Flow</h3>
              <p class="text-xs text-muted-foreground">&#64;if, &#64;for with (track item.id), and &#64;switch</p>
            </div>
            <app-badge variant="outline">&#64;for / &#64;if / &#64;switch</app-badge>
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <input
              #taskInput
              type="text"
              placeholder="Type a new task and press Enter..."
              (keyup.enter)="addTask(taskInput)"
              class="flex-1 w-full min-w-0 px-4 py-2.5 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              (click)="addTask(taskInput)"
              class="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Add Task
            </button>
          </div>

          <div class="flex gap-1 p-1 bg-accent/40 rounded-xl border max-w-sm">
            @for (f of ['all', 'active', 'completed']; track f) {
              <button
                (click)="taskFilter.set(f)"
                [class.bg-background]="taskFilter() === f"
                [class.text-foreground]="taskFilter() === f"
                [class.shadow-sm]="taskFilter() === f"
                class="flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize text-muted-foreground transition-all"
              >
                {{ f }}
              </button>
            }
          </div>

          <div class="space-y-2">
            @for (task of filteredTasks(); track task.id) {
              <div class="flex items-center justify-between p-3.5 rounded-xl bg-accent/20 border hover:bg-accent/40 transition-colors">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    [checked]="task.done"
                    (change)="toggleTask(task.id)"
                    class="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <span [class.line-through]="task.done" [class.text-muted-foreground]="task.done" class="text-sm font-medium">
                    {{ task.text }}
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  @switch (task.priority) {
                    @case ('high') {
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">HIGH</span>
                    }
                    @case ('medium') {
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">MED</span>
                    }
                    @default {
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500 border border-slate-500/20">LOW</span>
                    }
                  }
                  <button (click)="deleteTask(task.id)" class="text-xs text-muted-foreground hover:text-destructive p-1">✕</button>
                </div>
              </div>
            } @empty {
              <div class="text-center py-10 text-muted-foreground text-xs bg-accent/10 rounded-xl border border-dashed">
                No tasks match the filter.
              </div>
            }
          </div>
        </app-card>
      }

      <!-- =================================================================== -->
      <!-- TAB 4: REACTIVE FORMS -->
      <!-- =================================================================== -->
      @if (activeTab() === 'forms') {
        <app-card className="p-6 space-y-6 max-w-xl mx-auto">
          <div class="border-b pb-3">
            <h3 class="text-lg font-bold text-foreground">Reactive Forms with Validation</h3>
            <p class="text-xs text-muted-foreground">FormGroup, FormControl &amp; Live Validation</p>
          </div>

          <form [formGroup]="testForm" (ngSubmit)="onFormSubmit()" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Full Name</label>
              <input
                formControlName="name"
                type="text"
                placeholder="e.g. Alex Johnson"
                class="w-full px-3.5 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              @if (testForm.get('name')?.touched && testForm.get('name')?.invalid) {
                <p class="text-xs text-destructive">Name is required (minimum 3 characters).</p>
              }
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Email Address (Strict RFC Validation)</label>
              <input
                formControlName="email"
                type="email"
                placeholder="e.g. alex@example.com"
                class="w-full px-3.5 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              @if (testForm.get('email')?.touched && testForm.get('email')?.invalid) {
                <p class="text-xs text-destructive">Please enter a valid email address (e.g. name&#64;domain.com).</p>
              }
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-foreground">Role</label>
              <select
                formControlName="role"
                class="w-full px-3.5 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USER">User (Standard)</option>
                <option value="DEVELOPER">Developer</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <button
              type="submit"
              [disabled]="testForm.invalid"
              class="w-full py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Submit Validated Form
            </button>
          </form>

          @if (formSubmittedData()) {
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 space-y-1">
              <div class="font-bold">✅ Form Payload Validated &amp; Ready:</div>
              <pre>{{ formSubmittedData() | json }}</pre>
            </div>
          }
        </app-card>
      }

      <!-- =================================================================== -->
      <!-- TAB 5: ADVANCED (@defer, Signal inputs/outputs/model, Pipes) -->
      <!-- =================================================================== -->
      @if (activeTab() === 'advanced') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Signal Input/Output/Model Demo -->
          <app-card className="p-6 space-y-5">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-lg font-bold text-foreground">1. Signal input(), output(), model()</h3>
                <p class="text-xs text-muted-foreground">Modern Component Communication</p>
              </div>
              <app-badge variant="outline">Angular 19 APIs</app-badge>
            </div>

            <div class="space-y-3 text-xs text-muted-foreground">
              <p>Parent Component holding state: <code>parentScore = {{ parentScore() }}</code></p>
            </div>

            <app-signal-child-demo
              title="Interactive Signal Child Card"
              subtitle="Receives data via input() and syncs via [(score)]"
              [(score)]="parentScore"
              (messageSent)="onChildMessage($event)"
            />

            @if (childMessageLog()) {
              <div class="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs font-mono text-primary">
                {{ childMessageLog() }}
              </div>
            }
          </app-card>

          <!-- @defer Automated Lazy Loading Demo -->
          <app-card className="p-6 space-y-5">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-lg font-bold text-foreground">2. &#64;defer Deferred Loading</h3>
                <p class="text-xs text-muted-foreground">Automatic code splitting on interaction</p>
              </div>
              <app-badge variant="outline">&#64;defer (on interaction)</app-badge>
            </div>

            <p class="text-xs text-muted-foreground">
              The chart below is deferred from the main bundle. Click the button to trigger instant lazy-loading!
            </p>

            @defer (on interaction(triggerBtn)) {
              <app-heavy-chart-demo />
            } @placeholder {
              <div class="p-8 text-center bg-accent/20 rounded-xl border border-dashed space-y-3">
                <p class="text-xs text-muted-foreground font-medium">Heavy chart bundle is deferred.</p>
                <button
                  #triggerBtn
                  class="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 shadow-sm"
                >
                  ⚡ Click to Load Deferred Component
                </button>
              </div>
            } @loading (minimum 500ms) {
              <div class="p-8 text-center bg-accent/40 rounded-xl border animate-pulse">
                <span class="text-xs text-primary font-bold">Downloading chunk...</span>
              </div>
            }
          </app-card>

          <!-- Standard Angular Pipes Demo -->
          <app-card className="col-span-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="text-lg font-bold text-foreground">3. Standard Angular Pipes Showcase</h3>
                <p class="text-xs text-muted-foreground">Transforming values directly in HTML templates</p>
              </div>
              <app-badge variant="outline">Pipes</app-badge>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div class="p-3 bg-accent/20 rounded-lg border space-y-1">
                <div class="text-muted-foreground">// Currency Pipe</div>
                <div class="text-base font-bold text-foreground">{{ 1249.99 | currency:'USD':'symbol':'1.2-2' }}</div>
                <div class="text-[10px] text-muted-foreground">1249.99 | currency</div>
              </div>

              <div class="p-3 bg-accent/20 rounded-lg border space-y-1">
                <div class="text-muted-foreground">// Date Pipe</div>
                <div class="text-base font-bold text-foreground">{{ demoDate | date:'mediumDate' }}</div>
                <div class="text-[10px] text-muted-foreground">date | date:'mediumDate'</div>
              </div>

              <div class="p-3 bg-accent/20 rounded-lg border space-y-1">
                <div class="text-muted-foreground">// Number / Decimal Pipe</div>
                <div class="text-base font-bold text-foreground">{{ 987654.321 | number:'1.2-2' }}</div>
                <div class="text-[10px] text-muted-foreground">number:'1.2-2'</div>
              </div>

              <div class="p-3 bg-accent/20 rounded-lg border space-y-1">
                <div class="text-muted-foreground">// Uppercase Pipe</div>
                <div class="text-base font-bold text-foreground">{{ 'angular signals' | uppercase }}</div>
                <div class="text-[10px] text-muted-foreground">'text' | uppercase</div>
              </div>
            </div>
          </app-card>
        </div>
      }

      <!-- =================================================================== -->
      <!-- TAB 6: 100-QUESTION INTERACTIVE KNOWLEDGE QUIZ & CHALLENGES -->
      <!-- =================================================================== -->
      @if (activeTab() === 'quiz') {
        <app-quiz-tab />
      }

      <!-- =================================================================== -->
      <!-- TAB 7: COMPLETE 10-MODULE LEARNING GUIDE & ROSETTA STONE -->
      <!-- =================================================================== -->
      @if (activeTab() === 'encyclopedia') {
        <app-learning-guide-tab />
      }

    </div>
  `
})
export class SandboxViewComponent {
  private readonly angularTopicService = inject(AngularTopicService);

  readonly tabs = [
    { id: 'topics', label: '1. 🅰️ Angular Model (DB)', icon: '📦' },
    { id: 'signals', label: '2. Signals & Reactivity', icon: '⚡' },
    { id: 'control-flow', label: '3. Control Flow', icon: '🚥' },
    { id: 'forms', label: '4. Reactive Forms', icon: '📝' },
    { id: 'advanced', label: '5. 🚀 Advanced (@defer & Inputs)', icon: '✨' },
    { id: 'quiz', label: '6. 🎯 Angular 19 Quiz', icon: '🏆' },
    { id: 'encyclopedia', label: '7. 🏛️ Architecture & Quiz Guide', icon: '📚' },
  ];

  readonly activeTab = signal('topics');
  readonly demoDate = new Date();

  // --- TAB 1: TOPICS (PRISMA DATABASE) ---
  readonly topicsQuery = this.angularTopicService.getTopicsQuery();

  readonly topicsList = computed(() => {
    const data = this.topicsQuery.data();
    if (!data) return [];
    if (Array.isArray(data.items)) return data.items;
    return [];
  });

  // --- TAB 2: SIGNALS ---
  readonly unitPrice = signal(45);
  readonly quantity = signal(2);

  readonly subtotal = computed(() => this.unitPrice() * this.quantity());
  readonly taxAmount = computed(() => Number((this.subtotal() * 0.08).toFixed(2)));
  readonly grandTotal = computed(() => Number((this.subtotal() + this.taxAmount()).toFixed(2)));

  incrementPrice() { this.unitPrice.update(p => p + 5); }
  decrementPrice() { this.unitPrice.update(p => Math.max(5, p - 5)); }
  incrementQty() { this.quantity.update(q => q + 1); }
  decrementQty() { this.quantity.update(q => Math.max(1, q - 1)); }
  setPreset(price: number, qty: number) {
    this.unitPrice.set(price);
    this.quantity.set(qty);
  }

  // --- TAB 3: CONTROL FLOW ---
  readonly taskFilter = signal('all');
  readonly tasks = signal<SandboxTodo[]>([
    { id: 1, text: 'Prisma AngularTopic Model Created & Seeded', done: true, priority: 'high' },
    { id: 2, text: 'TanStack Angular Query Connected', done: true, priority: 'high' },
    { id: 3, text: 'Signal Inputs, Outputs & @defer Added', done: true, priority: 'medium' },
  ]);

  readonly filteredTasks = computed(() => {
    const f = this.taskFilter();
    const list = this.tasks();
    if (f === 'active') return list.filter(t => !t.done);
    if (f === 'completed') return list.filter(t => t.done);
    return list;
  });

  addTask(input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text) return;
    this.tasks.update(t => [
      ...t,
      { id: Date.now(), text, done: false, priority: 'medium' }
    ]);
    input.value = '';
  }

  toggleTask(id: number) {
    this.tasks.update(t =>
      t.map(item => item.id === id ? { ...item, done: !item.done } : item)
    );
  }

  deleteTask(id: number) {
    this.tasks.update(t => t.filter(item => item.id !== id));
  }

  // --- TAB 4: FORMS ---
  readonly testForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    role: new FormControl('USER', [Validators.required])
  });

  readonly formSubmittedData = signal<Record<string, unknown> | null>(null);

  onFormSubmit() {
    if (this.testForm.valid) {
      this.formSubmittedData.set(this.testForm.value);
    }
  }

  // --- TAB 5: ADVANCED (SIGNAL INPUT/OUTPUT/MODEL & @DEFER) ---
  readonly parentScore = signal(10);
  readonly childMessageLog = signal<string | null>(null);

  onChildMessage(msg: string) {
    this.childMessageLog.set(msg);
  }
}
