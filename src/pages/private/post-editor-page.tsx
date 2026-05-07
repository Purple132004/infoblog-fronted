import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/features/auth/auth.store"
import { CategoriesService } from "@/features/categories/categories.service"
import type { Category } from "@/features/categories/categories.type"
import { usePostFeaturedImage } from "@/features/posts/posts.queries"
import { PostsService } from "@/features/posts/posts.service"
import type { Post, PostWriteBody } from "@/features/posts/posts.type"
import type { User } from "@/features/users/users.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

type PostEditable = Post<{ user: User; categories: Category[] }>

export const postEditorFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.string()),
  featuredImage: z
    .custom<File | undefined>((val) => val === undefined || val instanceof File)
    .optional(),
})

export type PostEditorFormValues = z.infer<typeof postEditorFormSchema>

type PostEditorFormProps = {
  postId?: string
  initialPost?: PostEditable
  categories: Category[]
}

const PostEditorForm = ({
  postId,
  initialPost,
  categories,
}: PostEditorFormProps) => {
  const isEdit = Boolean(postId)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: featuredImageUrl, isError: featuredImageError } =
    usePostFeaturedImage(initialPost)

  const form = useForm<PostEditorFormValues>({
    resolver: zodResolver(postEditorFormSchema),
    defaultValues: {
      title: initialPost?.title ?? "",
      description: initialPost?.description ?? "",
      categoryIds: initialPost?.categories.map((c) => c.id) ?? [],
      featuredImage: undefined,
    },
  })

  const createMutation = useMutation({
    mutationFn: (body: PostWriteBody) => PostsService.create(body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Articolo creato")
      navigate(`/my-posts/${res.data.id}/edit`, { replace: true })
    },
    onError: () => {
      toast.error("Errore nella creazione dell'articolo")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PostWriteBody }) =>
      PostsService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast.success("Articolo modificato")
    },
    onError: () => {
      toast.error("Errore nella modifica del post")
    },
  })

  const updateFeaturedImageMutation = useMutation({
    mutationFn: ({ postId, file }: { postId: string; file: File }) =>
      PostsService.updateFeaturedImage(postId, file),
    onSuccess: () => {
      toast.success("Immagine in evidenza modificata")
      queryClient.invalidateQueries({ queryKey: ["post-featured-image"] })
      // form.setValue('featuredImage', undefined);
    },
    onError: () => {
      toast.error("Errore nella modifica dell'immagine in evidenza")
    },
  })

  const onSubmit = (_values: PostEditorFormValues) => {
    // update or create
    if (isEdit) {
      const { featuredImage, ...body } = _values
      updateMutation.mutate({
        id: initialPost!.id,
        body: { ...body, userId: user!.id },
      })
      if (featuredImage) {
        updateFeaturedImageMutation.mutate({
          postId: initialPost!.id,
          file: featuredImage,
        })
      }
    } else {
      createMutation.mutate({
        ..._values,
        userId: user!.id,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit article" : "New article"}
        </h1>
        <Button
          variant="outline"
          render={<Link to="/my-posts" />}
          nativeButton={false}
        >
          Cancel
        </Button>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            autoComplete="off"
            aria-invalid={Boolean(form.formState.errors.title)}
            {...form.register("title")}
          />
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <FieldDescription>
            Article text. Blog cards show a short preview; the article page
            shows the full text.
          </FieldDescription>
          <Textarea
            id="description"
            rows={12}
            className="mt-1.5 min-h-50 font-mono text-sm"
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register("description")}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Categories</FieldLabel>
          <Controller
            name="categoryIds"
            control={form.control}
            render={({ field }) => (
              <div className="mt-2 flex max-h-48 flex-col gap-2 overflow-y-auto rounded-lg border p-3">
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories.
                  </p>
                ) : (
                  categories.map((c) => (
                    <label
                      key={c.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={field.value.includes(c.id)}
                        onCheckedChange={(v) => {
                          const on = Boolean(v)
                          const next = on
                            ? [...field.value, c.id]
                            : field.value.filter((x) => x !== c.id)
                          field.onChange(next)
                        }}
                      />
                      {c.name}
                    </label>
                  ))
                )}
              </div>
            )}
          />
          <FieldError>{form.formState.errors.categoryIds?.message}</FieldError>
        </Field>

        {isEdit && (
          <Field>
            <FieldLabel htmlFor="featured-image">Featured image</FieldLabel>
            {((!featuredImageError && featuredImageUrl) ||
              form.watch("featuredImage")) && (
              <img
                className="h-40 w-fit!"
                src={
                  form.getValues("featuredImage")
                    ? URL.createObjectURL(form.getValues("featuredImage")!)
                    : featuredImageUrl
                }
                alt={initialPost?.title}
              />
            )}
            <Controller
              name="featuredImage"
              control={form.control}
              render={({ field: { onChange, onBlur, name } }) => (
                <Input
                  id="featured-image"
                  name={name}
                  onBlur={onBlur}
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                />
              )}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Upload replaces the current image after you save the article.
            </p>
            <FieldError>
              {form.formState.errors.featuredImage?.message}
            </FieldError>
          </Field>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEdit ? "Save changes" : "Create article"}
        </Button>
      </form>
    </div>
  )
}

const PostEditorPage = () => {
  const { postId } = useParams<{ postId?: string }>()
  const isEdit = Boolean(postId)

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.list(),
  })
  console.log("🚀 ~ PostEditorPage ~ categoriesData:", categoriesData)

  const { data: loadedPost, isPending: loadingPost } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => PostsService.find(postId!),
    enabled: Boolean(postId),
    select: (res) => res.data,
  })
  console.log("🚀 ~ PostEditorPage ~ loadedPost:", loadedPost)

  if (isEdit) {
    if (loadingPost) {
      return <p className="text-sm text-muted-foreground">Loading…</p>
    }
    if (!loadedPost) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Article not found.</p>
          <Button render={<Link to="/my-posts" />} nativeButton={false}>
            Back to list
          </Button>
        </div>
      )
    }
  }

  return (
    <PostEditorForm
      key={postId ?? "new"}
      postId={postId}
      initialPost={isEdit ? loadedPost : undefined}
      categories={categoriesData?.data || []}
    />
  )
}

export default PostEditorPage