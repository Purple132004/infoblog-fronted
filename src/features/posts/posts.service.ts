import { http, type PaginatedResponse } from "@/lib/http"
import type { Post, PostWriteBody } from "./posts.type"
import type { User } from "../users/users.type"
import type { Category } from "../categories/categories.type"

export class PostsService {
  static async list(
    props: {
      page?: string
      perPage?: string
      category?: string | null
      search?: string | null
      userId?: string
    } = {}
  ) {
    const { page = "1", perPage = "2", category, search, userId } = props

    const q = new URLSearchParams()
    q.set("page", page)
    q.set("perPage", perPage)
    q.set("with[user]", "true")
    q.set("with[categories]", "true")
    if (category) {
      q.set("category", category)
    }
    if (search) {
      q.set("search", search)
    }
    if (userId) {
      q.set("userId", userId)
    }

    return http.get<
      PaginatedResponse<Post<{ user: User; categories: Category[] }>>
    >(`/posts?${q.toString()}`)
  }

  static async remove(id: string) {
    return http.delete(`/posts/${id}`)
  }

  static async find(id: string) {
    return http.get<Post<{user: User; categories: Category[] }>>(`/posts/${id}?with[user]=true&with[categories]=true`)
  }

  static async create(body: PostWriteBody) {
    return http.post<Post<{user: User; categories: Category[] }>>('/posts?with[user]=true&with[categories]=true', body)
  }

  static async update(id: string, body: PostWriteBody) {
    return http.patch<Post<{user: User; categories: Category[] }>>(`/posts/${id}?with[user]=true&with[categories]=true`, body)
  }

  static async getFeaturedImage(postId: string) {
    return http.get(`/posts/${postId}/featured-image`, { responseType: 'blob' });
  }

  static async updateFeaturedImage(postId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post(`/posts/${postId}/featured-image`, formData);
  }

  static async deleteFeaturedImage(postId: string) {
    return http.delete(`/posts/${postId}/featured-image`);
  }
}
