import { Component, input, output, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn } from '../../utils/cn';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-xs font-semibold text-foreground/80 tracking-wide select-none">
          {{ label() }}
        </label>
      }
      <div class="relative">
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled() || isDisabledSignal()"
          [value]="valueSignal()"
          [class]="inputClasses()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>
      @if (error()) {
        <p class="text-xs font-medium text-destructive mt-0.5">
          {{ error() }}
        </p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly error = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly className = input<string>('');

  readonly valueChange = output<string>();

  readonly valueSignal = signal<string>('');
  readonly isDisabledSignal = signal<boolean>(false);

  readonly inputClasses = computed(() =>
    cn(
      'flex h-10 w-full min-w-0 max-w-full box-border rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150',
      this.error() ? 'border-destructive focus-visible:ring-destructive' : '',
      this.className()
    )
  );

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.valueSignal.set(value || '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledSignal.set(isDisabled);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueSignal.set(target.value);
    this.onChange(target.value);
    this.valueChange.emit(target.value);
  }
}
