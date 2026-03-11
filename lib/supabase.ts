import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

export const createSupabaseClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,{
            async accessToken(){
                return ((await auth()).getToken())
            }
        }
    )
}

// Bypass RLS for trusted server actions
export const createSupabaseAdmin = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        }
    )
}
