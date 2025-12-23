// app/management-and-leadership/page.tsx
import { query } from '@/lib/db';
import GalleryCarousel from '@/components/gallery-media/gallery-carousel';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

export const revalidate = 0;

export default async function LeadershipPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;  // ← Now a Promise!
}) {
  // ← Must await it!
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const result = await query(`
    SELECT
      id,
      type,
      file_path AS url,
      thumbnail_path AS "thumbnailUrl",
      text,
      subtext
    FROM gallery_media
    ORDER BY "order" ASC, id ASC
  `);

  const media = result.rows;

  // Group by person
  const teamMembers = media.reduce((acc: any[], item: any) => {
    const key = `${item.text}|||${item.subtext}`;
    const existing = acc.find(m => m.key === key);
    if (existing) {
      existing.media.push(item);
    } else {
      acc.push({
        key,
        name: item.text || "Name",
        title: item.subtext || "Title",
        media: [item]
      });
    }
    return acc;
  }, []);

  const totalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = teamMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen py-6 px-6 bg-linear-to-b from-background to-muted/10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">
            Our Leadership
          </h1>
          <p className="text-[20px] text-black max-w-3xl mx-auto">
            Meet the dedicated team driving excellence in land administration and management
          </p>
        </div>

        {/* Grid: 8 per page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {paginatedMembers.map((member) => (
            <GalleryCarousel
              key={member.key}
              name={member.name}
              title={member.title}
              media={member.media}
            />
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No team members added yet.</p>
          </div>
        )}

        {/* Numerical Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${Math.max(1, currentPage - 1)}`}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={`?page=${pageNum}`}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
}


















// // app/management-and-leadership/page.tsx
// import { query } from '@/lib/db';
// import GalleryCarousel from '@/components/gallery-media/gallery-carousel';

// export const revalidate = 0;

// export default async function LeadershipPage() {
//   const result = await query(`
//     SELECT 
//       id,
//       type,
//       file_path AS url,
//       thumbnail_path AS "thumbnailUrl",
//       text,
//       subtext
//     FROM gallery_media 
//     ORDER BY "order" ASC, id ASC
//   `);

//   const media = result.rows;

//   // Group media by person (text + subtext = unique person)
//   const teamMembers = media.reduce((acc: any[], item: any) => {
//     const key = `${item.text}|||${item.subtext}`;
//     const existing = acc.find(m => m.key === key);
    
//     if (existing) {
//       existing.media.push(item);
//     } else {
//       acc.push({
//         key,
//         name: item.text || "Name",
//         title: item.subtext || "Title",
//         media: [item]
//       });
//     }
//     return acc;
//   }, []);

//   return (
//     <main className="min-h-screen py-6 px-6 bg-linear-to-b from-background to-muted/10">
//       <div className="max-w-7xl mx-auto">
//         {/* Title */}
//         <div className="text-center mb-4">
//           <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">
//             Our Leadership
//           </h1>
//           <p className="text-[20px] text-black max-w-3xl mx-auto">
//             Meet the dedicated team driving excellence in land administration and management
//           </p>
//         </div>

//         {/* Grid of 4 small carousels per row */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {teamMembers.map((member) => (
//             <GalleryCarousel
//               key={member.key}
//               name={member.name}
//               title={member.title}
//               media={member.media}
//             />
//           ))}
//         </div>

//         {teamMembers.length === 0 && (
//           <div className="text-center py-20">
//             <p className="text-xl text-muted-foreground">No team members added yet.</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }