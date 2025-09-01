// api/calcom-webhook.js (Vercel Serverless Function example)
import { supabase } from '../src/lib/supabaseClient.js'; // Adjust path as needed

// IMPORTANT: Store your Cal.com webhook signing secret in Vercel environment variables
// Add CALCOM_WEBHOOK_SECRET=your_actual_secret to Vercel project settings
const WEBHOOK_SECRET = process.env.CALCOM_WEBHOOK_SECRET;

// --- Helper function to verify webhook signature (implement based on Cal.com docs) ---
// This is crucial for security to ensure the request is genuinely from Cal.com
// The exact implementation depends on Cal.com's signature method (usually HMAC SHA256)
// Example (conceptual, you MUST implement according to Cal.com's documentation):
/*
function verifySignature(payload, signatureHeader, secret) {
  // 1. Get raw body (might require special handling in serverless functions)
  // 2. Create HMAC SHA256 hash of payload using secret
  // 3. Compare computed hash with signatureHeader
  // 4. Return true if they match, false otherwise
  // Example using Node's crypto library:
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(payload, 'utf8')
  //   .digest('hex');
  // return crypto.timingSafeEqual(Buffer.from(signatureHeader, 'hex'), Buffer.from(expectedSignature, 'hex'));
  
  // Placeholder for now - replace with actual implementation
  // For testing without verification (NOT recommended for production):
  return true; 
}
*/
// --- ---

export default async function handler(request, response) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // --- SECURITY: Verify Webhook Signature ---
    // const signature = request.headers['x-cal-signature']; // Or whatever header Cal.com uses
    // const rawBody = await getRawBody(request); // You need the raw body for signature verification
    // if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
    //   console.warn('Invalid Cal.com webhook signature');
    //   return response.status(401).json({ error: 'Unauthorized' });
    // }
    // --- ---
    
    // Parse the JSON payload from Cal.com
    const payload = await request.json(); // Use request.body if your framework parses it automatically
    const eventType = payload.triggerEvent || payload.type; // Check Cal.com docs for exact field
    
    console.log(`Received Cal.com webhook event: ${eventType}`);
    
    // Handle the BOOKING_CREATED event
    if (eventType === 'BOOKING_CREATED') {
      const bookingData = payload.payload; // This contains the booking details
      
      // --- EXTRACT BOOKING INFORMATION ---
      // Adapt field names based on actual Cal.com payload structure
      const supabaseBookingRecord = {
        calcom_booking_uid: bookingData.uid, // Unique identifier for the booking
        start_time: bookingData.startTime || bookingData.start || null, // ISO 8601 format
        end_time: bookingData.endTime || bookingData.end || null, // ISO 8601 format
        attendee_name: bookingData.attendee?.name || bookingData.attendees?.[0]?.name || bookingData.responses?.name || null,
        attendee_email: bookingData.attendee?.email || bookingData.attendees?.[0]?.email || bookingData.responses?.email || null,
        meeting_url: bookingData.locationUrl || bookingData.location?.url || null, // Link to the meeting
        title: bookingData.title || bookingData.eventType?.title || null, // Title of the event
        // Add more fields from bookingData as needed
      };
      // --- ---
      
      // --- CORRELATE BOOKING TO LEAD ---
      // Find the lead in Supabase using the attendee's email
      let leadId = null;
      const attendeeEmail = supabaseBookingRecord.attendee_email;
      
      if (attendeeEmail) {
        const { data: leadData, error: fetchError } = await supabase
          .from('leads')
          .select('id')
          .eq('email', attendeeEmail) // Assuming 'email' is the column name in 'leads'
          .single(); // Expecting one result
        
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = "Results contain 0 rows"
          console.error("Error fetching lead for booking correlation:", fetchError);
          // Decide how to handle: log error, proceed without lead link, etc.
        } else if (leadData) {
          leadId = leadData.id;
          console.log(`Found lead ID ${leadId} for email ${attendeeEmail}`);
        } else {
          console.log(`No lead found with email ${attendeeEmail} for booking correlation.`);
        }
      }
      
      // Add lead_id to the booking record if found
      if (leadId) {
        supabaseBookingRecord.lead_id = leadId;
      }
      // --- ---
      
      // --- INSERT BOOKING INTO SUPABASE ---
      const { data: bookingInsertData, error: bookingInsertError } = await supabase
        .from('bookings') // Your bookings table name
        .insert([supabaseBookingRecord])
        .select(); // Often returns the inserted record
      
      if (bookingInsertError) throw bookingInsertError;
      
      console.log('Booking recorded in Supabase:', bookingInsertData);
      
      // --- OPTIONAL: UPDATE LEAD STATUS ---
      if (leadId) {
        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            booking_status: 'scheduled', // Add this column to 'leads' table if it doesn't exist
            // booking_id: bookingInsertData[0]?.id // Optional: link booking ID directly in leads table
          })
          .eq('id', leadId);
          
        if (updateError) {
          console.warn('Warning: Could not update lead booking status:', updateError);
        } else {
          console.log(`Lead ID ${leadId} booking status updated to 'scheduled'.`);
        }
      }
      // --- ---
      
      return response.status(200).json({ message: 'Booking recorded successfully' });
    } else {
      // Handle other event types if needed (e.g., BOOKING_CANCELLED)
      console.log(`Unhandled Cal.com event type: ${eventType}`);
      return response.status(200).json({ message: `Event ${eventType} processed (ignored)` });
    }
    
  } catch (error) {
    console.error('Error processing Cal.com webhook:', error);
    // It's often better to return 200 OK to prevent Cal.com from retrying indefinitely on errors,
    // but log the internal error for you to investigate.
    return response.status(200).json({ error: 'Internal processing error logged' });
    // Or, if you want to signal an immediate failure to Cal.com:
    // return response.status(500).json({ error: 'Internal Server Error' });
  }
}