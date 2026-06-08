// Netlify Function: gc-transactions.js
// Fetches booked transactions for an account for the last 30 days.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { token, account_id } = JSON.parse(event.body || '{}');
  if (!token || !account_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing params' }) };
  }

  // GoCardless supports date_from / date_to query params
  const dateTo = new Date().toISOString().slice(0,10);
  const dateFrom = new Date(Date.now() - 30 * 864e5).toISOString().slice(0,10);

  const resp = await fetch(
    `https://bankaccountdata.gocardless.com/api/v2/accounts/${account_id}/transactions/?date_from=${dateFrom}&date_to=${dateTo}`,
    { headers: { 'authorization': `Bearer ${token}`, 'accept': 'application/json' } }
  );
  const data = await resp.json();
  if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify(data) };

  const booked = data.transactions?.booked || [];

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ transactions: booked })
  };
};
