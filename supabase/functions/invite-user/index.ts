// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create a Supabase client with the SERVICE ROLE KEY (Super Admin)
    // This allows us to use auth.admin methods
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Parse request body
    const { email, role, full_name } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // 3. Invite the User
    // This sends an email to the user with a magic link to set their password
    const { data: user, error: inviteError } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: full_name,
        role: role || 'customer' // Store role in metadata immediately
      }
    })

    if (inviteError) throw inviteError

    // 4. (Optional) Create Profile Entry
    // Trigger usually handles this, but we can double check or update
    // If you have a trigger on auth.users -> public.profiles, this is automatic.
    // If not, we manually insert:
    /*
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({ 
        user_id: user.user.id, 
        role: role || 'customer',
        full_name: full_name 
      })
    */

    return new Response(
      JSON.stringify({ message: 'User invited successfully', user }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
