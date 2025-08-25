import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge single class string', () => {
    const result = cn('bg-red-500');
    expect(result).toBe('bg-red-500');
  });

  it('should merge multiple class strings', () => {
    const result = cn('bg-red-500', 'text-white', 'p-4');
    expect(result).toBe('bg-red-500 text-white p-4');
  });

  it('should handle conditional classes with clsx', () => {
    const result = cn('base-class', {
      'active-class': true,
      'inactive-class': false,
    });
    expect(result).toBe('base-class active-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['bg-red-500', 'text-white'], 'p-4');
    expect(result).toBe('bg-red-500 text-white p-4');
  });

  it('should merge tailwind classes correctly and remove conflicts', () => {
    const result = cn('bg-red-500 bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });

  it('should handle padding conflicts', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should handle margin conflicts', () => {
    const result = cn('m-2', 'm-4');
    expect(result).toBe('m-4');
  });

  it('should preserve non-conflicting classes', () => {
    const result = cn('bg-red-500', 'text-white', 'bg-blue-500');
    expect(result).toBe('text-white bg-blue-500');
  });

  it('should handle undefined values', () => {
    const result = cn('base-class', undefined, 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle null values', () => {
    const result = cn('base-class', null, 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle empty strings', () => {
    const result = cn('base-class', '', 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle false boolean values', () => {
    const condition = false;
    const result = cn('base-class', condition && 'conditional-class', 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle true boolean values with conditional', () => {
    const condition = true;
    const result = cn('base-class', condition && 'conditional-class', 'another-class');
    expect(result).toBe('base-class conditional-class another-class');
  });

  it('should handle complex nested conditions', () => {
    const isActive = true;
    const isDisabled = false;
    const size = 'large';
    
    const result = cn(
      'base-button',
      {
        'active': isActive,
        'disabled': isDisabled,
      },
      size === 'large' && 'text-lg',
      size !== 'large' && 'text-sm'
    );
    
    expect(result).toBe('base-button active text-lg');
  });

  it('should handle responsive classes without conflicts', () => {
    const result = cn('p-4 md:p-8 lg:p-12');
    expect(result).toBe('p-4 md:p-8 lg:p-12');
  });

  it('should merge hover states correctly', () => {
    const result = cn('hover:bg-red-500', 'hover:bg-blue-500');
    expect(result).toBe('hover:bg-blue-500');
  });

  it('should handle arbitrary values', () => {
    const result = cn('w-[100px]', 'w-[200px]');
    expect(result).toBe('w-[200px]');
  });

  it('should return empty string when no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle all falsy values', () => {
    const result = cn(false, null, undefined, '', 0);
    expect(result).toBe('');
  });
});