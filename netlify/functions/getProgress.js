
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const BASE_ID = "tblmFK7XawakfKQyM";
  const TABLE_NAME = "Progress";
  const RECORD_ID = "recXwynFh17wbdqJs";

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${RECORD_ID}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`
      }
    });

    if (!response.ok) {
      throw new Error("Airtable request failed");
    }

    const data = await response.json();
    const fields = data.fields;

    return {
      statusCode: 200,
      body: JSON.stringify({
        progress: fields["Progress"],
        current: fields["Donation Value Rollup (from Table 1)"],
        goal: fields["Goal"]
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load data" })
    };
  }
};
