import { IncomingMessage, ServerResponse } from "http";
import { UrlWithParsedQuery } from "url";
import { ChatOptions, chatWithGPT } from "../Service/openAIService.js";

export const openAIController = async (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
    const query = parsedUrl.query;

    console.log(`test:${parsedUrl.pathname}`);
    switch (parsedUrl.pathname) {
        case '/openAI/chat':
            const result = await chatWithGPT({
                system: query.system as string,
                user: query.user as string,
                temperature: Number(query.temperature),
                maxTokens: Number(query.maxTokens),
                topP: Number(query.topP),
                presencePenalty: Number(query.presencePenalty),
                frequencyPenalty: Number(query.frequencyPenalty),
                responseFormat: query.responseFormat as 'json_object' | 'text',
            } as ChatOptions);
            res.end(result);

            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('エンドポイントが見つかりません。');
            break;
    }
}
