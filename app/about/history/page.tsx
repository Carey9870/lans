// app/history/page.tsx
import { Building2, Map, FileText, Globe, Home, Landmark, Laptop, ScrollText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const timelineEvents = [
  {
    year: "1903",
    title: "Survey of Kenya is established",
    description: "Under the colonial government",
    icon: Map,
    color: "bg-blue-600",
  },
  {
    year: "1970s",
    title: "Land registries across the Country are established",
    description: "",
    icon: Building2,
    color: "bg-amber-600",
  },
  {
    year: "2000",
    title: "District Land registries are formed",
    description: "",
    icon: FileText,
    color: "bg-blue-600",
  },
  {
    year: "2010",
    title: "New Constitution introduces community land regime in policy",
    description: "",
    icon: Globe,
    color: "bg-amber-600",
  },
  {
    year: "2013",
    title: "Ministry of Lands is merged with Housing and Urban Development",
    description: "",
    icon: Home,
    color: "bg-blue-600",
  },
  {
    year: "2018",
    title: "Ministry of Lands and Physical Planning is retained",
    description: "",
    icon: Landmark,
    color: "bg-amber-600",
  },
  {
    year: "2021",
    title: "Ardhisasa is officially launched on April 27, 2021",
    description: "The National Land Information Management System (NLIMS) online portal",
    icon: Laptop,
    color: "bg-blue-600",
  },
  {
    year: "2023",
    title: "Ministry was reorganized into 3 State Departments",
    description: "Lands and Physical Planning, Housing and Urban Development, Public Works",
    icon: ScrollText,
    color: "bg-green-700",
  },
];

export default function HistoryPage() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="relative bg-linear-to-r from-amber-900 to-green-900 text-white py-24">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative container mx-auto px-6 text-center">
            <h1 className="text-4xl font-serif tracking-wide md:text-6xl font-bold mb-6">Our History</h1>
            <p className="text-xl font-serif md:text-2xl max-w-4xl mx-auto text-green-100">
              Over 120 years of transforming land administration in Kenya — from colonial surveys to digital revolution
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16 space-y-10">
          {/* Introduction */}
          <section className="max-w-5xl mx-auto text-center text-white">
            <Card className="border-green-200 font-serif bg-khaki shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl text-white underline">A Legacy of Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-lg leading-relaxed">
                <p>
                  The State Department is headquartered at <strong>Ardhi House, 1st Ngong Avenue, Nairobi</strong>, where all national land matters and related concerns are managed. Services under the Directorate of Surveys are offered from the Survey of Kenya headquarters located in <strong>Ruaraka, off Thika Road</strong>.
                </p>
                <p>
                  Additional services are provided through the respective <strong>County Land Registries</strong> where the land is registered.
                </p>
                <p>
                  The department has digitized its services in Nairobi and Murang’a. It also maintains a comprehensive library of filed paper records, some dating back to the year <strong>1900</strong>. These over 120-year-old records are securely stored in both digital and physical formats.
                </p>
                <div className="pt-6">
                  <p className="text-xl font-mono text-white">
                    In 2021, the <span className="underline decoration-black">National Land Information Management System (NLIMS)</span> online portal, <strong>Ardhisasa</strong>, was launched — enabling landowners and buyers to conduct various land transactions online.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="max-w-2xl mx-auto" />

          {/* Interactive Timeline */}
          <section className="relative">
            <h2 className="text-4xl font-serif md:text-5xl font-bold text-center mb-16 text-gray-900">
              Timeline of Transformation
            </h2>

            {/* Desktop & Tablet: Horizontal Timeline */}
            <div className="hidden lg:block relative">
              <div className="absolute left-0 right-0 top-1/8 h-1 bg-linear-to-r from-green-600 via-amber-500 to-green-600 transform -translate-y-1/2 rounded-full z-0"></div>

              <div className="relative grid grid-cols-8 gap-4">
                {timelineEvents.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div
                        className={`relative w-16 h-16 ${event.color} rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:shadow-3xl z-10`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                        {index === timelineEvents.length - 1 && (
                          <div className="absolute -inset-2 bg-green-400/30 rounded-full animate-ping"></div>
                        )}
                      </div>

                      <div className="mt-3 text-center max-w-48">
                        <p className="text-2xl font-bold text-gray-800">{event.year}</p>
                        <p className="mt-3 font-semibold text-gray-900 leading-tight">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="lg:hidden space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className="relative pl-12 pb-12 last:pb-0">
                    {/* Line */}
                    {index !== timelineEvents.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-linear-to-b from-gray-400 to-transparent"></div>
                    )}

                    {/* Dot */}
                    <div
                      className={`absolute left-0 top-2 w-12 h-12 ${event.color} rounded-full flex items-center justify-center shadow-xl ring-8 ring-white`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <Card className="border-l-4 border-green-600 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-gray-900">
                            {event.year}
                          </CardTitle>
                          {index === timelineEvents.length - 1 && (
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold font-serif text-gray-800">{event.title}</p>
                        {event.description && (
                          <CardDescription className="mt-2">
                            {event.description}
                          </CardDescription>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Final Message */}
          <section className="py-10 text-center">
            <Card className="max-w-4xl mx-auto bg-khaki text-white border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold md:text-4xl">
                  From 1903 to the Digital Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-serif leading-relaxed max-w-3xl mx-auto">
                  For over a century, we have evolved from colonial land surveys to launching <strong>Ardhisasa</strong> — 
                  Kenya&apos;s revolutionary digital land platform. Today, we stand at the forefront of transparent, efficient, 
                  and citizen-centered land administration.
                </p>
                <p className="mt-8 text-2xl font-bold">
                  One Nation. One Digital Land Registry. One Future.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}