// api/calcom-slots.js (Vercel Serverless Function example)
// This file should be deployed to your backend (e.g., Vercel, Netlify Functions)

// IMPORTANT: Store your Cal.com API key securely in environment variables
// For Vercel: Add it in your project settings under Environment Variables
// Name it something like CALCOM_API_KEY
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_API_BASE_URL = process.env.CALCOM_API_BASE_URL || 'https://api.cal.com/v2'; // Allow overriding for self-hosted

// Basic validation for required environment variable
if (!CALCOM_API_KEY) {
    console.error("CALCOM_API_KEY is not set in environment variables.");
    // Consider throwing an error or returning a specific response
}

export default async function handler(request, response) {
    // Only allow GET requests to this endpoint
    if (request.method !== 'GET') {
        response.setHeader('Allow', ['GET']);
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- Optional: Add Authentication for this endpoint ---
    // To prevent abuse, you might want to add a simple check
    // const authHeader = request.headers.authorization;
    // const expectedToken = process.env.INTERNAL_API_TOKEN; // Another env var
    // if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    //     return response.status(401).json({ error: 'Unauthorized' });
    // }
    // --- ---

    try {
        // --- Get query parameters from the request ---
        // Example: /api/calcom-slots?eventTypeSlug=discovery-call&startTime=2024-08-01T00:00:00Z
        const { eventTypeSlug, startTime, endTime, timeZone } = request.query;

        // Validate required parameter
        if (!eventTypeSlug) {
            return response.status(400).json({ error: 'Missing required parameter: eventTypeSlug' });
        }

        // --- Construct the Cal.com API URL ---
        // IMPORTANT: Check Cal.com API documentation for the EXACT endpoint and parameters.
        // This is a hypothetical endpoint structure.
        let apiUrl = `${CALCOM_API_BASE_URL}slots?apiKey=${CALCOM_API_KEY}&eventTypeSlug=${encodeURIComponent(eventTypeSlug)}`;

        // Add optional parameters if provided
        if (startTime) {
            apiUrl += `&startTime=${encodeURIComponent(startTime)}`;
        }
        if (endTime) {
            apiUrl += `&endTime=${encodeURIComponent(endTime)}`;
        }
        if (timeZone) {
            apiUrl += `&timeZone=${encodeURIComponent(timeZone)}`;
        }
        // Add other relevant parameters as needed (e.g., duration, seats)
        // --- ---

        console.log(`Fetching slots from Cal.com API: ${apiUrl}`); // Debug log

        // --- Make the request to Cal.com API ---
        // Use fetch or a library like axios
        const calcomResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers Cal.com API might require
                // 'Authorization': `Bearer ${CALCOM_API_KEY}` // If auth is via header instead of query param
            }
        });

        if (!calcomResponse.ok) {
            // Handle errors from Cal.com API
            const errorText = await calcomResponse.text();
            console.error(`Cal.com API error (${calcomResponse.status}):`, errorText);
            // Return a generic error to the frontend to avoid leaking internal details
            return response.status(calcomResponse.status).json({ error: 'Failed to fetch availability from scheduling service.' });
        }

        const slotsData = await calcomResponse.json();
        console.log("Successfully fetched slots from Cal.com:", slotsData); // Debug log

        // --- Return the data to the frontend ---
        // The frontend will need to know how to parse this structure
        return response.status(200).json(slotsData);
        // --- ---

    } catch (error) {
        console.error("Unexpected error in calcom-slots function:", error);
        // Return a generic error message
        return response.status(500).json({ error: 'An internal server error occurred while fetching availability.' });
    }
}