// api/calcom-webhook.js (Vercel Serverless Function - Corrected Body Parsing)
import { supabase } from '../src/lib/supabaseClient.js'; // Adjust path as needed
const WEBHOOK_SECRET = process.env.CALCOM_WEBHOOK_SECRET;

export default async function handler(request, response) {
  // --- ONLY ACCEPT POST REQUESTS ---
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  // --- ---

  try {
    // --- CORRECTLY PARSE THE INCOMING JSON BODY ---
    // Vercel's default Node.js runtime provides the parsed body in `request.body`
    // if the request has Content-Type: application/json.
    // However, it's safer to explicitly parse it or handle raw body for verification.
    
    let payload;
    // Check if Vercel already parsed it (common case)
    if (request.body) {
      console.log("Vercel auto-parsed request body");
      payload = request.body;
    } else {
      // If not parsed, read raw body and parse manually
      console.log("Manually parsing request body");
      const chunks = [];
      for await (const chunk of request) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      payload = JSON.parse(rawBody);
    }
    
    const eventType = payload.triggerEvent || payload.type; // Check Cal.com docs for exact field name

    console.log(`Received Cal.com webhook event: ${eventType}`);
    console.log("Full webhook payload:", JSON.stringify(payload, null, 2)); // Log for inspection
    // --- ---

    // --- HANDLE BOOKING CREATED EVENT ---
    if (eventType === 'BOOKING_CREATED') {
      const bookingData = payload.payload; // This contains the booking details

      // --- EXTRACT & MAP BOOKING DATA TO YOUR SUPABASE SCHEMA ---
      // IMPORTANT: You MUST adapt these field mappings based on the actual structure
      // of the data Cal.com sends in the webhook payload.
      // Check your Cal.com dashboard or test the webhook to see the exact structure.
      const extractedBookingInfo = {
        // --- CORE BOOKING DETAILS ---
        calcom_booking_uid: bookingData.uid || bookingData.id || null, // Unique identifier
        start_time: bookingData.startTime || bookingData.start || null, // ISO 8601 format
        end_time: bookingData.endTime || bookingData.end || null, // ISO 8601 format
        title: bookingData.title || bookingData.eventType?.title || null, // Meeting title
        description: bookingData.description || bookingData.eventType?.description || null, // Description
        location: bookingData.locationUrl || bookingData.location?.url || null, // Meeting URL/Location
        // --- ATTENDEE DETAILS ---
        attendee_name: bookingData.attendee?.name || bookingData.attendees?.[0]?.name || bookingData.responses?.name || null,
        attendee_email: bookingData.attendee?.email || bookingData.attendees?.[0]?.email || bookingData.responses?.email || null,
        attendee_timezone: bookingData.attendee?.timeZone || bookingData.attendees?.[0]?.timeZone || null,
        // --- ORGANIZER DETAILS (if needed) ---
        organizer_email: bookingData.organizer?.email || null,
        // --- ADD MORE FIELDS AS NEEDED BASED ON CAL.COM PAYLOAD ---
        // You can log the full payload to see all available fields
        // raw_webhook_data: JSON.stringify(payload) // Optional: Store full payload for debugging
      };
      // --- ---

      // --- CORRELATE BOOKING TO LEAD IN SUPABASE ---
      // Find the corresponding lead using the attendee's email
      let leadId = null;
      const attendeeEmail = extractedBookingInfo.attendee_email;

      if (attendeeEmail) {
        // Query Supabase to find the lead with the matching email
        const { data: leadData, error: fetchError } = await supabase
          .from('leads') // Your leads table name
          .select('id') // Only select the ID
          .eq('email', attendeeEmail) // Match by email
          .single(); // Expecting one result

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = "Results contain 0 rows"
          console.error("Error fetching lead for booking correlation:", fetchError);
          // Decide how to handle: log error, proceed without lead link, etc.
          // For now, we'll proceed but log the issue
        } else if (leadData) {
          leadId = leadData.id;
          console.log(`Found lead ID ${leadId} for email ${attendeeEmail}`);
        } else {
          console.log(`No lead found with email ${attendeeEmail} for booking correlation.`);
          // The booking is still valid, just not linked to a lead in our DB
        }
      }
      // --- ---

      // --- PREPARE DATA FOR SUPABASE INSERTION ---
      const supabaseBookingRecord = {
        ...extractedBookingInfo,
        lead_id: leadId, // This creates the link between booking and lead (nullable if no lead found)
        created_at: new Date().toISOString() // Add timestamp
      };
      // --- ---

      // --- INSERT BOOKING RECORD INTO SUPABASE ---
      const { data: insertData, error: insertError } = await supabase
        .from('bookings') // Your bookings table name (make sure it exists!)
        .insert([supabaseBookingRecord])
        .select(); // Often returns the inserted record

      if (insertError) throw insertError;

      console.log('Booking successfully recorded in Supabase:', insertData);
      
      // --- OPTIONAL: UPDATE LEAD STATUS ---
      // If you found a lead, you might want to update its status
      if (leadId) {
        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            booking_status: 'scheduled' // Add this column to 'leads' table if it doesn't exist
            // You could also store the booking ID: booking_id: insertData[0]?.id
          })
          .eq('id', leadId);
          
        if (updateError) {
          console.warn('Warning: Could not update lead booking status:', updateError);
        } else {
          console.log(`Lead ID ${leadId} booking status updated to 'scheduled'.`);
        }
      }
      // --- ---
      
      // Respond to Cal.com to acknowledge receipt
      return response.status(200).json({ message: 'Booking recorded successfully' });
      
    } else {
      // Handle other event types if needed (e.g., BOOKING_CANCELLED, BOOKING_RESCHEDULED)
      console.log(`Unhandled Cal.com event type: ${eventType}`);
      return response.status(200).json({ message: `Event ${eventType} processed (ignored)` });
    }
    // --- ---

  } catch (error) {
    console.error('Error processing Cal.com webhook:', error);
    // It's often better to return 200 OK to prevent Cal.com from retrying indefinitely on errors,
    // but log the internal error for you to investigate.
    return response.status(200).json({ error: 'Internal processing error logged' });
    // Or, if you want to signal an immediate failure to Cal.com:
    // return response.status(500).json({ error: 'Internal Server Error' });
  }
}