import type { Category } from "@/features/categories/categories.type"
import type { Post } from "@/features/posts/posts.type"
import type { User } from "@/features/users/users.type"

type MockPost = Post<{ user: User; categories: Category[] }>

const createdAt = "2026-04-20T10:00:00.000Z"

const users: User[] = [
  {
    id: "user-1",
    role: "admin",
    email: "alex@example.com",
    firstName: "Alex",
    lastName: "Stone",
    emailVerifiedAt: createdAt,
    createdAt,
  },
  {
    id: "user-2",
    role: "user",
    email: "jamie@example.com",
    firstName: "Jamie",
    lastName: "Lee",
    emailVerifiedAt: createdAt,
    createdAt,
  },
]

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    createdAt,
    slug: "design",
    name: "Design",
  },
  {
    id: "cat-2",
    createdAt,
    slug: "react",
    name: "React",
  },
  {
    id: "cat-3",
    createdAt,
    slug: "ux",
    name: "UX",
  },
  {
    id: "cat-4",
    createdAt,
    slug: "product",
    name: "Product",
  },
]

export const mockPosts: MockPost[] = [
  {
    id: "post-1",
    createdAt: "2026-04-18T09:00:00.000Z",
    title: "Building a reusable UI foundation",
    description:
      "A practical walkthrough on setting up reusable cards, buttons, spacing rules, and page sections so a product feels consistent before any backend logic arrives.",
    featuredImage: "/placeholder.jpg",
    userId: users[0].id,
    user: users[0],
    categories: [mockCategories[0], mockCategories[3]],
  },
  {
    id: "post-2",
    createdAt: "2026-04-16T09:00:00.000Z",
    title: "React pages first, data later",
    description:
      "One clean way to build a complete interface with local mock content first, keeping routes, layouts and visual states ready for real APIs introduced later in class.",
    featuredImage: "/placeholder.jpg",
    userId: users[1].id,
    user: users[1],
    categories: [mockCategories[1]],
  },
  {
    id: "post-3",
    createdAt: "2026-04-14T09:00:00.000Z",
    title: "Content blocks that scale",
    description:
      "How to compose hero sections, article grids and callouts so students can focus on structure, hierarchy and spacing before dealing with requests and responses.",
    featuredImage: "/placeholder.jpg",
    userId: users[0].id,
    user: users[0],
    categories: [mockCategories[0], mockCategories[2]],
  },
  {
    id: "post-4",
    createdAt: "2026-04-12T09:00:00.000Z",
    title: "Simple navigation patterns for blogs",
    description:
      "A lightweight example of public navigation, content cards and detail pages that works well as a classroom starting point for adding real routing logic together.",
    featuredImage: null,
    userId: users[1].id,
    user: users[1],
    categories: [mockCategories[3]],
  },
  {
    id: "post-5",
    createdAt: "2026-04-10T09:00:00.000Z",
    title: "Designing for reading comfort",
    description:
      "Typography, rhythm, white space and image placement all affect readability. This sample article gives students a styled detail page to improve in exercises.",
    featuredImage: "/placeholder.jpg",
    userId: users[0].id,
    user: users[0],
    categories: [mockCategories[2]],
  },
  {
    id: "post-6",
    createdAt: "2026-04-08T09:00:00.000Z",
    title: "From static UI to real product",
    description:
      "An example post that mirrors the journey of the course: start from stable presentational components, then progressively attach forms, auth and remote data.",
    featuredImage: null,
    userId: users[1].id,
    user: users[1],
    categories: [mockCategories[1], mockCategories[3]],
  },
]

export const featuredMockPosts = mockPosts.slice(0, 2)

export function getMockPostById(postId: string) {
  return mockPosts.find((post) => post.id === postId)
}
