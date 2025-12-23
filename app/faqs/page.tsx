// app/faqs/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';

async function fetchFAQs(page: number) {
  const res = await fetch(`/api/faqs?page=${page}&limit=7`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}

export default function FAQsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['faqs', page],
    queryFn: () => fetchFAQs(page),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading FAQs: {(error as Error).message}</div>;
  }

  const { faqs, totalPages } = data;

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-start mb-2 text-black">
        Frequently Asked Questions
      </h1>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq: { id: number; question: string; answer: string }, index: number) => {
          const displayNumber = (page - 1) * 7 + index + 1;

          return (
            <AccordionItem
              key={faq.id}
              value={`item-${faq.id}`}
              className="border border-rose-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
            >
              <AccordionTrigger className="px-6 py-5 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-fuchsia-200 text-black font-semibold text-lg shrink-0">
                    {displayNumber}
                  </div>
                  <span className="text-lg font-medium hover:underline hover:cursor-pointer text-foreground">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-3">
                <div className="pl-14 text-red-500 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {faqs.length === 0 && <p className="text-center mt-4">No FAQs available.</p>}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}