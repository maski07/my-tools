#!/bin/bash
# Partial matching (returns multiple results)
curl -X POST "http://localhost:8080/jobs/check-authority" \
  -H "Content-Type: application/json" \
  -d '{"companyNames": ["McMullan", "Shellfish"]}' 