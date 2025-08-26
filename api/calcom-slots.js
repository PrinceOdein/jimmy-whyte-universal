// api/calcom-slots.js (Vercel Serverless Function)
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

// --- IMPORTANT: SECURELY ACCESS API KEY FROM ENVIRONMENT VARIABLES ---
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_API_BASE_URL = process.env.CALCOM_API_BASE_URL; // Allow overriding for self-hosted

// Basic validation for required environment variable
if (!CALCOM_API_KEY) {
    console.error("CRITICAL ERROR: CALCOM_API_KEY is not set in environment variables for api/calcom-slots.js.");
    // Consider throwing an error or returning a specific response indicating misconfiguration
    // throw new Error("Server configuration error: Missing Cal.com API key.");
}

export default async function handler(request, response) {
    // Only allow GET requests to this endpoint
    if (request.method !== 'GET') {
        response.setHeader('Allow', ['GET']);
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // --- Get query parameters from the request ---
        // Example: /api/calcom-slots?eventTypeSlug=discovery-call&startTime=2024-08-01T00:00:00Z
        const { eventTypeSlug, startTime, endTime, timeZone } = request.query;

        // Validate required parameter
        if (!eventTypeSlug) {
            console.warn("Request received without required 'eventTypeSlug' parameter.");
            return response.status(400).json({ error: 'Missing required parameter: eventTypeSlug' });
        }

        // --- CONSTRUCT THE CORRECT CAL.COM API URL ---
        // IMPORTANT: YOU MUST VERIFY THIS ENDPOINT AND PARAMETER STRUCTURE
        // AGAINST THE OFFICIAL CAL.COM API DOCUMENTATION.
        // This is a common pattern for v2, but check if eventTypeSlug is accepted or if you need the numeric ID.
        let apiUrl = `${CALCOM_API_BASE_URL}/v2/event-types/${encodeURIComponent(eventTypeSlug)}/availability?apiKey=${encodeURIComponent(CALCOM_API_KEY)}`;

        // Add optional parameters if provided (check Cal.com API docs for supported params)
        // Example structure - adjust parameter names/types based on docs:
        // if (startTime) {
        //     apiUrl += `&startTime=${encodeURIComponent(new Date(startTime).toISOString())}`; // Ensure ISO format
        // }
        // if (endTime) {
        //     apiUrl += `&endTime=${encodeURIComponent(new Date(endTime).toISOString())}`;
        // }
        // if (timeZone) {
        //     apiUrl += `&timeZone=${encodeURIComponent(timeZone)}`; // E.g., 'America/New_York'
        // }
        // --- ---

        console.log(`INFO: Fetching slots from Cal.com API: ${apiUrl}`); // Log the exact URL being called

        // --- MAKE THE REQUEST TO CAL.COM API ---
        // Use fetch or a library like axios
        const calcomResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // --- IMPORTANT AUTHENTICATION CHECK ---
                // Cal.com API might require the key in the Authorization header INSTEAD of or IN ADDITION to the query param.
                // Check the Cal.com API docs for the correct method.
                // Common alternatives (uncomment ONE if needed and remove apiKey from query string above):
                // 'Authorization': `Bearer ${CALCOM_API_KEY}`, // If docs say Bearer Token
                // 'Authorization': `ApiKey ${CALCOM_API_KEY}`, // If docs say ApiKey Token
                // --- ---
            }
        });

        console.log(`INFO: Cal.com API responded with status: ${calcomResponse.status}`); // Log response status

        if (!calcomResponse.ok) {
            // Handle errors from Cal.com API
            let errorText = 'Unknown error from scheduling service.';
            let errorDetails = {};
            try {
                errorDetails = await calcomResponse.json();
                errorText = errorDetails.message || errorDetails.error || JSON.stringify(errorDetails);
            } catch (parseError) {
                // If parsing JSON fails, get raw text
                try {
                    errorText = await calcomResponse.text();
                } catch (textError) {
                    errorText = `HTTP Error ${calcomResponse.status}: ${calcomResponse.statusText}`;
                }
            }
            const fullErrorMessage = `Cal.com API error (${calcomResponse.status}): ${errorText}`;
            console.error(`ERROR: ${fullErrorMessage}`); // Log detailed Cal.com error
            console.error("ERROR Details:", errorDetails); // Log parsed details if available

            // Return a user-friendly error to the frontend
            // Include specific Cal.com error if safe/appropriate, or generic message
            return response.status(calcomResponse.status).json({
                error: 'Failed to fetch availability from scheduling service.',
                // Optionally include more details for debugging (be cautious in production)
                // debugInfo: fullErrorMessage // Remove or sanitize for production
            });
        }

        const slotsData = await calcomResponse.json();
        console.log("SUCCESS: Successfully fetched slots from Cal.com:", JSON.stringify(slotsData, null, 2)); // Log success data (truncated for brevity in logs)

        // --- RETURN THE DATA TO THE FRONTEND ---
        // The frontend will need to know how to parse this structure.
        // This example assumes Cal.com returns the data directly.
        // If you need to transform it, do so here.
        return response.status(200).json(slotsData);
        // --- ---

    } catch (error) {
        console.error("UNEXPECTED ERROR in calcom-slots function:", error);
        // Return a generic error message to avoid leaking internal details
        return response.status(500).json({ error: 'An internal server error occurred while fetching availability.' });
    }
}