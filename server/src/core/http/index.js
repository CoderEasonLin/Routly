import fetch from 'node-fetch';

/**
 * Execute an HTTP request and return a structured response.
 * @param {object} request - Request entity from data model
 * @param {object} resolvedHeaders - Headers with env vars resolved
 * @param {string} resolvedUrl - URL with env vars resolved
 * @param {string|null} body - Serialized body string
 */
export async function executeRequest({ method, resolvedUrl, resolvedHeaders, body }) {
  const start = Date.now();

  const options = {
    method: method.toUpperCase(),
    headers: resolvedHeaders,
  };

  if (body && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    options.body = body;
  }

  const response = await fetch(resolvedUrl, options);
  const elapsed = Date.now() - start;

  const responseHeaders = {};
  response.headers.forEach((value, key) => { responseHeaders[key] = value; });

  let responseBody;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: responseBody,
    elapsedMs: elapsed,
  };
}
