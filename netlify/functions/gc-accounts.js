// Netlify Function: gc-accounts.js
// After the user has authenticated with Revolut, fetches their account IDs.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { token, requisition_id } = JSON.parse(event.body || '{}');
  if (!token || !requisition_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing params' }) };
  }

  const resp = await fetch(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisition_id}/`, {
    headers: { 'authorization': `Bearer ${token}`, 'accept': 'application/json' }
  });
  const data = await resp.json();
  if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify(data) };

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ account_ids: data.accounts || [] })
  };
};
