import { NextResponse } from 'next/server';
import { getAIMediatorResponse } from '../../../services/aiMediator';

export async function POST(request: Request) {
  try {
    const { messages, topic } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }
    
    const aiResponse = await getAIMediatorResponse({
      messages,
      topic: topic || 'Workplace Conflict'
    });
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in AI mediator API route:', error);
    return NextResponse.json(
      { error: 'Failed to get AI mediator response' },
      { status: 500 }
    );
  }
}