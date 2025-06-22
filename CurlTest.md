

## mixb-api
- for the local pc
  curl "http://localhost:8080/mix-b/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

- for the google cloud run
  curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

## OPEN AI api

- for the local pc
     curl -X POST "http://localhost:8080/open-ai/chat" \
     -H "Content-Type: application/json" \
     -d '{"system":"You are a helpful assistant","user":"Hello, how are you?","temperature":0.7,"maxTokens":150,"topP":1,"presencePenalty":0,"frequencyPenalty":0,"responseFormat":"text"}'

- for the google cloud run
    curl -X POST "https://my-tools-leebgt5xxa-an.a.run.app/open-ai/chat" \
     -H "Content-Type: application/json" \
     -d '{"system":"You are a helpful assistant","user":"Hello, how are you?","temperature":0.7,"maxTokens":150,"topP":1,"presencePenalty":0,"frequencyPenalty":0,"responseFormat":"text"}'
