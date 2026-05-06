import { useQuery } from "@tanstack/react-query"
import { PostsService } from "./posts.service"
import type { Post } from "./posts.type"
import type { User } from "../users/users.type"
import type { Category } from "../categories/categories.type"

export function usePostFeaturedImage(post?: Post<{user: User, categories: Category[]}>) {
  return useQuery({
    queryKey: ["post-featured-image", post?.id],
    queryFn: async () => {
      const { data: blob } = await PostsService.getFeaturedImage(post!.id)
      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error("Empty")
      }
      return URL.createObjectURL(blob)
    },
    enabled: Boolean(post?.featuredImage),
    retry: false,
  })
}
