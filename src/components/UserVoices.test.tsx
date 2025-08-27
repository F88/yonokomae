import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserVoices } from './UserVoices';

describe('UserVoices', () => {
  it('renders user voices', () => {
    render(<UserVoices />);
    expect(screen.getByLabelText('User voices marquee')).toBeInTheDocument();
  });

  it('renders with custom aria label', () => {
    render(<UserVoices ariaLabel="Custom user voices" />);
    expect(screen.getByLabelText('Custom user voices')).toBeInTheDocument();
  });
});
