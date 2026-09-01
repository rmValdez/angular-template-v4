import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';

interface ArchitecturePillar {
  id: string;
  pillarNumber: number;
  title: string;
  category: string;
  icon: string;
  summary: string;
  rules: string[];
  codeExample: string;
  quizTips: string[];
}

@Component({
  selector: 'app-learning-guide-tab',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto w-full min-w-0 max-w-full">
      
      <!-- Top Header & Mission Statement -->
      <div class="border-b pb-5 space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
            🏛️ Architectural Blueprint &amp; Study Guide
          </span>
          <app-badge variant="outline">Quiz &amp; Production Companion</app-badge>
        </div>
        <h3 class="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Angular 19 Enterprise Architecture Reference
        </h3>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Master the exact architectural patterns, boundaries, and engineering decisions implemented across this template to build scalable production apps and ace the Mastery Quiz.
        </p>
      </div>

      <!-- Quick Search & Pillar Selector -->
      <div class="space-y-3 bg-accent/20 p-4 rounded-2xl border">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs font-bold text-foreground">
            Explore 10 Engineering Pillars:
          </div>
          <input
            #searchInput
            type="text"
            placeholder="Search architectural rules, patterns, or quiz concepts..."
            [value]="searchTerm()"
            (input)="searchTerm.set(searchInput.value)"
            class="w-full sm:w-80 px-3 py-1.5 text-xs bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div class="flex flex-wrap gap-1.5 pt-1">
          <button
            (click)="selectedPillarId.set('ALL')"
            [class.bg-primary]="selectedPillarId() === 'ALL'"
            [class.text-primary-foreground]="selectedPillarId() === 'ALL'"
            [class.font-bold]="selectedPillarId() === 'ALL'"
            class="px-2.5 py-1 text-xs rounded-lg border font-medium transition-all hover:bg-accent text-muted-foreground"
          >
            All Pillars (10)
          </button>
          @for (pillar of pillars; track pillar.id) {
            <button
              (click)="selectedPillarId.set(pillar.id)"
              [class.bg-primary]="selectedPillarId() === pillar.id"
              [class.text-primary-foreground]="selectedPillarId() === pillar.id"
              [class.font-bold]="selectedPillarId() === pillar.id"
              class="px-2.5 py-1 text-xs rounded-lg border font-medium transition-all hover:bg-accent text-muted-foreground flex items-center gap-1.5"
            >
              <span>{{ pillar.icon }}</span>
              <span>{{ pillar.title }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Visual Architecture Diagram Card -->
      <app-card className="p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <h4 class="text-base font-bold text-foreground">📐 FAOS (Feature-Atomic Architecture) Layer Hierarchy</h4>
            <p class="text-xs text-muted-foreground">The golden dependency rule enforcing 100% decoupling across feature modules</p>
          </div>
          <app-badge variant="outline">System Design</app-badge>
        </div>

        <div class="p-4 bg-zinc-950 dark:bg-black/90 rounded-2xl border font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
          <pre class="leading-relaxed whitespace-pre font-mono">
┌─────────────────────────────────────────────────────────────────────────────┐
│                              /app/core/                                     │
│  • App Configuration & Providers (app.config.ts)                            │
│  • Global Singletons & Auth (AuthService, AuthInterceptor, ThemeService)    │
│  • Root Interceptors & Guards (auth.guard.ts, role.guard.ts)                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (injected by)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             /app/shared/                                    │
│  • Dumb UI Primitives (Button, Card, Input, Badge, Dialog)                  │
│  • Pure Pipes (Date, Currency, Truncate) & Utilities                        │
│  • Layouts (AppLayout, Sidebar, Navbar)                                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (consumed by)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            /app/features/                                   │
│  ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐   │
│  │     /dashboard     │   │       /users       │   │      /sandbox      │   │
│  │ • views/           │   │ • views/           │   │ • views/           │   │
│  │ • components/      │   │ • components/      │   │ • components/      │   │
│  │ • services/        │   │ • services/        │   │ • services/        │   │
│  └─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘   │
│            │ ❌ NO CROSS-FEATURE IMPORTS (Strictly Forbidden!) │            │
└────────────┴────────────────────────┴────────────────────────┴──────────────┘
          </pre>
        </div>
      </app-card>

      <!-- Architecture Pillars List -->
      <div class="space-y-6">
        @for (p of filteredPillars(); track p.id) {
          <app-card className="p-5 sm:p-6 md:p-8 space-y-5 shadow-sm border">
            
            <!-- Pillar Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="h-6 w-6 rounded-lg bg-primary/20 text-primary font-mono font-bold text-xs flex items-center justify-center">
                    #{{ p.pillarNumber }}
                  </span>
                  <span class="text-xs font-mono font-bold uppercase bg-accent px-2.5 py-0.5 rounded text-muted-foreground">
                    {{ p.category }}
                  </span>
                  <app-badge variant="outline">{{ p.icon }} Pillar</app-badge>
                </div>
                <h4 class="text-lg sm:text-xl font-bold text-foreground">
                  {{ p.title }}
                </h4>
              </div>
            </div>

            <!-- Summary -->
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {{ p.summary }}
            </p>

            <!-- Key Architectural Rules -->
            <div class="space-y-2 bg-accent/20 p-4 rounded-xl border">
              <div class="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>📌 Core Engineering Rules:</span>
              </div>
              <ul class="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                @for (rule of p.rules; track rule) {
                  <li class="leading-relaxed"><strong class="text-foreground">{{ rule.split('—')[0] }}</strong>— {{ rule.split('—')[1] || '' }}</li>
                }
              </ul>
            </div>

            <!-- Canonical Code Recipe -->
            <div class="space-y-1.5">
              <div class="text-xs font-bold text-foreground">💻 Production Implementation Pattern:</div>
              <div class="p-3.5 bg-zinc-950 dark:bg-black/90 rounded-xl border font-mono text-xs text-emerald-400 overflow-x-auto max-h-56 overflow-y-auto">
                <pre class="whitespace-pre font-mono">{{ p.codeExample }}</pre>
              </div>
            </div>

            <!-- Quiz Master Tip Box -->
            <div class="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/30 to-background border border-primary/20 space-y-2">
              <div class="flex items-center gap-2 text-primary font-bold text-xs">
                <span>🎯 Quiz Solvers &amp; Edge Cases:</span>
              </div>
              <ul class="space-y-1 text-xs text-muted-foreground">
                @for (tip of p.quizTips; track tip) {
                  <li class="flex items-start gap-1.5">
                    <span class="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{{ tip }}</span>
                  </li>
                }
              </ul>
            </div>

          </app-card>
        } @empty {
          <div class="p-12 text-center text-muted-foreground text-xs bg-accent/10 rounded-2xl border border-dashed">
            No architecture pillars match your search query.
          </div>
        }
      </div>

    </div>
  `
})
export class LearningGuideTabComponent {
  readonly searchTerm = signal<string>('');
  readonly selectedPillarId = signal<string>('ALL');

  readonly pillars: ArchitecturePillar[] = [
    {
      id: 'fundamentals',
      pillarNumber: 1,
      title: 'Standalone Bootstrap & Tree-Shakeable DI',
      category: 'FUNDAMENTALS',
      icon: '🅰️',
      summary: 'Angular 19 eliminates NgModules in favor of direct Standalone Component bootstrapping and functional dependency injection.',
      rules: [
        'Standalone Root Bootstrapping — Always initialize using bootstrapApplication(AppComponent, appConfig) with ApplicationConfig.',
        'Functional Dependency Injection — Use inject(Service) class field declarations instead of cluttered constructor parameters.',
        'DestroyRef Cleanup — Register lifecycle disposal callbacks with inject(DestroyRef).onDestroy(() => ...) in services or helper functions.'
      ],
      codeExample: `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor, tenantInterceptor])),
    provideTanStackQuery(new QueryClient()),
  ]
};

// Component usage:
export class UserCardComponent {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
}`,
      quizTips: [
        'input<T>(defaultValue) creates signal inputs; input.required<T>() enforces required props.',
        'output<T>() replaces EventEmitter without RxJS Subject overhead.',
        'viewChild.required<ElementRef>("ref") queries template DOM nodes as reactive signals.'
      ]
    },
    {
      id: 'signals',
      pillarNumber: 2,
      title: 'Signals, Computed Derivations & Linked Signals',
      category: 'SIGNALS & STATE',
      icon: '⚡',
      summary: 'Fine-grained glitch-free reactivity where signals drive state derivations and surgical DOM updates without full tree dirty-checking.',
      rules: [
        'Pure Computed Derivations — computed() must be strictly read-only and pure; NEVER write to signals inside computed().',
        'Immutable Signal Updates — Always update arrays/objects immutably: signal.update(prev => [...prev, newItem]) for Object.is reactivity.',
        'Side Effects in effect() — Use effect() strictly for logging, local storage sync, or canvas paints, wrapping non-dependencies in untracked().'
      ],
      codeExample: `// Shopping Cart State Derivation
readonly cartItems = signal<CartItem[]>([]);
readonly taxRate = signal<number>(0.08);

// Auto-derived memoized subtotal & total
readonly subtotal = computed(() =>
  this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
);
readonly grandTotal = computed(() =>
  this.subtotal() * (1 + this.taxRate())
);

// Resetting dependent state on selection change (Angular 19)
readonly selectedCourseId = signal<string>('course-1');
readonly selectedLessonId = linkedSignal({
  source: this.selectedCourseId,
  computation: (courseId) => this.getFirstLessonId(courseId)
});`,
      quizTips: [
        'Reading signals inside templates requires parentheses: {{ count() }} (missing () is the most common bug).',
        'model() creates two-way signal bindings [(prop)]="parentVal".',
        'toSignal(obs$, { initialValue }) bridges RxJS streams to Signals.'
      ]
    },
    {
      id: 'architecture',
      pillarNumber: 3,
      title: 'FAOS Boundary Rules & Smart/Dumb Separation',
      category: 'ARCHITECTURE',
      icon: '🏢',
      summary: 'Feature-Atomic Architecture isolates each domain inside /features/xxx, preventing circular dependencies and spaghetti coupling.',
      rules: [
        'Strict Feature Isolation — Feature A cannot import components or internal code from Feature B; shared logic belongs in /shared or /core.',
        'Smart vs. Dumb UI — Dumb components in /shared/ui receive data via input() and emit output(), never injecting domain services directly.',
        'Virtual Scrolling for Large Lists — Use CDK Virtual Scrolling for 1,000+ items to render only visible viewport DOM nodes.'
      ],
      codeExample: `// 1. Dumb Component (/shared/ui/button/button.component.ts)
@Component({
  selector: 'app-button',
  template: \`<button [disabled]="disabled()" (click)="clicked.emit()"><ng-content /></button>\`
})
export class ButtonComponent {
  readonly disabled = input<boolean>(false);
  readonly clicked = output<void>();
}

// 2. Smart Component (/features/orders/views/orders-view.component.ts)
export class OrdersViewComponent {
  private readonly orderService = inject(OrderService);
  readonly ordersQuery = this.orderService.getOrdersQuery();
}`,
      quizTips: [
        'ViewEncapsulation.None is used only when overriding third-party CSS globally.',
        'Multi-slot projection uses <ng-content select="[slot-name]" />.',
        'Responsive sidebar state is best managed via a lightweight signal UI state service.'
      ]
    },
    {
      id: 'routing',
      pillarNumber: 4,
      title: 'Functional Routing, Lazy Loading & Guards',
      category: 'ROUTING',
      icon: '🧭',
      summary: 'Declarative route configuration with automatic code splitting, functional guards, and signal-bound URL parameters.',
      rules: [
        'Lazy Component Loading — Use loadComponent: () => import(...) to split routes into independent chunks on-demand.',
        'Input Binding — Enable withComponentInputBinding() in provideRouter() so route params bind directly to signal input().',
        'Functional CanActivateFn — Return boolean or UrlTree for synchronous redirects without boilerplate guard classes.'
      ],
      codeExample: `// app.routes.ts
export const routes: Routes = [
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'dashboard' } // Wildcard fallback
];

// Functional Auth Guard
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};`,
      quizTips: [
        'CanDeactivateFn prevents accidental navigation with unsaved form changes.',
        'withPreloading(PreloadAllModules) prefetches lazy chunks in background idle time.',
        'routerLinkActive="active-class" highlights active sidebar navigation links.'
      ]
    },
    {
      id: 'forms',
      pillarNumber: 5,
      title: 'Reactive Forms, Custom Validators & FormArrays',
      category: 'FORMS',
      icon: '📝',
      summary: 'Type-safe Reactive Forms with enterprise regex validators, cross-field validation, and dynamic FormArrays.',
      rules: [
        'Strict RFC Email Regex — Use Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/) rather than loose HTML5 Validators.email.',
        'Cross-Field Validation — Attach password-matching validators to the parent FormGroup level, not child controls.',
        'Dynamic Arrays — Use FormArray for dynamic line items (invoices, tags) with .push() and .removeAt().'
      ],
      codeExample: `// Password Matching Custom Validator
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
};

export class RegisterFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchValidator });
}`,
      quizTips: [
        'Display validation errors only when control.touched && control.invalid.',
        'form.markAllAsTouched() triggers validation error visibility on un-filled submit clicks.',
        'form.patchValue() allows partial updates; setValue() requires all keys.'
      ]
    },
    {
      id: 'http_query',
      pillarNumber: 6,
      title: 'Full-Stack HTTP, TanStack Query & Interceptors',
      category: 'HTTP & QUERY',
      icon: '🌐',
      summary: 'Reactive server-state management combining functional HTTP interceptors with TanStack Query caching and mutation invalidation.',
      rules: [
        'Immutable Interceptors — HttpRequest instances are immutable; clone with req.clone({ setHeaders: { ... } }).',
        'Post-Mutation Invalidation — After a successful POST/PUT/DELETE mutation, call queryClient.invalidateQueries({ queryKey }) to trigger auto-refetch.',
        'Autocomplete Cancellation — Use RxJS switchMap() to automatically cancel stale in-flight requests on new keystrokes.'
      ],
      codeExample: `// Functional HTTP Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).accessToken();
  const cloned = req.clone({
    setHeaders: {
      'x-tenant-id': 'angular-v4',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {})
    }
  });
  return next(cloned);
};

// TanStack Query Mutation in Component
const mutation = injectMutation(() => ({
  mutationFn: (newPost) => this.postService.create(newPost),
  onSuccess: () => {
    this.queryClient.invalidateQueries({ queryKey: ['posts'] });
  }
}));`,
      quizTips: [
        'Global 401 Unauthorized handling belongs in an HTTP interceptor catchError block.',
        'Combine WebSockets with slow polling as a resilient fallback.',
        'retry({ count: 2, delay: 1000 }) retries failed GET requests.'
      ]
    },
    {
      id: 'performance',
      pillarNumber: 7,
      title: 'Performance, @defer Chunking & OnPush',
      category: 'PERFORMANCE',
      icon: '🏎️',
      summary: 'Maximizing Core Web Vitals using native @defer lazy loading, OnPush change detection, and NgOptimizedImage.',
      rules: [
        'Deferred Below-The-Fold Views — Use @defer (on viewport) for heavy charts, reviews, and comments.',
        'Unique Identity in @for — Always track items by unique ID (@for (item of items; track item.id)) instead of $index.',
        'Prevent Layout Shift (CLS) — Use <img [ngSrc]="url" width="w" height="h" priority /> with NgOptimizedImage.'
      ],
      codeExample: `@defer (on viewport; prefetch on idle) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder">Scroll into view to load interactive chart...</div>
} @loading (minimum 500ms) {
  <div class="skeleton-shimmer">Loading visualization...</div>
} @error {
  <div class="error-box">Failed to load chart bundle.</div>
}`,
      quizTips: [
        'ChangeDetectionStrategy.OnPush skips checks unless inputs change or signals notify.',
        'provideClientHydration() enables non-destructive SSR DOM hydration without flickering.',
        'Use ng build --stats-json to inspect JavaScript chunk bundle sizes.'
      ]
    },
    {
      id: 'testing',
      pillarNumber: 8,
      title: 'TestBed Signal Testing & HttpTestingController',
      category: 'TESTING',
      icon: '🧪',
      summary: 'Unit testing reactive signals, isolated functional guards, and mocked HTTP network calls with TestBed.',
      rules: [
        'Testing Signal Transitions — Update signal with component.count.set(5), call fixture.detectChanges(), and assert the DOM text.',
        'Mocking Backend Network — Use provideHttpClientTesting() and HttpTestingController to intercept and flush mock HTTP responses.',
        'Testing Functional Guards — Execute guards in isolation using TestBed.runInInjectionContext(() => myGuard(route, state)).'
      ],
      codeExample: `it('should recalculate total price on qty change', () => {
  const fixture = TestBed.createComponent(CartComponent);
  const comp = fixture.componentInstance;
  comp.unitPrice.set(50);
  comp.quantity.set(3);
  fixture.detectChanges();
  expect(comp.totalPrice()).toBe(150);
  expect(fixture.nativeElement.querySelector('.total').textContent).toContain('$150');
});`,
      quizTips: [
        'triggerEventHandler("click", null) simulates DOM button clicks in unit tests.',
        'Test computed signals by modifying dependency inputs and asserting derived output.'
      ]
    },
    {
      id: 'security',
      pillarNumber: 9,
      title: 'Enterprise Security, XSS & Auth Cookies',
      category: 'SECURITY',
      icon: '🔒',
      summary: 'Protecting applications from XSS, CSRF, and unauthorized access using HTTP-Only cookies and strict route guards.',
      rules: [
        'HTTP-Only SameSite Cookies — Store JWT session tokens in HTTP-Only cookies to make them immune to malicious JavaScript XSS extraction.',
        'Template Sanitization — Angular automatically sanitizes {{ interpolations }}; use DomSanitizer.bypassSecurityTrustHtml() only for verified CMS HTML.',
        'CORS Preflight Headers — Express API must explicitly allowlist custom headers (like x-tenant-id) in Access-Control-Allow-Headers.'
      ],
      codeExample: `// Role-based Route Guard Factory
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.user()?.role === requiredRole ? true : router.createUrlTree(['/unauthorized']);
  };
};`,
      quizTips: [
        'Never store sensitive passwords or access tokens in unencrypted localStorage.',
        'Sanitize external user URLs before passing to href bindings.'
      ]
    },
    {
      id: 'debugging',
      pillarNumber: 10,
      title: 'Production Diagnostics & Debugging Scenarios',
      category: 'DEBUGGING',
      icon: '🔍',
      summary: 'Diagnosing common runtime pitfalls: missing signal parentheses, eager import chunk leaks, and NGINX SPA routing.',
      rules: [
        'Signal Parentheses Omission — If the UI does not update on signal change, verify the template calls mySignal() instead of mySignal.',
        'Lazy Chunk Bundling Leak — If a lazy component is bundled into main.js, check for direct static imports in eager components (like app.component).',
        'NGINX SPA Deep Links — Configure try_files $uri $uri/ /index.html; in NGINX so page refreshes on /users/123 do not return 404.'
      ],
      codeExample: `// NGINX Reverse Proxy SPA Configuration
server {
    listen 80;
    server_name my-app.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # Fallback to Angular Router
    }

    location /api/ {
        proxy_pass http://localhost:3002;
    }
}`,
      quizTips: [
        'If form.invalid === true with all visible inputs valid, inspect form.controls for hidden or sub-group controls.',
        'If interceptor headers are missing in backend logs, verify req.clone({ setHeaders }) was returned into next(clonedReq).'
      ]
    }
  ];

  readonly filteredPillars = computed(() => {
    let list = this.pillars;
    const selected = this.selectedPillarId();
    if (selected !== 'ALL') {
      list = list.filter(p => p.id === selected);
    }
    const search = this.searchTerm().toLowerCase();
    if (search) {
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(search) ||
          p.summary.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.rules.some(r => r.toLowerCase().includes(search)) ||
          p.quizTips.some(t => t.toLowerCase().includes(search))
      );
    }
    return list;
  });
}
