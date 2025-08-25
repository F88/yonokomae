# PR Title Guidelines

## Purpose
Good PR titles help team members quickly understand what changes are being made and their impact. This document provides guidelines for creating clear, informative PR titles.

## Best Practices

### 1. Use Imperative Mood
Write titles as if you're giving a command or instruction.

✅ **Good:**
- `Add user authentication system`
- `Fix layout responsiveness on mobile devices`
- `Update dependencies to latest versions`

❌ **Bad:**
- `Added user authentication system`
- `Fixed layout responsiveness`
- `Dependencies updated`

### 2. Be Specific and Descriptive
Include enough detail to understand the change without reading the description.

✅ **Good:**
- `Fix battle result calculation for edge cases`
- `Add TypeScript support for Judge component tests`
- `Improve FrontlineJournalist power generation randomness`

❌ **Bad:**
- `Fix bug`
- `Add tests`
- `Improve code`

### 3. Use Conventional Commit Format (Optional)
Consider using prefixes to categorize changes:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
- `feat: Add battle replay functionality`
- `fix: Resolve power calculation overflow in Judge class`
- `docs: Update README with deployment instructions`
- `test: Add comprehensive coverage for battle scenarios`

### 4. Keep It Concise
Aim for 50-72 characters. GitHub truncates titles longer than 72 characters.

✅ **Good:**
- `feat: Add battle result persistence to localStorage`

❌ **Bad:**
- `feat: Add comprehensive battle result persistence functionality that saves results to localStorage and provides retrieval mechanisms`

### 5. Avoid Generic Terms
Be specific about what was changed rather than using vague terms.

✅ **Good:**
- `Refactor FrontlineJournalist to use factory pattern`
- `Optimize battle rendering performance`

❌ **Bad:**
- `Refactor code`
- `Improve performance`
- `Update code`

## Examples from This Repository

### Good Examples:
- `Implement basic features` - Clear action and scope
- `Add metadata and package configuration files; update Judge tests for improved clarity and coverage` - Specific about multiple changes
- `Fix layouts` - Clear and concise

### Areas for Improvement:
- `Initial plan` - Too generic, doesn't describe any actual changes

## Quick Checklist
Before submitting your PR, ask yourself:

- [ ] Does the title use imperative mood?
- [ ] Is it specific about what changed?
- [ ] Is it under 72 characters?
- [ ] Would someone understand the change without reading the description?
- [ ] Does it avoid generic terms like "fix", "update", "improve" without context?

## Additional Resources
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Writing Good Commit Messages](https://chris.beams.io/posts/git-commit/)