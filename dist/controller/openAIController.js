import { chatWithGPT } from "../Service/openAIService.js";
export const openAIController = async (req, res, parsedUrl) => {
    const query = parsedUrl.query;
    console.log(`test:${parsedUrl.pathname}`);
    switch (parsedUrl.pathname) {
        case '/openAI/chat':
            const result = await chatWithGPT({
                system: query.system,
                user: query.user,
                temperature: Number(query.temperature),
                maxTokens: Number(query.maxTokens),
                topP: Number(query.topP),
                presencePenalty: Number(query.presencePenalty),
                frequencyPenalty: Number(query.frequencyPenalty),
                responseFormat: query.responseFormat,
            });
            res.end(result);
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('エンドポイントが見つかりません。');
            break;
    }
};
