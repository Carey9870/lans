"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Home,
  UserCircle,
  Wrench,
  Sheet,
  Phone,
  Users,
  Info,
  Hourglass,
  MapPin,
  Building2,
  ClipboardList,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

export default function MobileMenu() {
  const [featuresOpen, setFeaturesOpen] = useState(false);

  return (
    <div className="flex flex-col h-full gap-y-3 items-start text-lg font-semibold overflow-y-auto">
      <Link href="/" className="text-lg font-semibold">
        <div className="ml-4 hover:underline flex items-center gap-3 ">
          <span>
            <Home className="text-amber-500" />{" "}
          </span>
          Home
        </div>
      </Link>

      <Separator className="my-4" />

      {/* FEATURES */}
      <button
        className="flex justify-between items-center text-lg font-semibold"
        onClick={() => setFeaturesOpen(!featuresOpen)}
      >
        <div className="ml-4 hover:underline flex items-center gap-3 ">
            <UserCircle className="text-amber-500" />{" "}
          About Us
        </div>
        {featuresOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      {featuresOpen && (
        <div className="flex flex-col ml-18 space-y-3 text-[16px]">
          <Link
            className="hover:underline"
            href="/about/management-and-leadership"
          >
            <div className="flex gap-x-3">
              <Users className="text-green-500" />
              Management and Leadership
            </div>
          </Link>
          <Link
            className="hover:underline"
            href="/about/about-the-state-department"
          >
            <div className="flex gap-x-3">
              <Info className="text-pink-500" />
              About the State Department
            </div>
          </Link>
          <Link 
            className="hover:underline" 
            href="/about/history"
          >
            <div className="flex gap-x-3">
              <Hourglass className="text-sky-500" />
              History
            </div>
          </Link>
          <Link 
            className="hover:underline" 
            href="/about/land-registries"
          >
            <div className="flex gap-x-3">
              <MapPin className="text-red-600" />
              Land Registries
            </div>
          </Link>
          <Link 
            className="hover:underline" 
            href="/about/departments"
          >
            <div className="flex gap-x-3">
              <Building2 className="text-cyan-500" />
              Department Functions
            </div>
          </Link>
          <Link 
            className="hover:underline" 
            href="/about/vacancies"
          >
            <div className="flex gap-x-3">
              <ClipboardList className="text-emerald-500" />
              Vacancies
            </div>
          </Link>
        </div>
      )}

      <Separator className="my-4" />

      <Link href="/services" className="text-lg hover:underline font-semibold">
        <div className="ml-4 flex items-center gap-x-3 ">
          <span>
            <Wrench className="text-amber-500" />{" "}
          </span>
          Services
        </div>
      </Link>

      <Separator className="my-4" />

      <Link href="/forms" className="text-lg hover:underline font-semibold">
        <div className="ml-4 flex items-center gap-x-3 ">
          <span>
            <Sheet className="text-amber-500" />{" "}
          </span>
          Forms
        </div>
      </Link>

      <Separator className="my-4" />

      <Link href="/contact-us" className="text-lg hover:underline font-semibold">
        <div className="ml-4 flex items-center gap-x-3 ">
          <span>
            <Phone className="text-amber-500" />{" "}
          </span>
          Contacts
        </div>
      </Link>

      {/* Bottom Section */}
      {/* <div className="mt-auto pt-6 space-y-6">
        <Button className="w-full bg-green-600 text-white hover:bg-green-700">
          Pay and Get Paid
        </Button>

        <div className="flex justify-around mt-4">
          <Button variant="outline">FB</Button>
          <Button variant="outline">IG</Button>
          <Button variant="outline">IN</Button>
          <Button variant="outline">X</Button>
          <Button variant="outline">TG</Button>
        </div>
      </div> */}
    </div>
  );
}
