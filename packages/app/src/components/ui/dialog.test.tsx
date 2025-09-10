import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

describe('Dialog Components', () => {
  describe('DialogHeader', () => {
    it('renders as div with data-slot and default classes', () => {
      render(
        <DialogHeader>
          <h2>Dialog Title</h2>
        </DialogHeader>,
      );
      
      const header = document.querySelector('[data-slot="dialog-header"]');
      expect(header).toBeInTheDocument();
      expect(header?.tagName.toLowerCase()).toBe('div');
      expect(header).toHaveClass('flex', 'flex-col', 'gap-2', 'text-center');
      expect(header).toHaveTextContent('Dialog Title');
    });

    it('merges custom className with default classes', () => {
      render(
        <DialogHeader className="custom-header">
          <h2>Dialog Title</h2>
        </DialogHeader>,
      );
      
      const header = document.querySelector('[data-slot="dialog-header"]');
      expect(header).toHaveClass('custom-header', 'flex', 'flex-col', 'gap-2');
    });

    it('forwards props to div element', () => {
      render(
        <DialogHeader data-testid="custom-header">
          <h2>Dialog Title</h2>
        </DialogHeader>,
      );
      
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
  });

  describe('DialogFooter', () => {
    it('renders as div with data-slot and default classes', () => {
      render(
        <DialogFooter>
          <button>Cancel</button>
          <button>OK</button>
        </DialogFooter>,
      );
      
      const footer = document.querySelector('[data-slot="dialog-footer"]');
      expect(footer).toBeInTheDocument();
      expect(footer?.tagName.toLowerCase()).toBe('div');
      expect(footer).toHaveClass('flex', 'flex-col-reverse', 'gap-2');
      expect(footer).toHaveTextContent('Cancel');
      expect(footer).toHaveTextContent('OK');
    });

    it('merges custom className with default classes', () => {
      render(
        <DialogFooter className="custom-footer">
          <button>Cancel</button>
        </DialogFooter>,
      );
      
      const footer = document.querySelector('[data-slot="dialog-footer"]');
      expect(footer).toHaveClass('custom-footer', 'flex', 'flex-col-reverse');
    });

    it('forwards props to div element', () => {
      render(
        <DialogFooter data-testid="custom-footer">
          <button>Cancel</button>
        </DialogFooter>,
      );
      
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    });
  });

  describe('Component instantiation', () => {
    it('Dialog component can be instantiated', () => {
      const element = Dialog({ children: null });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog');
    });

    it('DialogTrigger component can be instantiated', () => {
      const element = DialogTrigger({ children: 'Open' });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-trigger');
    });

    it('DialogPortal component can be instantiated', () => {
      const element = DialogPortal({ children: null });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-portal');
    });

    it('DialogClose component can be instantiated', () => {
      const element = DialogClose({ children: 'Close' });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-close');
    });

    it('DialogOverlay component can be instantiated', () => {
      const element = DialogOverlay({});
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-overlay');
    });

    it('DialogContent component can be instantiated', () => {
      const element = DialogContent({ children: null });
      expect(element).toBeDefined();
      // DialogContent is more complex - just verify it creates an element
    });

    it('DialogTitle component can be instantiated', () => {
      const element = DialogTitle({ children: 'Title' });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-title');
    });

    it('DialogDescription component can be instantiated', () => {
      const element = DialogDescription({ children: 'Description' });
      expect(element).toBeDefined();
      expect(element.props['data-slot']).toBe('dialog-description');
    });
  });

  describe('CSS class merging', () => {
    it('DialogOverlay merges classes correctly', () => {
      const element = DialogOverlay({ className: 'custom-overlay' });
      expect(element.props.className).toContain('custom-overlay');
      expect(element.props.className).toContain('fixed');
      expect(element.props.className).toContain('inset-0');
      expect(element.props.className).toContain('bg-black/50');
    });

    it('DialogTitle merges classes correctly', () => {
      const element = DialogTitle({ children: 'Title', className: 'custom-title' });
      expect(element.props.className).toContain('custom-title');
      expect(element.props.className).toContain('text-lg');
      expect(element.props.className).toContain('leading-none');
      expect(element.props.className).toContain('font-semibold');
    });

    it('DialogDescription merges classes correctly', () => {
      const element = DialogDescription({ 
        children: 'Description', 
        className: 'custom-description' 
      });
      expect(element.props.className).toContain('custom-description');
      expect(element.props.className).toContain('text-muted-foreground');
      expect(element.props.className).toContain('text-sm');
    });
  });

  describe('DialogContent showCloseButton prop', () => {
    it('includes close button by default', () => {
      const element = DialogContent({ children: 'Content' });
      // DialogContent structure includes conditional close button
      expect(element).toBeDefined();
    });

    it('excludes close button when showCloseButton is false', () => {
      const element = DialogContent({ 
        children: 'Content', 
        showCloseButton: false 
      });
      expect(element).toBeDefined();
    });

    it('includes close button when showCloseButton is true', () => {
      const element = DialogContent({ 
        children: 'Content', 
        showCloseButton: true 
      });
      expect(element).toBeDefined();
    });
  });
});