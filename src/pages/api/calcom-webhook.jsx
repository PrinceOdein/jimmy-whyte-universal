// src/pages/api/calcom-webhook.jsx
// This is a conceptual example for a Node.js-like API route (e.g., using Vercel Serverless Functions)
// You'll need to adapt this to your specific backend framework/environment.

import { supabase } from '../../lib/supabaseClient'; // Adjust path

export default async function handler(request, response) {
  // --- IMPORTANT: SECURE YOUR WEBHOOK ---
  // Cal.com should provide a way to sign webhooks (e.g., using a secret).
  // Verify the signature here to ensure the request is genuine.
  // const signature = request.headers['x-cal-signature']; // Example header name
  // const rawBody = JSON.stringify(request.body); // Or get raw body if needed for verification
  // const secret = process.env.CALCOM_WEBHOOK_SECRET; // Store this securely in your env vars
  // if (!verifySignature(rawBody, signature, secret)) {
  //   return response.status(401).json({ error: 'Unauthorized' });
  // }
  // --- ---

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = request.body;
    const eventType = payload.triggerEvent; // Or check payload.type, depending on Cal.com's format
    console.log(`Received Cal.com webhook event: ${eventType}`);

    if (eventType === 'BOOKING_CREATED') { // Adjust event type name if needed
      const bookingData = payload.payload; // This contains the booking details

      // --- Prepare data for Supabase ---
      // Map Cal.com fields to your Supabase 'bookings' table columns
      const supabaseBookingRecord = {
        // --- CORRELATE THE BOOKING TO THE LEAD ---
        // You need a way to link this booking to the lead in your 'leads' table.
        // Options:
        // 1. If Cal.com passes the lead's email:
        //    - Query your 'leads' table to find the lead ID by email.
        //    - Store the lead ID in this booking record.
        // 2. Pass a unique identifier from your lead form (e.g., lead UUID) as a hidden field
        //    in the Cal.com booking page URL or prefill data.
        // For now, assuming correlation by email:
        lead_email: bookingData.responses?.email || bookingData.attendees?.[0]?.email || null, // Example: Get email from responses or attendees

        // --- BOOKING DETAILS FROM CAL.COM ---
        calcom_booking_uid: bookingData.uid, // Unique identifier for the booking
        calcom_event_type: bookingData.eventTypeId || bookingData.eventType?.id || null, // Event type ID
        start_time: bookingData.startTime || bookingData.start || null, // ISO 8601 format
        end_time: bookingData.endTime || bookingData.end || null, // ISO 8601 format
        attendee_name: bookingData.attendee?.name || bookingData.attendees?.[0]?.name || bookingData.responses?.name || null,
        attendee_email: bookingData.attendee?.email || bookingData.attendees?.[0]?.email || bookingData.responses?.email || null,
        meeting_url: bookingData.locationUrl || bookingData.location?.url || null, // Link to the meeting
        meeting_location: bookingData.location?.formattedAddress || bookingData.location?.address || bookingData.location || null, // Physical location or description
        title: bookingData.title || bookingData.eventType?.title || null, // Title of the event
        description: bookingData.description || bookingData.eventType?.description || null, // Description
        // Add more fields from bookingData as needed
        // --- ---
        
        // Optional: Store the raw payload for debugging or future use
        // raw_data: JSON.stringify(bookingData) 
      };
      // --- ---

      // --- Insert Booking Record into Supabase ---
      const { data, error: insertError } = await supabase
        .from('bookings') // Replace 'bookings' with your actual table name
        .insert([supabaseBookingRecord])
        .select(); // Often returns the inserted record

      if (insertError) throw insertError;

      console.log('Booking recorded successfully in Supabase:', data);
      
      // Optional: Update the corresponding lead record to indicate booking status
      // This requires finding the lead by email (or another correlator) first
      /*
      if (supabaseBookingRecord.lead_email) {
         const { data: leadData, error: fetchError } = await supabase
           .from('leads')
           .select('id')
           .eq('email', supabaseBookingRecord.lead_email)
           .single();

         if (!fetchError && leadData) {
           const { error: updateError } = await supabase
             .from('leads')
             .update({ booking_status: 'scheduled', booking_id: data[0]?.id }) // Add these columns to 'leads' table
             .eq('id', leadData.id);

           if (updateError) {
             console.warn('Warning: Could not update lead booking status:', updateError);
           } else {
             console.log('Lead booking status updated for lead ID:', leadData.id);
           }
         }
      }
      */
      // --- ---
      
      return response.status(200).json({ message: 'Booking recorded' });
    } else {
      // Handle other event types if needed (e.g., BOOKING_CANCELLED, BOOKING_RESCHEDULED)
      console.log(`Unhandled Cal.com event type: ${eventType}`);
      return response.status(200).json({ message: 'Event processed' });
    }

  } catch (error) {
    console.error('Error processing Cal.com webhook:', error);
    // It's generally better to return a 200 OK for webhooks even if internal processing fails,
    // to prevent the service (Cal.com) from retrying indefinitely.
    // However, logging the error is crucial.
    // You might want to implement a retry mechanism or dead-letter queue for failed processing.
    return response.status(200).json({ error: 'Internal processing error' }); 
    // Or, if you want to signal an immediate failure to Cal.com: 
    // return response.status(500).json({ error: 'Internal Server Error' });
  }
}

// --- Helper function to verify webhook signature (IMPLEMENT BASED ON CAL.COM DOCS) ---
/*
function verifySignature(payload, signature, secret) {
  // Implementation depends on Cal.com's specific requirements
  // Usually involves HMAC SHA256
  // 1. Create an HMAC SHA256 hash of the payload using the secret
  // 2. Compare the computed hash (hex/base64) with the received signature
  // 3. Return true if they match, false otherwise
  
  // Example pseudo-code (you MUST use Node's crypto library or equivalent):
  // const crypto = require('crypto');
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(payload, 'utf8') // Ensure correct encoding
  //   .digest('hex'); // or 'base64'
  // return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex')); // Safe comparison
  
  // Placeholder - replace with actual implementation
  return true; 
}
*/
// --- ---