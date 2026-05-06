import Footer from "@/components/shadcn-studio/blocks/footer-component-01/footer-component-01"
import Header from "@/components/shadcn-studio/blocks/hero-section-35/header"
import { AuthService } from "@/features/auth/auth.service"
import { useAuthStore } from "@/features/auth/auth.store"
import { useEffect } from "react"
import { Outlet } from "react-router"

const navigationData = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "blog",
    href: "/blog",
  },
  {
    title: "contatti",
    href: "/contatti",
  },
]

const WebsiteLayout = () => {

  useEffect(() => {
    AuthService.me().then(res => {
      console.log(res);
    }).catch(() => {
      const token = useAuthStore.getState().token;
      if (token) {
        useAuthStore.getState().logout()
      }
    })
  }, [])

  return (
    <>
      <Header navigationData={navigationData} />
      <Outlet />
      <Footer navigationData={navigationData} />
    </>
  )
}

export default WebsiteLayout
