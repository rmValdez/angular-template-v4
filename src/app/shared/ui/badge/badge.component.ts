import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="classes()">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  readonly variant = input<'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'>('default');
  readonly className = input<string>('');

  readonly classes = computed(() => {
    const variantClasses = {
      default: 'bg-primary/10 text-primary border-primary/20',
      secondary: 'bg-secondary text-secondary-foreground border-transparent',
      outline: 'text-foreground border-border',
      destructive: 'bg-destructive/10 text-destructive border-destructive/20',
      success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    };

    return cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
      variantClasses[this.variant()],
      this.className()
    );
  });
}
