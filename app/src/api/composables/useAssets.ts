import { s3Client, getPresignedUrl } from '../../boot/aws'
import { ListObjectsCommand } from '@aws-sdk/client-s3'

const useAssets = () => {
  const getAssets = async () => {
    const command = new ListObjectsCommand({ Bucket: 'images' })
    return await s3Client
      .send(command)
      .then(async (res) => {
        return res
      })
      .catch((e) => {
        console.error(e)
        return null
      })
  }

  return { getAssets }
}

export default useAssets
