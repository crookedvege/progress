const https = require('https');

exports.handler = async function () {
  const apiKey = process.env.AIRTABLE_PAT;
  const baseId = 'appk98eTxLtQ2i8Mc';
  const table = 'Progress';
  const recordId = 'recXwynFh17wbdqJs';

  const options = {
    hostname: 'api.airtable.com',
    path: `/v0/${baseId}/${table}/${recordId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const record = JSON.parse(data);
        const fields = record.fields || {};

        const current = fields['Donation Value Rollup (from Table 1)'] || 0;
        const goal = fields.Goal || 1; // Avoid divide-by-zero
        const progress = current / goal;

        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            progress,
            current,
            goal
          })
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });

    req.end();
  });
};
