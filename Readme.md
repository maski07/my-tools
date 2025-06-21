# memo: how to

https://chatgpt.com/c/6819c0b0-0fe8-8013-a1f2-ebc883bea0c6

# memo: initial environment

## Prerequisite

1. Create service

2. Set IAM Role

https://console.cloud.google.com/iam-admin/iam?hl=ja&inv=1&invt=AbwpvQ&project=my-tools-459008

## How to set up

1. excecute commands

```bash
   npm init -y
   npm install express
```

2. add scripts in package.json

```js
"scripts": {
   "start": "node server.js"
}
```

3. set up the google cloud with commands.

```bash
    gcloud init
    gcloud builds submit --tag gcr.io/my-tools-459008/my-tools
    gcloud run deploy my-tools \
    --image gcr.io/my-tools-459008/my-tools \
    --platform managed \
    --region asia-northeast1 \
    --allow-unauthenticated
```

# Deploy codes

```bash
    gcloud builds submit --tag gcr.io/my-tools-459008/my-tools
    gcloud run deploy my-tools \
      --image gcr.io/my-tools-459008/my-tools \
      --platform managed \
      --region asia-northeast1 \
      --set-env-vars ALLOWED_IPS={YOUR_IP_ADRESSES},GOOGLE_MAP_API_KEY={API_KEY}
     --allow-unauthenticated
```

# get log

```bash
   gcloud app logs read --project=my-tools-459008 --service=my-tools
```

## Information for the development.

# create env

1. As for ALLOWED_IPS, you have to add your local pc ip separated by ips

2. curl commands

- for the local pc
  curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

- for the google cloud run
  curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"

## URL

- Google Cloud log
  https://console.cloud.google.com/logs/query;query=resource.type%3D%22cloud_run_revision%22%0Aresource.labels.service_name%3D%22my-tools%22%0Aresource.labels.revision_name%3D%22my-tools-00004-lav%22;cursorTimestamp=2025-05-06T08:53:12.679271Z;duration=PT1H?project=my-tools-459008&inv=1&invt=Abwp1g

# Precautions

When we deploy the env file, you have to add env values to the deloyment command.
