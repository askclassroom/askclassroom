import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { findMatchingTopic } from '@/lib/actions/companion.actions';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subjectId, topicDescription } = await req.json();

        if (!subjectId || !topicDescription) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const match = await findMatchingTopic(subjectId, topicDescription);

        return NextResponse.json({ match });
    } catch (error) {
        console.error('Error in topic matching API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}