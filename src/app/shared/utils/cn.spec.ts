import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4 py-2', 'bg-blue-500');
    expect(result).toBe('px-4 py-2 bg-blue-500');
  });

  it('handles conflicting tailwind classes with twMerge', () => {
    const result = cn('px-2 px-4');
    expect(result).toBe('px-4');
  });

  it('handles conditional classes properly', () => {
    const isHidden = false;
    const isVisible = true;
    const result = cn('base', isHidden && 'hidden', isVisible && 'block');
    expect(result).toBe('base block');
  });
});
