# daisyUI Navbar Components

A comprehensive set of React navbar components built with daisyUI and Tailwind CSS, following the official daisyUI navbar documentation patterns.

## Components Overview

### Core Components

#### `Navbar`
The main navbar container component.

```tsx
import { Navbar } from '@/components/ui/navbar'

<Navbar className="bg-primary text-primary-content">
  {/* navbar content */}
</Navbar>
```

#### `NavbarSection`
Positions content within the navbar (start, center, end).

```tsx
import { NavbarSection } from '@/components/ui/navbar'

<NavbarSection position="start">
  {/* left side content */}
</NavbarSection>
<NavbarSection position="center">
  {/* center content */}
</NavbarSection>
<NavbarSection position="end">
  {/* right side content */}
</NavbarSection>
```

#### `NavbarBrand`
The brand/logo element of the navbar.

```tsx
import { NavbarBrand } from '@/components/ui/navbar'

<NavbarBrand href="/">Your Brand</NavbarBrand>
```

#### `NavbarMenu`
A menu component for navigation links.

```tsx
import { NavbarMenu, NavbarMenuItem } from '@/components/ui/navbar'

<NavbarMenu horizontal>
  <NavbarMenuItem>
    <a href="/home">Home</a>
  </NavbarMenuItem>
  <NavbarMenuItem>
    <details>
      <summary>Dropdown</summary>
      <ul className="p-2 bg-base-100">
        <NavbarMenuItem>
          <a href="/item1">Item 1</a>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <a href="/item2">Item 2</a>
        </NavbarMenuItem>
      </ul>
    </details>
  </NavbarMenuItem>
</NavbarMenu>
```

### Utility Components

#### `NavbarSearch`
Search input component.

```tsx
import { NavbarSearch } from '@/components/ui/navbar'

<NavbarSearch placeholder="Search..." />
```

#### `NavbarAvatar`
User avatar with dropdown support.

```tsx
import { NavbarAvatar, NavbarDropdown } from '@/components/ui/navbar'

<NavbarDropdown end>
  <NavbarAvatar
    src="/path/to/avatar.jpg"
    alt="User Name"
  />
  <ul tabIndex={-1} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
    <li><a href="/profile">Profile</a></li>
    <li><a href="/settings">Settings</a></li>
    <li><a href="/logout">Logout</a></li>
  </ul>
</NavbarDropdown>
```

#### `NavbarIconButton`
Icon button for actions.

```tsx
import { NavbarIconButton } from '@/components/ui/navbar'

<NavbarIconButton
  icon={<YourIcon />}
  onClick={() => console.log('clicked')}
/>
```

#### `NavbarCart`
Shopping cart with badge indicator.

```tsx
import { NavbarCart } from '@/components/ui/navbar'

<NavbarCart count={5}>
  {/* cart dropdown content */}
</NavbarCart>
```

#### `NavbarMenuButton`
Mobile menu toggle button.

```tsx
import { NavbarMenuButton } from '@/components/ui/navbar'

<NavbarMenuButton>
  <NavbarMenuItem>
    <a href="/mobile-item">Mobile Item</a>
  </NavbarMenuItem>
</NavbarMenuButton>
```

## Examples

See `src/components/examples/navbar-examples.tsx` for complete implementation examples:

- `NavbarBasic` - Simple navbar with brand only
- `NavbarWithIcon` - Navbar with action icon
- `NavbarWithStartEndIcons` - Icons on both sides
- `NavbarWithMenu` - With navigation menu and submenu
- `NavbarWithSearch` - With search input and avatar
- `NavbarWithCartAndUser` - E-commerce style with cart and user menu
- `NavbarResponsive` - Responsive design with mobile menu
- `NavbarCenterLayout` - Center-aligned brand with side actions
- `WatsonProbeNavbar` - Production-ready example

## Usage in Your App

```tsx
import { WatsonProbeNavbar } from '@/components/examples/navbar-examples'

function App() {
  return (
    <div data-theme="carbon" className="min-h-screen bg-base-100">
      <WatsonProbeNavbar />
      {/* rest of your app */}
    </div>
  )
}
```

## Development Server

Run `npm run dev` and visit:
- `http://localhost:5174/` - Main app with Watson Probe navbar
- `http://localhost:5174/navbar-showcase` - Component showcase

## Styling

All components use daisyUI classes and respect the Carbon theme configuration in `tailwind.config.js`. The components automatically adapt to the `data-theme` attribute on your root element.

## TypeScript Support

Full TypeScript support with proper interfaces:
- `NavbarProps`
- `NavbarSectionProps`
- `NavbarBrandProps`
- `NavbarMenuProps`
- `NavbarMenuItemProps`
- `NavbarDropdownProps`
- `NavbarSearchProps`
- Plus typed props for all utility components

## Accessibility

Components follow ARIA practices:
- Proper roles and tab indices
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
