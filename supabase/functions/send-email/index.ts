// @ts-ignore - Deno imports are not recognized by Node.js TypeScript
import { serve } from "std/http/server.ts";

// @ts-ignore - Deno namespace is not recognized by Node.js TypeScript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'meetings@yourdomain.com',
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});