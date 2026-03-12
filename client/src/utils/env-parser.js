/**
 * Resolve environment variables in a string.
 * Variables use the {{varName}} syntax.
 * @param {string} text - The template string
 * @param {Array<{key, value, localValue}>} variables - Environment variable list
 * @returns {string} - String with variables resolved
 */
export function resolveEnvVars(text, variables = []) {
  if (!text) return text;
  return text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const variable = variables.find((v) => v.key === key.trim());
    if (!variable) return match; // leave unresolved if not found
    // Prefer localValue if set, fall back to shared value
    return variable.localValue !== undefined && variable.localValue !== ''
      ? variable.localValue
      : variable.value;
  });
}

/**
 * Resolve all template variables in a request object before executing.
 */
export function resolveRequest(request, variables = []) {
  const resolve = (s) => resolveEnvVars(s, variables);

  return {
    ...request,
    url: resolve(request.url),
    headers: (request.headers || [])
      .filter((h) => h.active !== false)
      .reduce((acc, h) => {
        acc[resolve(h.key)] = resolve(h.value);
        return acc;
      }, {}),
    body: request.body?.type === 'none' ? null : resolve(
      typeof request.body?.content === 'string'
        ? request.body.content
        : JSON.stringify(request.body?.content)
    ),
  };
}
