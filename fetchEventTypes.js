// fetchEventTypes.js
import fetch from "node-fetch";

const CALCOM_API_KEY = process.env.CALCOM_API_KEY; // put your API key in .env
const CALCOM_API_BASE_URL = "https://api.cal.com/v2";

async function fetchEventTypes() {
  try {
    const response = await fetch(`${CALCOM_API_BASE_URL}/event-types`, {
      headers: {
        Authorization: `Bearer ${CALCOM_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("Event Types:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error fetching event types:", err.message);
  }
}

fetchEventTypes();
