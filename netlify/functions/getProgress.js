const https = require('https');

exports.handler = async function (event, context) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.airtable.com',
      path: '/v0/tblmFK7XawakfKQyM/Progress/recXwynFh17wbdqJs',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_PAT}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const record = JSON.parse(data);

          // 🪵 Return the raw Airtable fields for debugging
          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(record.fields, null, 2)  // Pretty print
          });
        } catch (err) {
          console.error('Error parsing Airtable response:', err);
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to parse Airtable response' })
          });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err);
      reject({
        statusCode: 500,
        body: JSON.stringify({ error: 'Request failed' })
      });
    });

    req.end();
  });
};
