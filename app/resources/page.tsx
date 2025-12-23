// app/resources/page.tsx
import { Loader2 } from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceLinkClient } from "@/components/resource-link-client"; 

async function getResources() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/resources`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default async function ResourcesPage() {
  let resources;
  try {
    resources = await getResources();
  } catch (err) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-mono text-start text-black mb-6 bg-clip-text">
          Downloadable Resources
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resources.map((section: any) => (
            <Card
              key={section.id}
              className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 pt-0 overflow-hidden"
            >
              <CardHeader className="bg-black text-center text-white">
                <CardTitle className="text-xl font-serif tracking-wide font-bold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <ul className="space-y-2">
                  {section.links.map((link: any) => (
                    <li key={link.id}>
                      <ResourceLinkClient
                        title={link.title}
                        href={link.slug}
                        hasPdf={!!link.pdfFilename}
                        fallbackContent={link.fallbackContent}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}