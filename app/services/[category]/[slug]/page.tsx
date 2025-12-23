// app/services/[category]/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { query } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  if (!category || !slug) return { title: "Not Found" };

  const service = await getService(category, slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Land Registry Services`,
    description: `Details about ${service.title} in ${service.category_title}.`,
  };
}

async function getService(categorySlug: string, itemSlug: string) {
  if (!categorySlug || !itemSlug) return null;

  // 1. Try exact slug match
  const exactRes = await query(
    `SELECT si.*, c.title as category_title, c.slug as category_slug
     FROM service_items si
     JOIN categories c ON si.category_id = c.id
     WHERE si.slug = $1 AND c.slug = $2`,
    [itemSlug, categorySlug]
  );

  if (exactRes.rows.length > 0) return exactRes.rows[0];

  // 2. Fallback: search by title (safe string handling)
  const searchTerm = itemSlug.replace(/-/g, " ").trim();
  if (!searchTerm) return null;

  const fallbackRes = await query(
    `SELECT si.*, c.title as category_title, c.slug as category_slug
     FROM service_items si
     JOIN categories c ON si.category_id = c.id
     WHERE c.slug = $1
       AND (
         LOWER(si.title) LIKE $2 OR
         LOWER(si.title) LIKE $3
       )
     ORDER BY 
       CASE WHEN LOWER(si.title) = LOWER($4) THEN 0 ELSE 1 END
     LIMIT 1`,
    [
      categorySlug,
      `%${searchTerm}%`,
      `%${itemSlug}%`,
      searchTerm,
    ]
  );

  return fallbackRes.rows.length > 0 ? fallbackRes.rows[0] : null;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  // FIX 1: await params
  const { category, slug } = await params;

  // FIX 2: Guard against undefined
  if (!category || !slug) {
    notFound();
  }

  const service = await getService(category, slug);

  if (!service) {
    notFound();
  }

  const requirements = Array.isArray(service.requirements) && service.requirements.length > 0
    ? service.requirements
    : [
        "Duly completed application form",
        "Original title deed or document",
        "Copy of national ID/passport",
        "PIN certificate",
        "Recent colored passport photos (2)",
        "Payment receipt of prescribed fees",
      ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/services"
          className="inline-flex items-center text-primary hover:underline mb-8 text-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to All Services
        </Link>

        <Card className="overflow-hidden shadow-xl border-0">
          <div className="bg-primary text-primary-foreground p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {service.title}
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Category: <span className="font-semibold">{service.category_title}</span>
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12 bg-white">
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {service.description ||
                  "Professional service ensuring compliance with relevant land laws and accurate documentation."}
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Requirements</h2>
              <ul className="space-y-3 text-lg text-gray-700 ml-6 list-disc">
                {requirements.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Fees & Timeline</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Processing Time</h3>
                  <p className="text-3xl font-bold text-primary">
                    {service.timeline || "10–21 working days"}
                  </p>
                </Card>
                <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-0">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Fee</h3>
                  <p className="text-3xl font-bold text-primary">
                    {service.fee || "Varies by case"}
                  </p>
                </Card>
              </div>
            </section>

            <div className="pt-10 border-t border-gray-200">
              <Button asChild size="lg" className="w-full md:w-auto px-12 text-lg">
                <Link href="/contact">Apply for This Service</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}