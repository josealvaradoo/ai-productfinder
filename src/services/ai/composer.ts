import { Deepseek, Grok, Mistral, Gemini, Qwen } from './providers/providers';
import { AI } from './providers/ai';

export type ProviderName = 'deepseek' | 'grok' | 'mistral' | 'gemini' | 'qwen';

export class Composer {
  private provider: AI | null = null;

  constructor(private context: string) { }

  select(name: ProviderName): this {
    const providers = {
      deepseek: Deepseek,
      grok: Grok,
      mistral: Mistral,
      gemini: Gemini,
      qwen: Qwen
    };

    const Provider = providers[name];
    if (!Provider) {
      throw new Error(`Provider ${name} not found`);
    }

    this.provider = new Provider(this.context);
    return this;
  }

  async query(prompt: string): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not set. Use setProvider() first.');
    }
    return await this.provider.query(prompt);
  }

  build(): AI {
    if (!this.provider) {
      throw new Error('Provider not set. Use setProvider() first.');
    }
    return this.provider;
  }
}
