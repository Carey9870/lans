import {
  Mountain,
  Globe,
  Target,
  ScrollText,
  Building2,
  MapPin,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-r from-amber-800 to-green-900 text-white">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-6 py-24 lg:py-32">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-serif md:text-6xl font-semibold mb-6 leading-tight">
                State Department for Lands and Physical Planning
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white font-sans">
                Driving Kenya&apos;s sustainable land management and equitable
                access to land resources in support of Vision 2030 and the
                Bottom-Up Economic Transformation Agenda (BETA)
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge
                  variant="secondary"
                  className="text-lg px-6 py-3 bg-white text-black"
                >
                  Vision 2030 Enabler
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-lg px-6 py-3 bg-white text-black"
                >
                  BETA Agenda Partner
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16 space-y-16">
          {/* Vision & Mission */}
          <section className="grid lg:grid-cols-2 gap-12 items-start">
            <Card className="border-2 font-serif border-amber-200 bg-amber-50/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-amber-600 rounded-full">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-amber-900">
                    Vision
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl leading-relaxed text-gray-800">
                  To be a{" "}
                  <strong className="text-amber-700">
                    globally competitive
                  </strong>{" "}
                  organization in sustainable land management
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 font-serif border-green-200 bg-green-50/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600 rounded-full">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-green-900">
                    Mission
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl leading-relaxed text-gray-800">
                  To facilitate improvement of the livelihood of Kenyans through{" "}
                  <strong className="text-green-700">
                    efficient land administration
                  </strong>
                  , equitable access, secure tenure and sustainable management
                  of land resource
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Mandate */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-4 text-black">
              Our Mandate
            </h2>
            <p className="text-center font-serif text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
              As per Executive Order No. 1 of 2023, the State Department is
              charged with policy direction and oversight of:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: ScrollText,
                  title: "National Land Policy and Management",
                  border: "border-green-600",
                  bg: "bg-green-50",
                  hoverBg: "hover:bg-green-100",
                },
                {
                  icon: Building2,
                  title: "Physical Planning for Land Use",
                  border: "border-blue-600",
                  bg: "bg-blue-50",
                  hoverBg: "hover:bg-blue-100",
                },
                {
                  icon: FileCheck,
                  title: "Land Transactions",
                  border: "border-purple-600",
                  bg: "bg-purple-50",
                  hoverBg: "hover:bg-purple-100",
                },
                {
                  icon: MapPin,
                  title: "Survey and Mapping",
                  border: "border-amber-600",
                  bg: "bg-amber-50",
                  hoverBg: "hover:bg-amber-100",
                },
                {
                  icon: ShieldCheck,
                  title: "Land Adjudication",
                  border: "border-teal-600",
                  bg: "bg-teal-50",
                  hoverBg: "hover:bg-teal-100",
                },
                {
                  icon: Globe,
                  title: "Land Registration",
                  border: "border-indigo-600",
                  bg: "bg-indigo-50",
                  hoverBg: "hover:bg-indigo-100",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className={`
                    border-2 ${item.border} ${item.bg} ${item.hoverBg}
                    hover:shadow-xl transition-all duration-300
                    group
                  `}
                >
                  <CardHeader>
                    <item.icon
                      className={`w-10 h-10 mb-3 group-hover:scale-110 text-red-600 transition-transform`}
                    />
                    <CardTitle className="text-lg text-gray-800">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="mt-12 bg-khaki text-white border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-white underline">
                  Core Functions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-4">
                  {[
                    "Formulation of the National Land Policy",
                    "Physical Planning for Land Use",
                    "Land Transactions & Survey and Mapping",
                    "Land Adjudication & Land Registration",
                    "National Spatial Infrastructure",
                    "Land and Property Valuation Services",
                    "Land Administration Systems",
                    "Maintenance of a Public Land Bank",
                    "Administration of Public Land as Designated by the Constitution",
                    "Land Settlement Policy and Management",
                    "Land Settlement Matters",
                    "Rural Settlement Planning",
                  ].map((func, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 bg-black rounded-full shrink-0"></div>
                      <span>{func}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Objectives */}
          <section className="bg-linear-to-r from-amber-800 to-green-900 text-white rounded-3xl p-12">
            <h2 className="text-4xl font-serif tracking-wide font-bold text-center mb-9">
              Strategic Objectives
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="flex gap-6">
                <div className="text-6xl font-bold text-green-300">01</div>
                <div>
                  <h3 className="text-2xl underline font-semibold mb-3">
                    Equity & Sustainability
                  </h3>
                  <p className="text-green-100 font-serif tracking-wide text-lg">
                    Ensure accessibility, equity and sustainable management of
                    land resource for socio-economic development
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-6xl font-bold text-green-300">02</div>
                <div>
                  <h3 className="text-2xl underline font-semibold mb-3">
                    Institutional Excellence
                  </h3>
                  <p className="text-green-100 tracking-wide font-serif text-lg">
                    Strengthen institutional capacity for efficient and
                    effective service delivery
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ministry Priorities */}
          <section>
            <h2 className="text-4xl font-bold font-serif text-center mb-10">
              Ministry&apos;s Priorities
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Digitalization",
                  desc: "Modern land records & digital services",
                  border: "border-blue-500",
                  bg: "bg-blue-50",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-700",
                  hoverBg: "hover:bg-blue-100",
                },
                {
                  title: "National Titling",
                  desc: "Secure land ownership nationwide",
                  border: "border-emerald-500",
                  bg: "bg-emerald-50",
                  iconBg: "bg-emerald-100",
                  iconColor: "text-emerald-700",
                  hoverBg: "hover:bg-emerald-100",
                },
                {
                  title: "Policy, Legal and Institutional Reforms",
                  desc: "Strengthening governance frameworks",
                  border: "border-amber-500",
                  bg: "bg-amber-50",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-700",
                  hoverBg: "hover:bg-amber-100",
                },
                {
                  title: "Decentralization",
                  desc: "Bringing services closer to the people",
                  border: "border-purple-500",
                  bg: "bg-purple-50",
                  iconBg: "bg-purple-100",
                  iconColor: "text-purple-700",
                  hoverBg: "hover:bg-purple-100",
                },
              ].map((priority, i) => (
                <Card
                  key={i}
                  className={`
                    text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                    border-2 ${priority.border} ${priority.bg} ${priority.hoverBg}
                    group
                  `}
                >
                  <CardHeader>
                    <div
                      className={`
                        mx-auto w-16 h-16 ${priority.iconBg} rounded-full 
                        flex items-center justify-center mb-4 
                        group-hover:scale-110 transition-transform duration-300
                      `}
                    >
                      <Mountain className={`w-10 h-10 ${priority.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl text-gray-800">
                      {priority.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-base text-gray-700">
                      {priority.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Footer Note */}
          <Separator className="my-9" />

          <div className="text-center p-0">
            <p className="text-lg text-black max-w-3xl mx-auto">
              The State Department for Lands and Physical Planning is a key
              determinant of social, economic and political transformation in
              Kenya.
            </p>
            <p className="mt-4 text-2xl font-serif font-bold text-black">
              Transforming Land. Transforming Lives.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
