// const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
// const CALCOM_API_BASE_URL = process.env.CALCOM_API_BASE_URL || "https://api.cal.com";

// if (!CALCOM_API_KEY) {
//   console.error("CALCOM_API_KEY is not set in environment variables.");
// }

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   try {
//     const { eventTypeSlug, startTime, endTime, timeZone } = req.query;

//     if (!eventTypeSlug) {
//       return res.status(400).json({ error: 'Missing required parameter: eventTypeSlug' });
//     }

//     // Build URL
//     let apiUrl = `${CALCOM_API_BASE_URL}/v2/slots?eventTypeSlug=${encodeURIComponent(eventTypeSlug)}`;
//     if (startTime) apiUrl += `&startTime=${encodeURIComponent(startTime)}`;
//     if (endTime) apiUrl += `&endTime=${encodeURIComponent(endTime)}`;
//     if (timeZone) apiUrl += `&timeZone=${encodeURIComponent(timeZone)}`;

//     console.log("Fetching slots from:", apiUrl);

//     // Fetch with Authorization header
//     const calcomResponse = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${CALCOM_API_KEY}`
//       }
//     });

//     if (!calcomResponse.ok) {
//       const errorText = await calcomResponse.text();
//       console.error(`Cal.com API error (${calcomResponse.status}):`, errorText);
//       return res.status(calcomResponse.status).json({ error: 'Failed to fetch availability from Cal.com.' });
//     }

//     const slotsData = await calcomResponse.json();
//     return res.status(200).json(slotsData);

//   } catch (err) {
//     console.error("Unexpected error in calcom-slots function:", err);
//     return res.status(500).json({ error: 'Internal server error while fetching availability.' });
//   }
// }
