// api/calcom-webhook.js (Vercel Serverless Function example)
import { supabase } from '../src/lib/supabaseClient'; // Adjust path

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = request.body;
    const eventType = payload.triggerEvent; // Check Cal.com docs for exact field name

    console.log(`Received Cal.com webhook event: ${eventType}`);

    if (eventType === 'BOOKING_CREATED') {
      const bookingData = payload.payload; // Extract booking details

      // --- IDENTIFY THE LEAD IN SUPABASE ---
      // You need a way to link the booking to the lead.
      // The most common way is via the attendee's email address.
      const attendeeEmail = bookingData.attendee?.email || bookingData.attendees?.[0]?.email || bookingData.responses?.email;

      if (!attendeeEmail) {
        console.error("Could not find attendee email in Cal.com webhook payload for correlation.");
        return response.status(400).json({ error: "Missing attendee email for lead correlation" });
      }

      // 1. Find the lead by email
      const {  leadData, error: fetchError } = await supabase
        .from('leads')
        .select('id') // Assuming 'id' is the primary key
        .eq('email', attendeeEmail) // Assuming 'email' is the column name in 'leads'
        .single(); // Expecting one result

      if (fetchError) {
         console.error("Error fetching lead for booking update:", fetchError);
         // Decide how to handle: log error, return specific status?
         // For now, let's assume it's okay if lead isn't found immediately (race condition)
         // Or return 200 OK to prevent Cal.com retries, but log the issue.
         // return response.status(404).json({ error: "Lead not found for provided email" });
         return response.status(200).json({ message: "Booking received, lead lookup failed (might retry)" });
      }

      if (!leadData) {
         console.log(`No lead found with email ${attendeeEmail} for booking correlation.`);
         // Similar handling as above
         return response.status(200).json({ message: "Booking received, lead not found" });
      }

      const leadId = leadData.id;

      // --- PREPARE BOOKING DATA FOR SUPABASE ---
      const supabaseBookingRecord = {
        // Map Cal.com fields to your new Supabase columns
        booking_datetime: bookingData.startTime || bookingData.start || null, // Use TIMESTAMPTZ format (ISO 8601)
        // Optional: Add status
        booking_status: 'scheduled', // Or derive from Cal.com data if available
        // Optional: Add more details if needed
        // calcom_booking_uid: bookingData.uid,
        // meeting_url: bookingData.locationUrl || null,
        // title: bookingData.title || null,
      };
      // --- ---

      // --- UPDATE THE LEAD RECORD IN SUPABASE ---
      const { data: updateData, error: updateError } = await supabase
        .from('leads')
        .update(supabaseBookingRecord)
        .eq('id', leadId) // Update the specific lead record
        .select(); // Often returns the updated record

      if (updateError) {
        console.error("Error updating lead with booking info:", updateError);
        // Handle update error (log, return specific status)
        return response.status(500).json({ error: "Failed to update lead with booking information" });
      }

      console.log('Lead booking information updated successfully in Supabase:', updateData);
      return response.status(200).json({ message: 'Booking recorded and lead updated' });
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