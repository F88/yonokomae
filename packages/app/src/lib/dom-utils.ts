export function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (el.isContentEditable) return true;
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}
