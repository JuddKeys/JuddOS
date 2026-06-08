// Netlify Function: deploy.js
// Accepts POST {secret, content, filename} → commits to GitHub → Netlify auto-deploys

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch(e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { secret, content, filename = 'index.html' } = body;

  if (secret !== process.env.DEPLOY_SECRET) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  if (!content) return { statusCode: 400, body: JSON.stringify({ error: 'No content' }) };

  const TOKEN  = process.env.GITHUB_TOKEN;
  const OWNER  = 'JuddKeys';
  const REPO   = 'JuddOS';
  const API    = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filename}`;
  const HDRS   = { 'Authorization': `token ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json', 'User-Agent': 'JuddOS-Deploy' };

  try {
    const getRes = await fetch(API, { headers: HDRS });
    let sha;
    if (getRes.ok) { sha = (await getRes.json()).sha; }

    const putRes = await fetch(API, {
      method: 'PUT', headers: HDRS,
      body: JSON.stringify({ message: `Claude update — ${new Date().toUTCString()}`, content: Buffer.from(content).toString('base64'), ...(sha && { sha }) })
    });

    if (!putRes.ok) { const e = await putRes.json(); return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'GitHub commit failed', details: e }) }; }

    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ success: true, file: filename }) };
  } catch(err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) };
  }
};
