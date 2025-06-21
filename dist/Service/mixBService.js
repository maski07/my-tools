import https from 'https';
import { getUnixTimeAtHour } from '../Utils/commonUtil.js';
import dotenv from 'dotenv';
dotenv.config();
const ApiKey = process.env.GOOGLE_MAP_API_KEY; // Google APIキーを入れてください
export function callGoogleMapAPI(req, res, parsedUrl, cache) {
    const query = parsedUrl.query;
    const origin = query.origin;
    const destination = query.destination;
    const maxMinutes = parseInt(query.maxMinutes);
    if (!origin || !destination || isNaN(maxMinutes)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'origin, destination, maxMinutes パラメータが必要です。' }));
        return;
    }
    const key = origin + destination + maxMinutes;
    if (cache.has(key)) {
        console.log('used cache');
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(cache.get(key)));
    }
    else {
        checkTransitTime(origin, destination, maxMinutes, (err, result) => {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            if (err) {
                res.end(JSON.stringify({ error: err }));
            }
            else {
                res.end(JSON.stringify(result));
                cache.set(key, result);
            }
        });
    }
}
function checkTransitTime(origin, destination, maxMinutes, callback) {
    console.log({ origin, destination, maxMinutes });
    const departureTime = getUnixTimeAtHour(15, 0).toString().trim(); // 毎日15:00固定
    const requestUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit&transit_mode=train&departure_time=${departureTime}&key=${ApiKey}`;
    https.get(requestUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            if (response.status !== 'OK') {
                console.error(response);
                callback(`Google API エラー: ${JSON.stringify(response)}`, null);
                return;
            }
            const leg = response.routes[0].legs[0];
            const durationInSeconds = leg.duration.value;
            callback(null, {
                durationText: leg.duration.text,
                duration: Math.floor(durationInSeconds / 60),
                isWithinLimit: durationInSeconds <= maxMinutes * 60
            });
            console.log('api has been finished successfully.');
        });
    }).on('error', (err) => {
        console.log(`API呼び出しエラー: ${err.message}`);
        callback(`API呼び出しエラー: ${err.message}`, null);
    });
}
