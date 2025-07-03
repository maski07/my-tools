#!/bin/bash
# Partial matching (returns multiple results)
curl -X POST "https://my-tools-leebgt5xxa-an.a.run.app/jobs/check-authority" \
  -H "Content-Type: application/json" \
  -d '{"companyNames": ["McMullan", "Shellfish"]}' 