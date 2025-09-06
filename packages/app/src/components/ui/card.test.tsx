import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with correct data attributes and classes', () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-slot', 'card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'gap-6',
        'rounded-xl',
        'border',
        'py-6',
        'shadow-sm',
      );
    });

    it('accepts custom className', () => {
      render(<Card className="custom-class" data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('renders with correct data attributes and classes', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'card-header');
      expect(header).toHaveClass(
        '@container/card-header',
        'grid',
        'auto-rows-min',
      );
    });
  });

  describe('CardTitle', () => {
    it('renders with correct data attribute', () => {
      render(<CardTitle data-testid="title">Title content</CardTitle>);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'card-title');
      expect(title).toHaveTextContent('Title content');
    });
  });

  describe('CardDescription', () => {
    it('renders with correct data attribute', () => {
      render(
        <CardDescription data-testid="description">
          Description content
        </CardDescription>,
      );

      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'card-description');
      expect(description).toHaveTextContent('Description content');
    });
  });

  describe('CardAction', () => {
    it('renders with correct data attribute and positioning classes', () => {
      render(<CardAction data-testid="action">Action content</CardAction>);

      const action = screen.getByTestId('action');
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute('data-slot', 'card-action');
      expect(action).toHaveClass(
        'col-start-2',
        'row-span-2',
        'row-start-1',
        'self-start',
        'justify-self-end',
      );
    });
  });

  describe('CardContent', () => {
    it('renders with correct data attribute and padding', () => {
      render(<CardContent data-testid="content">Content</CardContent>);

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'card-content');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('renders with correct data attribute and flexbox classes', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);

      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
      expect(footer).toHaveClass('flex', 'items-center', 'px-6');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Main card content goes here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>,
      );

      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(
        screen.getByText('Main card content goes here'),
      ).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });
});
