// Netlify Function: gc-link.js
// Creates a GoCardless requisition for Revolut UK and returns the OAuth link.
// The user clicks the link, logs into Revolut, then gets redirected back to the app.

const REVOLUT_GB_ID = 'REVOLUT_REVOGB21'; // GoCardless institution ID for Revolut UK

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const { token, redirect_url } = JSON.parse(event.body || '{}');
  if (!token || !redirect_url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing token or redirect_url' }) };
  }

  // Create agreement (90-day access, transactions + balances)
  const agrResp = await fetch('https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      institution_id: REVOLUT_GB_ID,
      max_historical_days: 90,
      access_valid_for_days: 90,
      access_scope: ['balances', 'details', 'transactions']
    })
  });
  const agr = await agrResp.json();
  if (!agrResp.ok) return { statusCode: agrResp.status, body: JSON.stringify(agr) };

  // Create requisition
  const reqResp = await fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      redirect: redirect_url,
      institution_id: REVOLUT_GB_ID,
      reference: 'juddbos-' + Date.now(),
      agreement: agr.id,
      user_language: 'EN'
    })
  });
  const req = await reqResp.json();
  if (!reqResp.ok) return { statusCode: reqResp.status, body: JSON.stringify(req) };

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ link: req.link, requisition_id: req.id })
  };
};
