import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter, RouterProvider } from "react-router"
import "./index.css"
import WebsiteLayout from "./layouts/website-layout"
import PrivateLayout from "./layouts/private-layout"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import HomePage from "./pages/home-page"
import LoginPage from "./pages/login-page"
import AuthLayout from "./layouts/auth-layout"
import RegisterPage from "./pages/register-page"
import { Toaster } from "./components/ui/sonner"
import BlogPage from "@/pages/blog-page"
import PostDetailPage from "@/pages/post-detail-page"
import MyPostsPage from "@/pages/private/my-posts-page"
import PostEditorPage from "@/pages/private/post-editor-page"

const client = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:postId",
        element: <PostDetailPage />,
      },
      {
        path: "contatti",
        element: <div className="py-80"><p>Contatti</p></div>,
      },
    ],
  },
  {
    path: "/my-posts",
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <MyPostsPage />,
      },
      {
        path: "new",
        element: <PostEditorPage />,
      },
      {
        path: ":postId/edit",
        element: <PostEditorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
