import { ArrowRightIcon, CalendarDaysIcon, SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { PostFeaturedImage } from "@/components/post-featured-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Category } from "@/features/categories/categories.type"
import type { Post } from "@/features/posts/posts.type"
import type { User } from "@/features/users/users.type"
import { Link, useSearchParams } from "react-router"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { usePostFeaturedImage } from "@/features/posts/posts.queries"

type BlogProps = {
  posts: Post<{ user: User; categories: Category[] }>[]
  categories: Category[]
  postsPending: boolean
}

const BlogCard = ({
  post,
}: {
  post: Post<{ user: User; categories: Category[] }>
}) => {
  const { data: featuredImage } = usePostFeaturedImage(post)

  return (
    <Card className="group h-full overflow-hidden shadow-none transition-all duration-300">
      <CardContent className="space-y-3.5">
        <div className="mb-6 overflow-hidden rounded-lg sm:mb-12">
          <Link to={`/blog/${post.id}`}>
            <PostFeaturedImage
              featuredImage={featuredImage || null}
              alt={post.title}
              className="h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDaysIcon className="size-6" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <h3 className="line-clamp-2 text-lg font-medium md:text-xl">
          <Link to={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="line-clamp-2 text-muted-foreground">{post.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {post.user.firstName} {post.user.lastName}
          </p>
          <Button
            size="icon"
            variant="outline"
            className="group-hover:border-primary group-hover:bg-primary! group-hover:text-primary-foreground hover:border-primary hover:bg-primary! hover:text-primary-foreground"
            nativeButton={false}
            render={<Link to={`/blog/${post.id}`} />}
          >
            <ArrowRightIcon className="size-4 -rotate-45" />
            <span className="sr-only">Read more: {post.title}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const Blog = ({ posts, categories, postsPending }: BlogProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category") || "all"
  function setCategory(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === "all") {
      next.delete("category")
    } else {
      next.set("category", value)
    }
    setSearchParams(next)
  }

  const searchDebounce = useRef<ReturnType<typeof setTimeout>>(null)
  const searchDraftParam = searchParams.get("search") || ""
  const [searchDraft, setSearchDraft] = useState(searchDraftParam)
  useEffect(() => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current)
    }
    searchDebounce.current = setTimeout(() => {
      searchParams.set("search", searchDraft)
      setSearchParams(searchParams)
    }, 400)
  }, [searchDraft])

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm">Blogs</p>

          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Build Better Products with Insights & Inspiration.
          </h2>

          <p className="text-lg text-muted-foreground md:text-xl">
            Practical insights and real stories to guide your product from
            vision to reality.
          </p>
        </div>

        <Tabs
          value={category}
          onValueChange={setCategory}
          defaultValue="all"
          className="gap-8 lg:gap-16"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <ScrollArea className="w-full rounded-lg bg-muted sm:w-auto">
              <TabsList className="gap-1 group-data-[orientation=horizontal]/tabs:h-auto">
                <TabsTrigger
                  value="all"
                  className="cursor-pointer rounded-lg px-4 text-base group-data-[orientation=horizontal]/tabs:after:h-0 hover:bg-primary/10"
                >
                  All
                </TabsTrigger>
                {categories.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.slug}
                    className="cursor-pointer rounded-lg px-4 text-base group-data-[orientation=horizontal]/tabs:after:h-0 hover:bg-primary/10"
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="relative max-md:w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground peer-disabled:opacity-50">
                <SearchIcon className="size-4" />
                <span className="sr-only">Search</span>
              </div>
              <Input
                type="search"
                placeholder="Search"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                className="peer h-10 px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
              />
            </div>
          </div>
        </Tabs>

        {postsPending ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-128" />
            <Skeleton className="h-128" />
            <Skeleton className="h-128" />
            <Skeleton className="h-128" />
            <Skeleton className="h-128" />
            <Skeleton className="h-128" />
          </div>
        ) : posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nessun articolo trovato</EmptyTitle>
              <EmptyDescription>
                La ricerca di "{searchDraft}" non ha prodotto nessun risultato!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </section>
  )
}

export default Blog
