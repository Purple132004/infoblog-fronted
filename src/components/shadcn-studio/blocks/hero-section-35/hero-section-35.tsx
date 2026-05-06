import { ArrowUpRightIcon, CalendarDaysIcon } from "lucide-react"

import { PostFeaturedImage } from "@/components/post-featured-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Post } from "@/features/posts/posts.type"
import type { User } from "@/features/users/users.type"
import type { Category } from "@/features/categories/categories.type"
import { usePostFeaturedImage } from "@/features/posts/posts.queries"
import { Link } from "react-router"

const HeroSection = ({
  blogData,
}: {
  blogData: Post<{ user: User; categories: Category[] }>[]
}) => {
  return (
    <section className="bg-muted pt-24 pb-12 sm:pb-16 lg:pb-24">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-4xl flex-col items-center gap-4 self-center text-center">
          <Badge variant="outline" className="text-sm font-normal">
            Trusted by 1,000,000+ professionals
          </Badge>
          <h1 className="text-3xl leading-[1.29167] font-semibold text-balance sm:text-4xl lg:text-5xl">
            Build Better Products with Insights that Drive Real Impact.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Learn how to design, develop, launch, and grow digital products
            through practical knowledge and proven frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {blogData.map((post) => (
            <HeroCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection

const HeroCard = ({
  post,
}: {
  post: Post<{ user: User; categories: Category[] }>
}) => {
  const { data: featuredImageUrl } = usePostFeaturedImage(post)

  return (
    <Card className="group py-0 shadow-none">
      <CardContent className="grid grid-cols-1 px-0 xl:grid-cols-2">
        <div className="p-6">
          <div className="h-59.5 w-full overflow-hidden rounded-lg">
            <PostFeaturedImage
              featuredImage={featuredImageUrl || null}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 p-6">
          <div className="flex items-center gap-1.5 py-1">
            <div className="flex grow items-center gap-1.5 text-muted-foreground">
              <CalendarDaysIcon className="size-6" />
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            {post.categories.map((category) => (
              <Badge
                key={category.id}
                className="border-0 bg-primary/10 text-sm text-primary"
              >
                {category.name}
              </Badge>
            ))}
          </div>
          <Link to={`/blog/${post.id}`}>
            <h3 className="text-xl font-medium">{post.title}</h3>
          </Link>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
          <div className="flex w-full items-center justify-between gap-1 py-1">
            <p className="text-sm font-medium">
              {post.user.firstName} {post.user.lastName}
            </p>
            <Button
              size="icon"
              variant="outline"
              className="group-hover:border-transparent group-hover:bg-primary! group-hover:text-primary-foreground hover:border-transparent hover:bg-primary! hover:text-primary-foreground"
              render={<Link to={`/blog/${post.id}`} />}
              nativeButton={false}
            >
              <ArrowUpRightIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
