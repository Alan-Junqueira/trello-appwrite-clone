import { ID, storage } from "@/services/appwrite"

export const uploadImage = async (file: File) => {
  if(!file) return

  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID!,
    ID.unique(),
    file
  )

  return fileUploaded
}