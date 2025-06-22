import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OpenAIService, ChatOptions } from './openai.service';

@Controller('open-ai')
export class OpenAIController {
    constructor(private readonly openAIService: OpenAIService) { }

    @Post('chat')
    async chat(@Body() chatOptions: ChatOptions) {
        if (!chatOptions.system || !chatOptions.user) {
            throw new BadRequestException('system and user parameters are required.');
        }

        const result = await this.openAIService.chatWithGPT(chatOptions);

        if (result === null) {
            throw new BadRequestException('Failed to get response from OpenAI.');
        }

        return result;
    }
} 