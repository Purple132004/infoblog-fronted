import Paginator from "@/components/paginator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/features/auth/auth.store"
import { PostsService } from "@/features/posts/posts.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router"
import { toast } from "sonner"

const MyPostsPage = () => {
  const user = useAuthStore((s) => s.user)!
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  const { data, isPending } = useQuery({
    queryKey: ["posts", "mine", user.id, page],
    queryFn: () =>
      PostsService.list({
        userId: user.id,
        perPage: '4',
        page,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PostsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Article deleted")
    },
    onError: () => {
      toast.error("Could not delete article")
    },
  })

  const items = data?.data.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your articles</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit or remove your posts.
          </p>
        </div>
        <Button render={<Link to="/my-posts/new" />} nativeButton={false}>
          New article
        </Button>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No articles yet</CardTitle>
            <CardDescription>
              Write your first article to see it here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link to="/my-posts/new" />} nativeButton={false}>
              New article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((post) => (
              <li key={post.id}>
                <Card>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link to={`/my-posts/${post.id}/edit`} />}
                        nativeButton={false}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this article? This cannot be undone."
                            )
                          ) {
                            deleteMutation.mutate(post.id)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
  
          {data?.data && data.data.totalPages > 1 && <Paginator metadata={data.data} />}
        </>
      )}
    </div>
  )
}

export default MyPostsPage
