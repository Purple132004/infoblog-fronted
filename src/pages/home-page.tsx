import HeroSection from "@/components/shadcn-studio/blocks/hero-section-35/hero-section-35"
import { PostsService } from "@/features/posts/posts.service"
import { useQuery } from "@tanstack/react-query"

const HomePage = () => {

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => PostsService.list()
  });

  return (
    <>
      <HeroSection blogData={data?.data.items || []} />
    </>
  )
}

export default HomePage