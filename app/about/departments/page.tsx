// app/functions/page.tsx
import {
  MapPinned,
  Gavel,
  Compass,
  DollarSign,
  ScrollText,
  Building2,
  Globe,
  PersonStanding,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const directorates = [
  {
    title: "Directorate of Physical Planning",
    icon: MapPinned,
    color: "from-emerald-500 to-teal-600",
    description:
      "Provision of advisory and national Physical Planning services; general principles on land planning and coordination of planning by counties in terms of policies, standards and guidelines and technical assistance; capacity building for counties on Physical Planning.",
  },
  {
    title: "Directorate of Land Adjudication and Settlement",
    icon: Gavel,
    color: "from-amber-500 to-orange-600",
    description:
      "Ascertainment of land rights and interests, land consolidation and adjudication; acquisition of agriculturally viable land for settlement of poor landless Kenyans; management of the Agricultural Settlement Fund; management of group ranches as well as arbitration of land disputes.",
  },
  {
    title: "Directorate of Surveys",
    icon: Compass,
    color: "from-blue-500 to-cyan-600",
    description:
      "The official Government agency for land surveying and mapping. Responsibilities include production, maintenance and distribution of accurate geographical data in the form of analogue and digital maps in all ranges of scales.",
  },
  {
    title: "Directorate of Land Administration",
    icon: Building2,
    color: "from-purple-500 to-indigo-600",
    description:
      "Administration and management of private land, control and regulation of land use and property in respect of all categories of land and maintenance of land records.",
  },
  {
    title: "Directorate of Valuation",
    icon: DollarSign,
    color: "from-rose-500 to-pink-600",
    description:
      "Valuation of land and assets for stamp duty, Government leasing including foreign missions, asset valuation, rating and development of National Land Value Index.",
  },
  {
    title: "Directorate of Land Registration",
    icon: ScrollText,
    color: "from-green-600 to-emerald-700",
    description:
      "Registration of land transactions and other legal documents, and determination of land and boundary disputes in collaboration with Surveys Department.",
  },
];

export default function DepartmentFunctions() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-amber-800 to-green-900 text-white">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative container mx-auto px-6 py-24 lg:py-32 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl font-serif tracking-wide md:text-6xl font-bold mb-6 leading-tight">
                Department Functions
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                Six specialized directorates working together to deliver
                efficient, transparent, and equitable land administration across
                Kenya
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium">
                  <Globe className="inline-block w-6 h-6 mr-2" />
                  National Coverage
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium">
                  <PersonStanding className="inline-block w-6 h-6 mr-2" />
                  Citizen-Centered Services
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-10">
          {/* Introduction */}
          <div className="text-center font-sans max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold underline text-black mb-3">
              Our Six Core Directorates
            </h2>
            <p className="text-xl font-serif text-black leading-relaxed">
              Each directorate plays a critical role in ensuring sustainable
              land management, secure tenure, and equitable access to land
              resources for all Kenyans.
            </p>
          </div>

          {/* Directorates Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {directorates.map((dir, index) => {
              const Icon = dir.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-green-200 overflow-hidden p-0"
                >
                  <div className={`h-2 bg-linear-to-r ${dir.color}`}></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-4 rounded-full bg-linear-to-br ${dir.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-10 h-10" />
                      </div>
                      <CardTitle className="text-2xl pt-3 text-gray-900 leading-tight">
                        {dir.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lg leading-relaxed text-gray-700">
                      {dir.description}
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Directorate</span>
                      <span className="font-medium text-green-700">
                        #{index + 1} of 6
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="mt-20 bg-linear-to-r from-amber-800 via-emerald-800 to-green-800 rounded-3xl p-12 text-white">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-serif md:text-5xl font-semibold tracking-wide mb-8">
                One Mission. Six Directorates. Transforming Land Administration.
              </h2>
              <p className="text-xl font-serif md:text-2xl leading-relaxed text-white">
                From physical planning and surveying to registration and
                valuation — every function is designed to secure land rights,
                promote sustainable development, and empower Kenyan citizens
                through transparent and efficient services.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-10 py-6 inline-block">
                  <p className="text-3xl font-serif tracking-wide font-bold">
                    Vision 2030 • BETA Agenda • Digital Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center py-10">
            <p className="text-2xl font-bold font-serif text-black">
              Secure Land. Secure Future.
            </p>
            <p className="text-lg text-black mt-4">
              The State Department for Lands and Physical Planning — Serving
              Kenya with Excellence Since Independence.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
