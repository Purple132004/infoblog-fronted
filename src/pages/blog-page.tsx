import Paginator from "@/components/paginator"
import Blog from "@/components/shadcn-studio/blocks/blog-component-15/blog-component-15"
import { CategoriesService } from "@/features/categories/categories.service"
import { PostsService } from "@/features/posts/posts.service"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

const BlogPage = () => {
  const [searchParams] = useSearchParams()
  const page = searchParams.get("page") || "1"

  const category = searchParams.get("category")
  const search = searchParams.get("search")

  const { data: blogPosts, isPending } = useQuery({
    queryKey: ["blog", { page, category, search }],
    queryFn: () =>
      PostsService.list({
        perPage: "9",
        page,
        category,
        search,
      }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.list(),
  })

  return (
    <>
      <Blog
        posts={blogPosts?.data.items || []}
        postsPending={isPending}
        categories={categoriesData?.data || []}
      />

      {blogPosts?.data && blogPosts.data.totalPages > 1 && (
        <Paginator metadata={blogPosts.data} />
      )}
    </>
  )
}

export default BlogPage