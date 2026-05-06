type PostFeaturedImageProps = {
  featuredImage: string | null
  alt?: string
  className?: string
  fallbackSrc?: string
}

export function PostFeaturedImage({
  featuredImage,
  alt = "",
  className,
  fallbackSrc = "/placeholder.jpg",
}: PostFeaturedImageProps) {
  return <img src={featuredImage || fallbackSrc} alt={alt} className={className} />
}
