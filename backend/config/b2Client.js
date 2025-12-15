// config/b2Client.js
import { S3Client } from '@aws-sdk/client-s3';
import { config } from './env.js';

const b2Client = new S3Client({
  endpoint: config.b2.endpoint,
  region: config.b2.region,
  credentials: {
    accessKeyId: config.b2.accessKey,
    secretAccessKey: config.b2.secretKey,
  },
    forcePathStyle: true, // 🔴 REQUIRED FOR BACKBLAZE

});

export default b2Client;