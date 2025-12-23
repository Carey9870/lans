"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  History,
  Home,
  MessageCircle,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import MobileMenu from "@/components/mobile-menu";
import { Input } from "@/components/ui/input";

import { SearchModal } from "./search-modal";


export function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("navbar-search");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <header className="bg-khaki border-b">
        <div className="max-w-8xl mx-auto px-4 py-4 gap-x-3 flex justify-between items-center">
          {/* Logo */}
          <div className="bg-white h-full">
            <Link href="/" className="flex items-start gap-2 font-bold text-xl">
              <Image
                src="/logo.png"
                alt="Payout logo"
                width={900}
                height={900}
                priority
                className="rounded-sm shrink-0 w-auto h-16"
              />
            </Link>
          </div>

          {/* ---- RIGHT SIDE: Pay Button → Hamburger → UserButton ---- */}

          {/* Desktop Nav */}
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center gap-4">
              {/* HOW IT WORKS — MEGA DROPDOWN */}
              <Link
                href="/"
                className="flex hover:underline items-center gap-2 text-white font-bold transition-colors"
              >
                Home
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex hover:underline items-center gap-1 text-white hover:text-amber-800 font-bold"
                  >
                    About Us
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="center" className="w-[770px] p-8">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    {/* LEFT: Features */}
                    <div className="pr-10 space-y-6">
                      <Link
                        href="/about/about-the-state-department"
                        className="block"
                      >
                        <h3 className="text-lg font-bold text-black hover:underline">
                          1. About the State Department
                        </h3>
                        <p className="text-sm ml-4 text-muted-foreground">
                          Essential information about the Ministry
                        </p>
                      </Link>

                      <div className="space-y-5 mt-3">
                        <Link href="/about/history" className="block group">
                          <div className="font-bold group-hover:text-black group-hover:underline">
                            2. History
                          </div>
                          <div className="text-sm ml-4 text-muted-foreground">
                            History of the Ministry
                          </div>
                        </Link>
                        <Link
                          href="/about/land-registries"
                          className="block group"
                        >
                          <div className="font-bold group-hover:text-black group-hover:underline">
                            3. Land Registries
                          </div>
                          <div className="text-sm ml-4 text-muted-foreground">
                            Know all about land registries
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* RIGHT: PayOut Business */}
                    <div className="pl-10 space-y-6">
                      <Link href={"/about/management-and-leadership"}>
                        <h3 className="font-bold text-lg text-black flex items-center gap-2 hover:underline">
                          1. Management & Leadership
                        </h3>
                        <p className="text-sm ml-4 text-muted-foreground">
                          Know about us
                        </p>
                      </Link>

                      <div className="space-y-5 mt-3">
                        <Link href="/about/departments" className="block group">
                          <div className="font-bold group-hover:text-black group-hover:underline">
                            2. Department Functions
                          </div>
                          <div className="text-sm ml-4 text-muted-foreground">
                            Know about the ministries departments
                          </div>
                        </Link>
                        <Link href="/about/vacancies" className="block group">
                          <div className="font-bold group-hover:text-black group-hover:underline">
                            3. Vacancies
                          </div>
                          <div className="text-sm ml-4 text-muted-foreground">
                            Check out our vacancies
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/services"
                className="flex items-center hover:underline font-bold gap-2 text-white transition-colors"
              >
                Services
              </Link>

              <Link
                href="/resources"
                className="text-white hover:underline font-bold"
              >
                Resources
              </Link>

              <Link
                href="/forms"
                className="flex hover:underline items-center font-bold gap-2 text-white transition-colors"
              >
                Forms
              </Link>

              {/* DEVELOPERS LINK — NEW */}
              <Link
                href="/media-center"
                className="flex items-center hover:underline font-bold gap-2 text-white transition-colors"
              >
                Media Center
              </Link>

              {/* History Link */}
              <Link
                href="/contact-us"
                className={`flex font-bold hover:underline items-center gap-2 transition-colors ${
                  pathname === "/history"
                    ? "text-white font-semibold"
                    : "text-white"
                }`}
              >
                Contact Us
              </Link>

              {/* SEARCH BAR */}
              <div className="relative flex items-center">
                <Search className="absolute text-black left-3 h-4 w-4" />
                <Input
                  id="navbar-search"
                  type="text"
                  placeholder="Search..."
                  className="w-56 pl-10 text-black pr-16 py-2 rounded-md border border-black bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-muted px-1.5 py-0.5 rounded">
                  Ctrl + K
                </kbd>
              </div>
            </nav>

            {/* ---------- MEDIUM SCREEN NAV (md to lg) ---------- */}
            <nav className="hidden md:flex lg:hidden items-center gap-3">
              <Link
                href="/"
                className="flex hover:underline items-center gap-2 text-white font-bold transition-colors"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="flex items-center hover:underline font-bold gap-2 text-white transition-colors"
              >
                Services
              </Link>

              {/* Search Icon → opens modal */}
              {/* <SearchModal /> */}
              {/* SEARCH BAR */}
              <div className="relative flex items-center">
                <Search className="absolute text-black left-3 h-4 w-4" />
                <Input
                  id="navbar-search"
                  type="text"
                  placeholder="Search..."
                  className="w-56 pl-10 text-black pr-16 py-2 rounded-md border border-black bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-muted px-1.5 py-0.5 rounded">
                  Ctrl + K
                </kbd>
              </div>
            </nav>

            {/* ---------- SMALL SCREEN NAV (< md) ---------- */}
            <nav className="flex md:hidden items-center gap-4">
              {/* Search Icon */}
              <SearchModal />

              {/* <div className="flex items-center gap-4"> */}
              {/* Hamburger (mobile only) */}
              <div className="lg:hidden flex items-center">
                <Sheet>
                  <SheetTrigger>
                    <Menu className="h-6 w-6 text-white" />
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-[85vw] sm:w-[380px] flex flex-col"
                  >
                    <SheetHeader className="flex h-5 mt-5 flex-row items-center justify-start">
                      <SheetTitle className="text-xl font-bold">
                        State Department for Lands and Physical Planning
                      </SheetTitle>
                    </SheetHeader>

                    <Separator className="my-4" />

                    <MobileMenu />
                  </SheetContent>
                </Sheet>
              </div>
              {/* </div> */}
            </nav>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
          <div className="flex justify-around py-2">
            <Link
              href="/"
              className={`flex flex-col items-center font-bold p-2 ${
                pathname === "/" ? "text-amber-700" : "text-muted-foreground"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>

            <Link
              href="/services"
              className={`flex flex-col items-center font-bold p-2 ${
                pathname === "/services"
                  ? "text-amber-700"
                  : "text-amber-700"
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Services</span>
            </Link>

            <Link
              href="/resources"
              className={`flex flex-col items-center font-bold p-2 ${
                pathname === "/resources"
                  ? "text-amber-700"
                  : "text-amber-700"
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs">Resources</span>
            </Link>

            <Link
              href="/forms"
              className={`flex flex-col items-center font-bold p-2 ${
                pathname === "/history"
                  ? "text-amber-700"
                  : "text-amber-700"
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs">Forms</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
