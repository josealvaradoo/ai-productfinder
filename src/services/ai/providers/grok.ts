import { AI } from './ai';

export class Grok extends AI {
  constructor(context: string) {
    super(
      'grok',
      process.env.GROK_API_KEY!,
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-3-mini-fast',
        temperature: 0,
      },
      context
    );
  }
}
