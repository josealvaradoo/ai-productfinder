type Json = {
  code: string;
  name: string;
} | null

type Config = Record<string, string | number>

type Response<T> = { provider: string, query: string, response: T, error: string | null, duration: number }

interface IAI {
  prompt: (query: string, context: string) => string
  parse: (response: string) => Json
  response: (query: string, json: Json, error: Error, duration: number) => Response<Json>
  query: (query: string) => Promise<Response<Json>>
}

export class AI implements IAI {
  constructor(
    private provider: string,
    private key: string,
    private url: string,
    private config: Config,
    private context: string,
  ) { }

  /**
   * Generates a prompt for AI to find the most relevant product match from a given array
   * based on user input, with support for English and Spanish translations
   */
  prompt(query: string, context: string): string {
    return `Given a product query from user input, you have to find the most relevant match. Your task is to:

1. Read the provided array of product objects.
2. Compare each product’s query to the user’s input, try with english and spanish tranlation of the user input.
3. Select and return the product object that is the most relevant match to the user input.
4. If there is no relevant match, return null.
5. If you picked a product, compare again the product query against the user input, if it doesn't have relationship, reject it and return null.

Return only the selected product object or null. Do not include any explanations or additional text. Do not use markdown format like <pre>. Do not use single quotes, do use double quotes instead.

The user input is: "${query}"

The product array is: ${context}
`
  }

  /**
   * Parses JSON content from AI response, handling common markdown formatting
   * and converting unquoted property names to valid JSON format
   */
  parse(content: string | undefined): Json {
    let string = content?.replace("\`\`\`json", "");
    string = string?.replace("\`\`\`", "");
    string = string?.replace(/(\w+):/g, '"$1":')
    return (string && string !== "null") ? JSON.parse(string) : null
  }

  /**
   * Creates a standardized response object with query, result data, and error information
   */
  response(query: string, json: Json, error: Error | null, duration: number): Response<Json> {
    return {
      provider: this.provider,
      query,
      response: json,
      duration,
      error: error ? error.message : null
    }
  }

  public async query(query: string): Promise<any> {
    const startTime = performance.now()
    let json: Json = null
    let error: Error | null = null;

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.key}`
        },
        body: JSON.stringify({
          ...this.config,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that helps find the most relevant product from an array of product objects.'
            },
            {
              role: 'user',
              content: this.prompt(query, this.context)
            }
          ],
        })
      })

      if (!response.ok) {
        throw new Error(`${this.provider} API error: ${response.status}`)
      }

      const data = await response.json()
      json = this.parse(data.choices[0]?.message?.content)

      if (!json) {
        throw new Error("no match found")
      }
    } catch (e) {
      error = (e as Error)
      console.error(error.message)
    } finally {
      const endTime = performance.now()
      const duration = Math.round((endTime - startTime) / 1000 * 100) / 100 // Convierte a segundos con 2 decimales

      return this.response(query, json, error, duration)
    }
  }

}
