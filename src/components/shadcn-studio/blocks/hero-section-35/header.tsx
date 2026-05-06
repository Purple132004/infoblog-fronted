"use client"

import { useEffect, useState } from "react"

import {
  FilePenLineIcon,
  LogOutIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserPlus2,
  UserRoundIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import MenuDropdown from "@/components/shadcn-studio/blocks/menu-dropdown"
import MenuNavigation from "@/components/shadcn-studio/blocks/menu-navigation"
import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation"

import { cn } from "@/lib/utils"

import InkLogo from "@/assets/svg/ink-logo"
import { Link } from "react-router"
import { useAuthStore } from "@/features/auth/auth.store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

type HeaderProps = {
  navigationData: NavigationSection[]
  className?: string
}

type AppTheme = "dark" | "light" | "system"

const Header = ({ navigationData, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user: authUser, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 h-17.5 w-full transition-all duration-300",
        {
          "bg-background shadow-md": isScrolled,
        },
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 w-[200px]">
          <InkLogo />
          <span className="text-[20px] font-semibold text-primary">
            Infoblog
          </span>
        </Link>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          className="max-md:hidden capitalize"
        />

        {/* Actions */}
        <div className="flex gap-4 w-[200px] justify-end items-center">

          {/* Theme selector */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Tema: chiaro, scuro o di sistema"
            />}>
              {theme === "light" && <SunIcon className="size-4" aria-hidden />}
              {theme === "dark" && <MoonIcon className="size-4" aria-hidden />}
              {theme === "system" && <MonitorIcon className="size-4" aria-hidden />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 sm:w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-sm font-medium text-foreground">
                  Aspetto
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(v) => setTheme(v as AppTheme)}
                >
                  <DropdownMenuRadioItem value="light" className="gap-2">
                    <SunIcon className="size-4" />
                    Chiaro
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="gap-2">
                    <MoonIcon className="size-4" />
                    Scuro
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system" className="gap-2">
                    <MonitorIcon className="size-4" />
                    Sistema
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <p className="px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
                  Scorciatoia: premere{" "}
                  <kbd className="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-0.5 rounded border border-border bg-muted px-1 font-sans text-[9px] font-medium text-foreground">
                    D
                  </kbd>{" "}
                  per passare da chiaro a scuro o viceversa.
                </p>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {authUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className={'cursor-pointer'}>
                  <Avatar className={'bg-gray-200 dark:bg-mist-900 size-12'}>
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/bottts/svg?seed=${authUser.email}&scale=70`}
                    />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* profile */}
                  <DropdownMenuItem render={<Link to="/profile" />}>
                    <UserRoundIcon />
                    Profilo
                  </DropdownMenuItem>

                  <DropdownMenuItem render={<Link to="/my-posts" />}>
                    <FilePenLineIcon />
                    I miei articoli
                  </DropdownMenuItem>

                  {/* logout */}
                  <DropdownMenuItem onClick={logout}>
                    <LogOutIcon />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="max-md:hidden"
                render={<Link to="/login" />}
                nativeButton={false}
              >
                Login
              </Button>

              <Button
                variant="default"
                className="max-md:hidden"
                render={<Link to="/register" />}
                nativeButton={false}
              >
                Register
              </Button>
            </>
          )}

          {/* Navigation for small screens */}
          <div className="flex gap-3 md:hidden">
            {!authUser && <Button
              variant="default"
              size="icon"
              render={<Link to="/register" />}
              nativeButton={false}
            >
              <UserPlus2 />
              <span className="sr-only">Registrati</span>
            </Button>}

            <MenuDropdown
              align="end"
              navigationData={navigationData}
              trigger={
                <Button variant="outline" size="icon">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
