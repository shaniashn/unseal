// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

console.log("Hello from Functions!");

// Deno.serve(async (req) => {
//   const { name } = await req.json();
//   const data = {
//     message: `Hello ${name}!`,
//   };

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   );
// });

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODUyODQ3NjB9.zu73uvMH7Rf5PDMBppJ4ev_oW-_bW_thNE4sDFYfPVzFNY9f_j-8wpj5_1R6vie06iysel2Xm9HD49n6s3FENw' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

import { createClient } from '@supabase/supabase-js';

interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

Deno.serve(async (req) => {
  // const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('VITE_SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '');


  const { data: capsules, error: fetchError } = await supabase.from('capsules')
  .select('id, user_id')
  .lte('to_open_at' >= new Date().toISOString().split('T')[0])
  .eq('is_notified', false)

  
  if (fetchError) {
    console.error(fetchError)
  } else {
    console.log("the caps", capsules);
  }
  


  // try {
  //   const res = await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${RESEND_API_KEY}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       from: '',
  //       to: ,
  //       subject: ,
  //       html:
  //     })
  //   })
  // } catch (error) {

  // }

  const res = new Response(
    JSON.stringify({ success: true, emails_sent: 5}),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )

  return res

})
