import * as React from "react"
import { cn } from "@/lib/utils"

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "center" | "responsive"
  children?: React.ReactNode
}

export interface NavbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "start" | "center" | "end"
  children?: React.ReactNode
}

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string
  children?: React.ReactNode
}

export interface NavbarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  horizontal?: boolean
  children?: React.ReactNode
}

export interface NavbarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
}

export interface NavbarDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  end?: boolean
  children?: React.ReactNode
}

export interface NavbarSearchProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("navbar bg-base-100 shadow-sm", className)}
        {...props}
      >
        {children}
      </nav>
    )
  }
)
Navbar.displayName = "Navbar"

const NavbarSection = React.forwardRef<HTMLDivElement, NavbarSectionProps>(
  ({ className, position, children, ...props }, ref) => {
    const positionClass = position ? `navbar-${position}` : ""
    return (
      <div
        ref={ref}
        className={cn(positionClass, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
NavbarSection.displayName = "NavbarSection"

const NavbarBrand = React.forwardRef<HTMLAnchorElement, NavbarBrandProps>(
  ({ className, href = "#", children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn("btn btn-ghost text-xl", className)}
        {...props}
      >
        {children}
      </a>
    )
  }
)
NavbarBrand.displayName = "NavbarBrand"

const NavbarMenu = React.forwardRef<HTMLUListElement, NavbarMenuProps>(
  ({ className, horizontal = true, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("menu", horizontal && "menu-horizontal", "px-1", className)}
        {...props}
      >
        {children}
      </ul>
    )
  }
)
NavbarMenu.displayName = "NavbarMenu"

const NavbarMenuItem = React.forwardRef<HTMLLIElement, NavbarMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li ref={ref} className={className} {...props}>
        {children}
      </li>
    )
  }
)
NavbarMenuItem.displayName = "NavbarMenuItem"

const NavbarDropdown = React.forwardRef<HTMLDivElement, NavbarDropdownProps>(
  ({ className, end = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("dropdown", end && "dropdown-end", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
NavbarDropdown.displayName = "NavbarDropdown"

const NavbarSearch = React.forwardRef<HTMLInputElement, NavbarSearchProps>(
  ({ className, placeholder = "Search", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={cn("input input-bordered w-24 md:w-auto", className)}
        {...props}
      />
    )
  }
)
NavbarSearch.displayName = "NavbarSearch"

// Menu Button component for mobile menu
const NavbarMenuButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("dropdown", className)}
        {...props}
      >
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabIndex={0} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          {children}
        </ul>
      </div>
    )
  }
)
NavbarMenuButton.displayName = "NavbarMenuButton"

// Avatar component
const NavbarAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  src?: string
  alt?: string
}>(({ className, src, alt = "Avatar", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      tabIndex={0}
      role="button"
      className={cn("btn btn-ghost btn-circle avatar", className)}
      {...props}
    >
      <div className="w-10 rounded-full">
        {src ? (
          <img alt={alt} src={src} />
        ) : (
          children || (
            <div className="w-10 h-10 bg-primary text-primary-content flex items-center justify-center">
              {alt.charAt(0).toUpperCase()}
            </div>
          )
        )}
      </div>
    </div>
  )
})
NavbarAvatar.displayName = "NavbarAvatar"

// Icon Button component
const NavbarIconButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode
}>(({ className, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn("btn btn-ghost btn-circle", className)}
      {...props}
    >
      {icon || (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}
    </button>
  )
})
NavbarIconButton.displayName = "NavbarIconButton"

// Cart with indicator component
const NavbarCart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  count?: number
}>(({ className, count = 0, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("dropdown dropdown-end", className)} {...props}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {count > 0 && (
            <span className="badge badge-sm indicator-item">{count}</span>
          )}
        </div>
      </div>
    </div>
  )
})
NavbarCart.displayName = "NavbarCart"

export {
  Navbar,
  NavbarSection,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarDropdown,
  NavbarSearch,
  NavbarMenuButton,
  NavbarAvatar,
  NavbarIconButton,
  NavbarCart,
}
