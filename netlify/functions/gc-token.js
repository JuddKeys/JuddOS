// Netlify Function: gc-token.js
// Gets a short-lived GoCardless access token using your secret credentials.
// These credentials are passed from the browser (stored in the user's localStorage).

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { secret_id, secret_key } = JSON.parse(event.body || '{}');
  if (!secret_id || !secret_key) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing credentials' }) };
  }

  const resp = await fetch('https://bankaccountdata.gocardless.com/api/v2/token/new/', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({ secret_id, secret_key })
  });

  const data = await resp.json();
  if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify(data) };

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ access: data.access, refresh: data.refresh })
  };
};
