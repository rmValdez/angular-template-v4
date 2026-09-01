import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ============================================================================
 * MODERN ANGULAR 19 SIGNAL INPUTS, OUTPUTS & TWO-WAY MODEL
 * ============================================================================
 * Replaces legacy @Input() and @Output() decorators with type-safe Signal APIs:
 * - input.required<T>()  -> Read-only signal input
 * - model<T>()           -> Two-way writable signal model (banana-in-a-box)
 * - output<T>()          -> Signal-based custom event emitter
 */
@Component({
  selector: 'app-signal-child-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 rounded-xl bg-accent/30 border border-border/60 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono font-bold text-primary">CHILD COMPONENT</span>
        <span class="text-[10px] bg-primary/10 text-primary font-mono px-2 py-0.5 rounded">
          input() + model() + output()
        </span>
      </div>

      <div>
        <h4 class="text-sm font-bold text-foreground">{{ title() }}</h4>
        <p class="text-xs text-muted-foreground">{{ subtitle() }}</p>
      </div>

      <!-- Two-Way Signal Model (banana-in-a-box [(score)] ) -->
      <div class="flex items-center justify-between bg-background p-3 rounded-lg border">
        <span class="text-xs font-semibold">Shared Score (Two-Way Model):</span>
        <div class="flex items-center gap-2">
          <button
            (click)="decrement()"
            class="h-7 w-7 rounded bg-accent border font-bold text-xs hover:bg-accent/80"
          >-</button>
          <span class="font-mono font-bold text-sm text-primary w-8 text-center">{{ score() }}</span>
          <button
            (click)="increment()"
            class="h-7 w-7 rounded bg-accent border font-bold text-xs hover:bg-accent/80"
          >+</button>
        </div>
      </div>

      <!-- Output Event Trigger -->
      <button
        (click)="notifyParent()"
        class="w-full py-2 bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold rounded-lg border border-primary/30 transition-colors"
      >
        📢 Emit Output Event to Parent
      </button>
    </div>
  `
})
export class SignalChildDemoComponent {
  // 1. Read-only Signal Inputs (Replaces @Input)
  readonly title = input.required<string>();
  readonly subtitle = input<string>('Default Subtitle from Child');

  // 2. Two-Way Model Signal (Replaces @Input() + @Output() combo)
  readonly score = model<number>(0);

  // 3. Signal Output (Replaces @Output() EventEmitter)
  readonly messageSent = output<string>();

  increment() {
    this.score.update(s => s + 1);
  }

  decrement() {
    this.score.update(s => Math.max(0, s - 1));
  }

  notifyParent() {
    this.messageSent.emit(`Child emitted event with current score: ${this.score()}`);
  }
}
