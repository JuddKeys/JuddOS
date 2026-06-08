// Netlify Function: gc-balance.js
// Fetches the current GBP balance for a given account.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { token, account_id } = JSON.parse(event.body || '{}');
  if (!token || !account_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing params' }) };
  }

  const resp = await fetch(`https://bankaccountdata.gocardless.com/api/v2/accounts/${account_id}/balances/`, {
    headers: { 'authorization': `Bearer ${token}`, 'accept': 'application/json' }
  });
  const data = await resp.json();
  if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify(data) };

  // Find the most useful balance (closing available, then interimAvailable, then expected)
  const priority = ['closingAvailable', 'interimAvailable', 'expected', 'closingBooked', 'interimBooked'];
  let balance = 0;
  for (const type of priority) {
    const found = (data.balances || []).find(b => b.balanceType === type);
    if (found) {
      balance = parseFloat(found.balanceAmount.amount);
      break;
    }
  }

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ balance_gbp: balance })
  };
};
