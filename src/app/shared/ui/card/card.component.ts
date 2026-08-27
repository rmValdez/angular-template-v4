import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  readonly className = input<string>('');
  readonly classes = computed(() =>
    cn(
      'rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-border',
      this.className()
    )
  );
}
