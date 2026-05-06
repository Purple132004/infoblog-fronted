import InkLogo from "@/assets/svg/ink-logo"
import RegisterForm from "@/components/register-form"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router"

const RegisterPage = () => {
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
          <RegisterForm />

          <p className="text-center text-muted-foreground">
            Sei già registrato?{" "}
            <Link to="/login" className="text-card-foreground hover:underline">
              Accedi ora
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  )
}

export default RegisterPage
