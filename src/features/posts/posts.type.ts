export type Post<T extends object = Record<string, never>> = {
  id: string
  createdAt: string
  title: string
  description: string
  featuredImage: string | null
  userId: string
} & T

export type PostWriteBody = {
  title: string
  description: string
  categoryIds: string[]
  userId: string
}
