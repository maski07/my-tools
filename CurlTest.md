

## mixb-api
- for the local pc
  curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

- for the google cloud run
  curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

## OPEN AI api

- for the local pc
    curl -X GET "http://localhost:3000/openAI/chat?system=You%20are%20a%20helpful%20assistant&user=Hello%2C%20how%20are%20you%3F&temperature=0.7&maxTokens=150&topP=1&presencePenalty=0&frequencyPenalty=0&responseFormat=text"

- for the google cloud run
    curl -X GET "https://my-tools-leebgt5xxa-an.a.run.app/openAI/chat?system=You%20are%20a%20helpful%20assistant&user=Hello%2C%20how%20are%20you%3F&temperature=0.7&maxTokens=150&topP=1&presencePenalty=0&frequencyPenalty=0&responseFormat=text"
