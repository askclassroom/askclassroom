'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) throw new Error(error.message);

    return companions;
}


export const createCompanion=async (FormData: CreateCompanion)=>{
    const {userId:author} = await auth();
    const supabase= createSupabaseClient();

    const {data,error}= await supabase.from('companions').insert({
        ...FormData,
        author
    }).select();

    if(error || !data) throw new Error(error?.message || "Faled to create a companion");

    return data[0];
}

