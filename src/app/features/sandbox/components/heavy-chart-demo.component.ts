import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heavy-chart-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-5 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="text-xs font-mono font-bold text-emerald-400">LAZY LOADED CHUNK</span>
        </div>
        <span class="text-[10px] font-mono text-slate-400">Loaded via &#64;defer</span>
      </div>

      <div>
        <h4 class="text-sm font-bold text-slate-100">Simulated Heavy Analytics Engine</h4>
        <p class="text-xs text-slate-400">This bundle was deferred and downloaded asynchronously only when triggered!</p>
      </div>

      <!-- Chart Simulation -->
      <div class="h-32 flex items-end gap-2 pt-4 border-t border-slate-800">
        @for (val of [40, 65, 30, 85, 95, 75, 110, 130]; track $index) {
          <div class="flex-1 flex flex-col items-center gap-1 justify-end h-full">
            <div
              class="w-full bg-gradient-to-t from-primary to-cyan-400 rounded-t transition-all duration-500"
              [style.height.%]="(val / 130) * 90"
            ></div>
            <span class="text-[9px] text-slate-500 font-mono">Q{{ $index + 1 }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class HeavyChartDemoComponent {
  readonly loadedAt = signal(new Date().toLocaleTimeString());
}
