import { storage } from "@/services/appwrite"

export const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId)

  return url
}