import { useAuthStore } from "@/features/auth/auth.store"
import { cn } from "@/lib/utils"
import InkLogo from "@/assets/svg/ink-logo"
import { Link, Navigate, Outlet, useLocation } from "react-router"
import { useEffect } from "react"
import { AuthService } from "@/features/auth/auth.service"

const PrivateLayout = () => {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  useEffect(() => {
    if (token) {
      AuthService.me()
        .then((res) => {
          console.log(res)
        })
        .catch(() => {
          useAuthStore.getState().logout()
        })
    }
  }, [token])

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <InkLogo />
            <span>Back to site</span>
          </Link>
          <Link
            to="/my-posts"
            className={cn(
              "text-sm font-medium",
              location.pathname === "/my-posts" ||
                location.pathname.startsWith("/my-posts/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Back to posts
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default PrivateLayout
