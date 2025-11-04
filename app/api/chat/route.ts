import { streamText, convertToModelMessages, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { 
      messages, 
      model, 
      webSearch 
    }: { 
      messages: UIMessage[]; 
      model: string; 
      webSearch?: boolean;
    } = await req.json();

    // Get HuggingFace API configuration
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const baseURL = process.env.HUGGINGFACE_API_URL || 'https://router.huggingface.co/v1';

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'HuggingFace API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a custom provider for HuggingFace
    const huggingfaceProvider = {
      apiKey,
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Stream the AI response
    const result = streamText({
      model: {
        id: model,
        provider: 'openai',
        ...huggingfaceProvider,
      } as any,
      messages: convertToModelMessages(messages),
      system: webSearch 
        ? 'You are a helpful assistant with web search capabilities. When answering questions, you can search the web and provide citations.'
        : 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.',
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Return streaming response with support for reasoning and sources
    return result.toUIMessageStreamResponse({
      sendSources: webSearch,
      sendReasoning: true,
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process request',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
