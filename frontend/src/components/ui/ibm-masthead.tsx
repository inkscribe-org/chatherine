import React from "react";
import {
  Navbar,
  NavbarSection,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarSearch,
  NavbarDropdown,
  NavbarAvatar,
} from "@/components/ui/navbar";
import { Search, User } from "lucide-react";

export function IBMMasthead() {
  return (
    <Navbar className="bg-white border-b border-gray-200 h-16">
      <NavbarSection position="start">
        <NavbarBrand href="#" className="text-xl font-semibold p-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-content font-bold text-sm">
              C
            </div>
            Chathy
          </div>
        </NavbarBrand>
      </NavbarSection>

      <NavbarSection position="center">
        <div className="hidden lg:flex">
          <NavbarMenu horizontal>
            <NavbarMenuItem>
              <button className="btn btn-ghost">Home</button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button className="btn btn-ghost">Products</button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button className="btn btn-ghost">Solutions</button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button className="btn btn-ghost">About</button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <button className="btn btn-ghost">Contact</button>
            </NavbarMenuItem>
          </NavbarMenu>
        </div>
      </NavbarSection>

      <NavbarSection position="end">
        <div className="flex items-center gap-2">
          <NavbarSearch placeholder="Search" className="hidden md:flex" />
          <button className="btn btn-ghost btn-circle md:hidden">
            <Search className="h-5 w-5" />
          </button>
          <NavbarDropdown end>
            <NavbarAvatar alt="User" />
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
      </NavbarSection>
    </Navbar>
  );
}