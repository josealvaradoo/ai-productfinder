import { AI } from './ai';

export class Mistral extends AI {
  constructor(context: string) {
    super(
      'mistral',
      process.env.MISTRAL_API_KEY!,
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        temperature: 0.1,
        max_tokens: 150,
        top_p: 0.1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      context
    );
  }
}
