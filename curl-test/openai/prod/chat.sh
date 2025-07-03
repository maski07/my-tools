#!/bin/bash
curl -X POST "https://my-tools-leebgt5xxa-an.a.run.app/open-ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"system":"You are a helpful assistant","user":"Hello, how are you?","temperature":0.7,"maxTokens":150,"topP":1,"presencePenalty":0,"frequencyPenalty":0,"responseFormat":"text"}' 