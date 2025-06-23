export async function handler(event, context) {
  const fetch = (await import('node-fetch')).default;

  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const baseId = "appk98eTxLtQ2i8Mc";  // 
  const tableName = "Progress";
  const recordId = "recXwynFh17wbdqJs";

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`
      }
    });

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load data", details: err.message })
    };
  }
}
