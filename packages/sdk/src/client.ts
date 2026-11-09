import { CounterError } from './errors.js';

interface CountResponse {
  count: number;
}

export async function registerAndFetchCount(
  apiUrl: string,
  siteId: string,
  visitorId: string,
): Promise<number> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl.replace(/\/$/, '')}/v1/visitors`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ siteId, visitorId }),
    });
  } catch {
    throw new CounterError('Could not reach the visitor counter API.');
  }

  if (!response.ok) {
    throw new CounterError(`Visitor counter API returned HTTP ${response.status}.`);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== 'object' ||
    result === null ||
    !('count' in result) ||
    typeof (result as CountResponse).count !== 'number'
  ) {
    throw new CounterError('Visitor counter API returned an invalid count response.');
  }
  return (result as CountResponse).count;
}
