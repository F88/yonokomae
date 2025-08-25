let counter = 0;

export function uid(prefix = 'id'): string {
  counter += 1;
  const ts = Date.now().toString(36);
  return `${prefix}-${ts}-${counter}`;
}
