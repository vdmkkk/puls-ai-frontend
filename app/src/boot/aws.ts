import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Create the S3 client using the provided credentials and endpoint.
const s3Client = new S3Client({
  endpoint: process.env.VUE_APP_S3_ENDPOINT as string,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.VUE_APP_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.VUE_APP_S3_SECRET_ACCESS_KEY as string,
  },
  // forcePathStyle: true is often required by non-AWS S3 providers.
  forcePathStyle: true,
})

async function getPresignedUrl(key: string) {
  const bucketName = 'images'
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL valid for 1 hour
}

export { s3Client, getPresignedUrl }
