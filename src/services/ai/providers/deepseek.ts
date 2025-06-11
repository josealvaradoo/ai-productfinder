import { AI } from './ai';

export class Deepseek extends AI {
  constructor(context: string,) {
    super(
      "deepseek",
      process.env.DEEPSEEK_API_KEY!,
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        temperature: 0.1,
        max_tokens: 150,
        top_p: 0.1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      context)
  }
}
