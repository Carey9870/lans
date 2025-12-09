// app/services/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon, CheckIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { query } from "@/lib/db";

interface ServiceItem {
  id: number;
  number: number;
  title: string;
  slug: string;
}

interface Category {
  id: number;
  title: string;
  slug: string;
  items: ServiceItem[];
}

async function getCategories(): Promise<Category[]> {
  const res = await query(
    `
    SELECT
      c.id, c.title, c.slug,
      COALESCE(json_agg(
        json_build_object('id', si.id, 'number', si.number, 'title', si.title, 'slug', si.slug)
        ORDER BY si.number
      ) FILTER (WHERE si.id IS NOT NULL), '[]') as items
    FROM categories c
    LEFT JOIN service_items si ON si.category_id = c.id
    GROUP BY c.id, c.title, c.slug
    ORDER BY c.id
    `
  );

  return res.rows.map(row => ({
    ...row,
    items: row.items || []
  }));
}

async function CategoryCard({ category }: { category: Category }) {
  const backgrounds = ["bg-green-50", "bg-fuchsia-50"];

  return (
    <Card className="rounded-sm bg-sky-500 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg p-0">
      <CardHeader className="bg-black text-white">
        <CardTitle className="text-md p-2 text-center">{category.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 pb-4">
        <ul className="space-y-1">
          {category.items.map((item, index) => (
            <li key={item.id}>
              <Link
                href={`/services/${category.slug}/${item.slug}`}
                className={`group flex items-center justify-between p-1 rounded-lg border border-transparent
                  transition-all duration-300 hover:bg-amber-100 hover:border-amber-400 hover:shadow-md
                  ${backgrounds[index % 2]}`}
              >
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 border-black text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-serif text-black">
                    {item.number}. {item.title}
                  </span>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LoadingCard({ title }: { title: string }) {
  return (
    <Card className="rounded-md bg-gray-100 shadow-lg border-0">
      <CardHeader className="bg-khaki text-primary-foreground">
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      </CardContent>
    </Card>
  );
}

export const metadata = {
  title: "Our Services | Land Registry",
  description: "Comprehensive land registration, administration, valuation, planning, and survey services.",
};

export default async function ServicesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
            Our Services
          </h1>
          <p className="text-md text-black max-w-3xl mx-auto">
            We provide end-to-end land management services across registration, administration, valuation, planning, and surveying.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Suspense key={category.id} fallback={<LoadingCard title={category.title} />}>
              <CategoryCard category={category} />
            </Suspense>
          ))}
        </div>
      </div>
    </div>
  );
}