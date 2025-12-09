"use client";

import {
  Home,
  Building2,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Main Footer */}
      <div className="bg-footer w-full text-white flex md:flex-row flex-col justify-center items-start p-5 md:p-15">
        {/* Logo & Social Icons */}
        <div className="p-4 max-w-xs">
          <ul>
            <p className="flex font-bold text-2xl pb-3">
              <span className="underline">Social Handles</span>
            </p>
            <div className="flex items-start flex-col gap-4 pb-2">
              <p className="flex items-center gap-7">
                <Twitter className="text-2xl text-white bg-blue-500 cursor-pointer transition" />{" "}
                X
              </p>
              <p className="flex items-center gap-7">
                <Facebook className="text-2xl text-white bg-blue-500 cursor-pointer transition" />{" "}
                Facebook
              </p>
              <p className="flex items-center gap-7">
                <Youtube className="text-2xl text-white bg-blue-500 cursor-pointer transition" />{" "}
                YouTube
              </p>
            </div>
          </ul>
        </div>

        {/* Quick Links Section - Optimized with next/link */}
        <div className="p-5 flex justify-center">
          <ul className="space-y-4">
            <p className="underline font-bold text-2xl pb-4 text-center">
              Quick Links
            </p>

            {/* KISM - External */}
            <li>
              <a
                href="https://www.kism.ac.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-md font-medium hover:text-blue-600 cursor-pointer transition-colors duration-200 inline-block"
              >
                KISM
              </a>
            </li>

            {/* Internal Links using Next.js Link */}
            <li>
              <Link
                href="/active-tenders"
                className="text-md font-medium hover:text-blue-600 cursor-pointer transition-colors duration-200 inline-block"
              >
                Tenders
              </Link>
            </li>

            <li>
              <Link
                href="/public-notices"
                className="text-md font-medium hover:text-blue-600 cursor-pointer transition-colors duration-200 inline-block"
              >
                Public Notices
              </Link>
            </li>

            <li>
              <Link
                href="/gazette-notices"
                className="text-md font-medium hover:text-blue-600 cursor-pointer transition-colors duration-200 inline-block"
              >
                Gazette Notices
              </Link>
            </li>

            <li>
              <Link
                href="/faqs"
                className="text-md font-medium hover:text-blue-600 cursor-pointer transition-colors duration-200 inline-block"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-5">
          <p className="underline font-bold text-2xl pb-6">
            Contact Information
          </p>

          <ul className="space-y-4">
            {/* Ministry / Department */}
            <li className="flex items-start gap-3 text-md font-medium">
              <Building2 className="w-5 h-5 mt-0.5 text-white bg-blue-500" />
              <span>State Department for Lands &amp; Physical Planning</span>
            </li>

            {/* Physical address - Ardhi House */}
            <li className="flex items-start gap-3 text-md font-medium">
              <Home className="w-5 h-5 mt-0.5 text-white bg-blue-500" />
              <span>Ardhi House, 1st Ngong Avenue, Off Ngong Road</span>
            </li>

            {/* Postal address */}
            <li className="flex items-start gap-3 text-md font-medium">
              <MapPin className="w-5 h-5 mt-0.5 text-white bg-blue-500" />
              <span>P.O. Box 30450-00100, Nairobi, Kenya</span>
            </li>

            {/* Phone */}
            <li className="flex items-center gap-3 text-md font-medium">
              <Phone className="w-5 h-5 text-white bg-blue-500" />
              <span>(+254) 202718050</span>
            </li>

            {/* Email */}
            <li className="flex items-center gap-3 text-md font-medium">
              <Mail className="w-5 h-5 text-white bg-blue-500" />
              <Link href="mailto:info@ardhi.go.ke" className="hover:underline">
                info@ardhi.go.ke
              </Link>
            </li>

            {/* Optional website (if you have one) */}
            {/* <li className="flex items-center gap-3 text-md font-medium">
                <Globe className="w-5 h-5 text-gray-600" />
                <a href="https://www.ardhi.go.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  www.ardhi.go.ke
                </a>
            </li> */}
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="p-5 w-full md:w-96">
          <p className=" font-serif font-bold text-2xl underline pb-4">Subscribe to Newsletter</p>
          <form className="relative flex flex-col gap-3 mt-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="email"
                placeholder="Subscribe to newsletter"
                className="w-full pl-12 pr-8 py-8 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black"
              />
            </div>
            <Button
              type="submit"
              className="px-8 py-8 bg-blue-600 text-white font-bold tracking-wide rounded-lg hover:bg-blue-700 active:scale-95 transition transform"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex bg-black flex-col justify-center items-center text-center p-3">
        <h1 className="text-white font-medium">
          © {new Date().getFullYear()} All rights reserved
        </h1>
      </div>
    </>
  );
}
