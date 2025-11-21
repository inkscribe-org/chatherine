
import {
  NavbarBasic,
  NavbarWithIcon,
  NavbarWithStartEndIcons,
  NavbarWithMenu,
  NavbarWithSearch,
  NavbarWithCartAndUser,
  NavbarResponsive,
  NavbarCenterLayout,
} from "./navbar-examples"

export function NavbarShowcase() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold mb-8">daisyUI Navbar Components Showcase</h1>
      
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Basic Navbar</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarBasic />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Navbar with Icon</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarWithIcon />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Navbar with Start and End Icons</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarWithStartEndIcons />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Navbar with Menu and Submenu</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarWithMenu />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Navbar with Search and Avatar</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarWithSearch />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Navbar with Cart and User Dropdown</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarWithCartAndUser />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Responsive Navbar</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarResponsive />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Center Layout Navbar</h2>
          <div className="border border-base-300 rounded-lg p-4">
            <NavbarCenterLayout />
          </div>
        </div>
      </div>
    </div>
  )
}
