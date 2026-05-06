import InkLogo from "@/assets/svg/ink-logo"
import LoginForm from "@/components/login-form"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Link } from "react-router"

const LoginPage = () => {
  return (
    <>
      <CardHeader className="gap-6">
        <InkLogo />

        <div>
          <CardTitle className="mb-1.5 text-2xl">
            Sign in to Shadcn Studio
          </CardTitle>
          <CardDescription className="text-base">
            Ship Faster and Focus on Growth.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Login Form */}
        <div className="space-y-4">
          <LoginForm />

          <p className="text-center text-muted-foreground">
            New on our platform?{" "}
            <Link
              to="/register"
              className="text-card-foreground hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  )
}

export default LoginPage
