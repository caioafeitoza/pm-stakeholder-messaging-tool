const http = require('http');

function postRequest(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(body);
    req.end();
  });
}

async function runTests() {

  // ── Test 1: Happy path ─────────────────────────────────────────────────
  console.log('='.repeat(60));
  console.log('TEST 1 — Happy path (all fields filled)');
  console.log('='.repeat(60));

  const test1 = await postRequest({
    shipped: 'Launched onboarding redesign and fixed 3 critical bugs',
    metrics: 'Activation rate up 12%, support tickets down 20%',
    risks:   'Payment integration delayed by 1 week due to third-party API issues'
  });

  console.log(`Status: ${test1.status}`);
  console.log('\n--- Slack ---');
  console.log(test1.body.slack);
  console.log('\n--- Email ---');
  console.log(test1.body.email);
  console.log('\n--- Executive Summary ---');
  console.log(test1.body.executive_summary);

  // ── Test 2: Validation error ───────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2 — Validation error (empty risks field)');
  console.log('='.repeat(60));

  const test2 = await postRequest({
    shipped: 'Launched onboarding redesign and fixed 3 critical bugs',
    metrics: 'Activation rate up 12%, support tickets down 20%',
    risks:   ''
  });

  console.log(`Status: ${test2.status}`);
  console.log('Response:', JSON.stringify(test2.body, null, 2));

  // ── Test 3: All fields missing ─────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3 — Validation error (all fields empty)');
  console.log('='.repeat(60));

  const test3 = await postRequest({
    shipped: '',
    metrics: '',
    risks:   ''
  });

  console.log(`Status: ${test3.status}`);
  console.log('Response:', JSON.stringify(test3.body, null, 2));
}

runTests().catch(err => {
  console.error('Test runner failed — is the server running on port 3000?');
  console.error(err.message);
});