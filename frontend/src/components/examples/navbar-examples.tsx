
import {
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
} from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Menu, MoreHorizontal, Search, Bell, Pencil } from 'lucide-react'

// Basic navbar with title only
export function NavbarBasic() {
  return (
    <Navbar>
      <NavbarBrand>daisyUI</NavbarBrand>
    </Navbar>
  )
}

// Navbar with title and icon
export function NavbarWithIcon() {
  return (
    <Navbar>
      <div className="flex-1">
        <NavbarBrand>daisyUI</NavbarBrand>
      </div>
      <div className="flex-none">
        <NavbarIconButton
          icon={<Search className="h-5 w-5" />}
        />
      </div>
    </Navbar>
  )
}

// Navbar with icon at start and end
export function NavbarWithStartEndIcons() {
  return (
    <Navbar>
      <div className="flex-none">
        <NavbarIconButton
          icon={<Menu className="w-5 h-5" />}
        />
      </div>
      <div className="flex-1">
        <NavbarBrand>daisyUI</NavbarBrand>
      </div>
      <div className="flex-none">
        <NavbarIconButton
          icon={<MoreHorizontal className="w-5 h-5" />}
        />
      </div>
    </Navbar>
  )
}

// Navbar with menu and submenu
export function NavbarWithMenu() {
  return (
    <Navbar>
      <div className="flex-1">
        <NavbarBrand>daisyUI</NavbarBrand>
      </div>
      <div className="flex-none">
        <NavbarMenu>
          <NavbarMenuItem>
            <button>Link</button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-base-100">
                <NavbarMenuItem>
                  <button>Link 1</button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <button>Link 2</button>
                </NavbarMenuItem>
              </ul>
            </details>
          </NavbarMenuItem>
        </NavbarMenu>
      </div>
    </Navbar>
  )
}

// Navbar with search input and dropdown
export function NavbarWithSearch() {
  return (
    <Navbar>
      <div className="flex-1">
        <NavbarBrand>daisyUI</NavbarBrand>
      </div>
      <div className="flex gap-2">
        <NavbarSearch />
        <NavbarDropdown end>
          <NavbarAvatar
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="User Avatar"
          />
          <ul tabIndex={-1} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <button className="justify-between">
                Profile
                <span className="badge">New</span>
              </button>
            </li>
            <li>
              <button>Settings</button>
            </li>
            <li>
              <button>Logout</button>
            </li>
          </ul>
        </NavbarDropdown>
      </div>
    </Navbar>
  )
}

// Navbar with cart and user dropdown
export function NavbarWithCartAndUser() {
  return (
    <Navbar>
      <div className="flex-1">
        <NavbarBrand>daisyUI</NavbarBrand>
      </div>
      <div className="flex-none">
        <NavbarCart count={8}>
          <div tabIndex={0} className="mt-3 z-1 card card-compact w-52 dropdown-content bg-base-100 shadow">
            <div className="card-body">
              <span className="font-bold text-lg">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </NavbarCart>
        <NavbarDropdown end>
          <NavbarAvatar
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="User Avatar"
          />
          <ul tabIndex={-1} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <button className="justify-between">
                Profile
                <span className="badge">New</span>
              </button>
            </li>
            <li>
              <button>Settings</button>
            </li>
            <li>
              <button>Logout</button>
            </li>
          </ul>
        </NavbarDropdown>
      </div>
    </Navbar>
  )
}

// Responsive navbar (dropdown menu on small screen, center menu on large screen)
export function NavbarResponsive() {
  return (
    <Navbar>
      <NavbarSection position="start">
        <NavbarMenuButton>
          <NavbarMenuItem>
            <button>Item 1</button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-base-100 w-40">
                <NavbarMenuItem>
                  <button>Submenu 1</button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <button>Submenu 2</button>
                </NavbarMenuItem>
              </ul>
            </details>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <button>Item 3</button>
          </NavbarMenuItem>
        </NavbarMenuButton>
        <NavbarBrand>daisyUI</NavbarBrand>
      </NavbarSection>
      <NavbarSection position="center">
        <div className="hidden lg:flex">
          <NavbarMenu>
            <NavbarMenuItem>
              <button>Item 1</button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <details>
                <summary>Parent</summary>
                <ul className="p-2 bg-base-100 w-40">
                  <NavbarMenuItem>
                    <button>Submenu 1</button>
                  </NavbarMenuItem>
                  <NavbarMenuItem>
                    <button>Submenu 2</button>
                  </NavbarMenuItem>
                </ul>
              </details>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button>Item 3</button>
            </NavbarMenuItem>
          </NavbarMenu>
        </div>
      </NavbarSection>
      <NavbarSection position="end">
        <button className="btn">Button</button>
      </NavbarSection>
    </Navbar>
  )
}

// Center navbar with dropdown, center logo and icon
export function NavbarCenterLayout() {
  return (
    <Navbar>
      <NavbarSection position="start">
        <NavbarDropdown>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Menu className="h-5 w-5" />
          </div>
          <ul tabIndex={-1} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><button>Homepage</button></li>
            <li><button>Portfolio</button></li>
            <li><button>About</button></li>
          </ul>
        </NavbarDropdown>
      </NavbarSection>
      <NavbarSection position="center">
        <NavbarBrand>daisyUI</NavbarBrand>
      </NavbarSection>
      <NavbarSection position="end">
        <NavbarIconButton
          icon={<Menu className="w-5 h-5" />}
        />
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell className="h-5 w-5" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </NavbarSection>
    </Navbar>
  )
}

export function WatsonProbeNavbar() {
  return (
    <Navbar className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-16 m-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary mr-10"></div>
              <NavbarBrand href="#" className="text-xl font-semibold p-0">Chatherine</NavbarBrand>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <Button variant="ghost">Sign in</Button>
            <Button>Get started</Button>
            <div className="divider divider-horizontal"></div>
            <NavbarDropdown end>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Pencil className="h-5 w-5" />
              </div>
            </NavbarDropdown>
           </div>
         </div>
     </Navbar>
  )
}
