import { AI } from './ai';

export class Gemini extends AI {
  constructor(context: string) {
    super(
      'gemini',
      process.env.GEMINI_API_KEY!,
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        model: 'gemini-2.0-flash-lite',
      },
      context
    );
  }
}
