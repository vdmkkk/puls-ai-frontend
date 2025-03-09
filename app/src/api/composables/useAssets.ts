import { s3Client, getPresignedUrl } from '../../boot/aws'
import { ListObjectsCommand } from '@aws-sdk/client-s3'

const useAssets = () => {
  const getAssets = async () => {
    const command = new ListObjectsCommand({ Bucket: 'frontend-assets' })
    return await s3Client
      .send(command)
      .then(async (res) => {
        const table = {}
        return await Promise.all(
          res.Contents!.map((object) => {
            return getPresignedUrl('frontend-assets', object.Key)
          }),
        ).then((obj) => {
          obj.forEach((item, index) => {
            table[res.Contents[index].Key] = item
          })
          return table
        })
      })
      .catch((e) => {
        console.error(e)
        return null
      })
  }

  return { getAssets }
}

export default useAssets
