export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCode(content: string, language: string): ValidationResult {
  const errors: string[] = [];

  if (!content.trim()) {
    return { valid: false, errors: ['Code block is empty.'] };
  }

  if (language === 'html' || content.includes('<html')) {
    const tags = ['div', 'span', 'p', 'table', 'script', 'style', 'body', 'html'];
    tags.forEach(tag => {
      const openRegex = new RegExp('<' + tag + '[^>]*>', 'gi');
      const closeRegex = new RegExp('</' + tag + '>', 'gi');
      const openCount = (content.match(openRegex) || []).length;
      const closeCount = (content.match(closeRegex) || []).length;
      if (openCount !== closeCount) {
        errors.push('Unmatched <' + tag + '> tag count (Opened: ' + openCount + ', Closed: ' + closeCount + ')');
      }
    });
  }

  const stack: string[] = [];
  const pairs: Record<string, string> = { '{': '}', '(': ')', '[': ']' };
  for (const char of content) {
    if (['{', '(', '['].includes(char)) stack.push(char);
    if (['}', ')', ']'].includes(char)) {
      const last = stack.pop();
      if (!last || pairs[last] !== char) {
        errors.push("Mismatched bracket '" + char + "' detected.");
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
