import { AI } from './ai';

export class Qwen extends AI {
  constructor(context: string,) {
    super(
      "qwen",
      process.env.QWEN_API_KEY!,
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-turbo',
        temperature: 0.1,
        max_tokens: 150,
        top_p: 0.1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      context)
  }
}
