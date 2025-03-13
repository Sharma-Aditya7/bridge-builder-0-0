import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ConversationData {
  messages: {
    sender: string;
    content: string;
    timestamp: Date;
  }[];
  topic: string;
}

export async function getAIMediatorResponse(conversation: ConversationData): Promise<string> {
  try {
    // Create a prompt based on the conversation history
    const messages = conversation.messages.map((msg) => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: `${msg.sender === 'ai' ? 'AI Mediator' : msg.sender}: ${msg.content}`
    }));

    // Add system prompt to guide the AI
    messages.unshift({
      role: 'system',
      content: `You are an AI workplace conflict mediator. Your role is to help resolve workplace conflicts between two employees.
      
      Topic of conflict: ${conversation.topic}
      
      Guidelines:
      1. Remain neutral and unbiased at all times
      2. Ask clarifying questions when needed
      3. Identify common ground and shared interests
      4. Help both parties express their concerns respectfully
      5. Guide the conversation toward constructive solutions
      6. Summarize progress and agreements
      7. Suggest next steps toward resolution
      
      Keep responses concise and focused on mediation. Always be respectful and professional.`
    });

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response. Let's try again.";
  } catch (error) {
    console.error('Error getting AI mediator response:', error);
    return "I'm having trouble connecting. Let's try again in a moment.";
  }
}