// src/chatWithGPT.ts
import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // Load .env variables

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY as string,
});

// Optional settings for a chat request
export interface ChatOptions {
    system: string;
    user: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    responseFormat?: 'json_object' | 'text';
}

/**
 * Send a prompt to GPT-4o and return the assistant’s reply.
 */
export async function chatWithGPT({
    system,
    user,
    temperature,
    maxTokens,
    topP,
    presencePenalty,
    frequencyPenalty,
    responseFormat = 'json_object',
}: ChatOptions): Promise<string | null> {
    try {

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            temperature,
            top_p: topP,
            max_tokens: maxTokens,
            presence_penalty: presencePenalty,
            frequency_penalty: frequencyPenalty,
            response_format: { type: responseFormat },
        });

        const assistantReply = response.choices[0]?.message?.content ?? '';
        console.log('Assistant:', assistantReply);
        return assistantReply;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

