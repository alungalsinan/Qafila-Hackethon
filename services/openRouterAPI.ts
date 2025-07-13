interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export class OpenRouterAPI {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found in environment variables');
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: `You are an Islamic AI assistant named Qafila. You provide accurate, authentic Islamic guidance based on the Quran and authentic Hadith. Always:
        1. Give concise, helpful answers about Islamic practices, beliefs, and rulings
        2. Reference Quran verses or authentic Hadith when applicable
        3. Encourage consulting local Islamic scholars for complex matters
        4. Be respectful and use appropriate Islamic greetings
        5. If unsure about a ruling, recommend consulting a qualified scholar
        6. Keep responses under 200 words for mobile readability
        7. Start responses with "Assalamu Alaikum" when appropriate
        8. Use Islamic terminology correctly (e.g., "insha'Allah", "subhanAllah", etc.)`
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.EXPO_PUBLIC_SITE_URL || '',
          'X-Title': process.env.EXPO_PUBLIC_SITE_NAME || '',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528',
          messages: [systemPrompt, ...messages],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not process your request. Please try again.';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      return 'I apologize, but I am currently unable to respond. Please check your connection and try again.';
    }
  }
}