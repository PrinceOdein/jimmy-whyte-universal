// api/calcom-slots.js
// This is a Vercel Serverless Function (or similar platform)
// It acts as a proxy between your frontend and the Cal.com API
// This keeps your Cal.com API key secure on the backend

// import { createClient } from '@supabase/supabase-js'; // If you need to save booking data to Supabase

// --- GET CONFIGURATION FROM ENVIRONMENT VARIABLES ---
// These MUST be set in your Vercel/Netlify/Render project settings
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_API_BASE_URL = process.env.CALCOM_API_BASE_URL || 'https://api.cal.com';
// --- ---

// --- BASIC VALIDATION ---
if (!CALCOM_API_KEY) {
  console.error("❌ CRITICAL: CALCOM_API_KEY is not set in environment variables for api/calcom-slots.js");
  // Throwing an error here will cause the function deployment to fail or runtime to crash
  // which is good for catching config issues early.
  throw new Error("Missing CALCOM_API_KEY environment variable");
}
// --- ---

export default async function handler(request, response) {
  // --- HANDLE PREFLIGHT REQUESTS (CORS) ---
  // Essential for allowing your frontend to call this endpoint
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.status(200).end();
  }
  // --- ---
  
  // --- SET CORS HEADERS FOR ACTUAL REQUESTS ---
  // Allow your frontend to call this endpoint
  response.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production security
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // --- ---

  // Only allow GET requests to this endpoint for fetching slots
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // --- GET QUERY PARAMETERS FROM THE REQUEST ---
    // Example: /api/calcom-slots?eventTypeSlug=discovery-call&startTime=2024-08-01T00:00:00Z
    const { eventTypeSlug, startTime, endTime, timeZone } = request.query;

    // Validate required parameter
    if (!eventTypeSlug) {
      return response.status(400).json({ error: 'Missing required parameter: eventTypeSlug' });
    }
    // --- ---

    // --- CONSTRUCT THE CAL.COM API URL ---
    // IMPORTANT: YOU MUST VERIFY THIS ENDPOINT AND PARAMETER STRUCTURE
    // AGAINST THE OFFICIAL CAL.COM API DOCUMENTATION.
    // This is a common pattern, but check if eventTypeSlug is accepted or if you need the numerical ID.
    
    // Example using slug in the path (YOU NEED TO VERIFY THIS IS CORRECT):
    let apiUrl = `${CALCOM_API_BASE_URL}/v2/event-types/${encodeURIComponent(eventTypeSlug)}/availability?apiKey=${encodeURIComponent(CALCOM_API_KEY)}`;
    
    // Example using slug as a query parameter (ALTERNATIVE - VERIFY IN DOCS):
    // let apiUrl = `${CALCOM_API_BASE_URL}/v1/availability?apiKey=${CALCOM_API_KEY}&eventTypeSlug=${encodeURIComponent(eventTypeSlug)}`;
    
    // Add other optional parameters if provided and supported by the endpoint
    if (startTime) {
      apiUrl += `&startTime=${encodeURIComponent(startTime)}`;
    }
    if (endTime) {
      apiUrl += `&endTime=${encodeURIComponent(endTime)}`;
    }
    if (timeZone) {
      apiUrl += `&timeZone=${encodeURIComponent(timeZone)}`;
    }
    // --- ---
    
    console.log(`INFO: Fetching slots from Cal.com API: ${apiUrl}`); // Debug log

    // --- MAKE THE REQUEST TO THE CAL.COM API ---
    const calcomResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if required by the specific endpoint/auth method
        'Authorization': `Bearer ${CALCOM_API_KEY}`, // Example, check docs
      }
    });
    // --- ---
    
    console.log(`INFO: Cal.com API responded with status: ${calcomResponse.status}`); // Debug log

    if (!calcomResponse.ok) {
      // Handle errors from Cal.com API
      let errorText = 'Unknown error from scheduling service.';
      let errorDetails = {};
      try {
        errorDetails = await calcomResponse.json();
        errorText = errorDetails.message || errorDetails.error || JSON.stringify(errorDetails);
      } catch (textError) {
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
    console.log("SUCCESS: Successfully fetched slots from Cal.com:", JSON.stringify(slotsData, null, 2)); // Debug log

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