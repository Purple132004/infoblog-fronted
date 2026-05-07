import { PostFeaturedImage } from "@/components/post-featured-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePostFeaturedImage } from "@/features/posts/posts.queries"
import { PostsService } from "@/features/posts/posts.service"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeftIcon, CalendarDaysIcon } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router"

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => PostsService.find(postId!),
    select: (res) => res.data,
  })

  const {data: featuredImage} = usePostFeaturedImage(post);

  if (isError) {
    return <p>Errore nel caricamento del post</p>
  }

  if (isPending) {
    return <p>Caricamento...</p>
  }

  if (!postId || !post) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-24 text-center">
        <p className="text-muted-foreground">Article not found.</p>
        <Button render={<Link to="/blog" />} nativeButton={false}>
          Back to blog
        </Button>
      </div>
    )
  }

  const hasDescription = Boolean(post.description.trim())

  return (
    <article className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:pt-32">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 gap-2 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="size-4" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span aria-hidden>·</span>
          <span>
            {post.user.firstName} {post.user.lastName}
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {post.title}
        </h1>

        {post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mb-10 overflow-hidden rounded-xl">
        <PostFeaturedImage
          featuredImage={featuredImage || null}
          alt={post.title}
          className="aspect-video w-full object-cover"
        />
      </div>

      {hasDescription ? (
        <div className="max-w-none text-base leading-relaxed whitespace-pre-wrap text-foreground">
          {post.description}
        </div>
      ) : (
        <p className="text-muted-foreground">No description yet.</p>
      )}
    </article>
  )
}

export default PostDetailPage