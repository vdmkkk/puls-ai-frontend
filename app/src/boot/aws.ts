import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const s3Client = new S3Client({
  endpoint: process.env.VUE_APP_MINIO_HOST as string,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.VUE_APP_MINIO_LOGIN as string,
    secretAccessKey: process.env.VUE_APP_MINIO_PASSWORD as string,
  },
  forcePathStyle: true,
})

async function getPresignedUrl(bucketName: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // URL valid for 1 hour
}

export { s3Client, getPresignedUrl }
