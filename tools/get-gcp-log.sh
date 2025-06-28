gcloud logging read \
"resource.type=cloud_run_revision AND resource.labels.service_name=my-tools" \
 --project=my-tools-459008 \
 --limit=50 \
 --format="table(timestamp,severity,textPayload)"
