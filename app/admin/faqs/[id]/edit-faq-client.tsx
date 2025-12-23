'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

type FormValues = z.infer<typeof formSchema>;

async function fetchFAQ(id: number) {
  const res = await fetch(`/api/faqs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch FAQ');
  return res.json();
}

async function updateFAQ({ id, data }: { id: number; data: FormValues }) {
  const res = await fetch(`/api/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update FAQ');
  return res.json();
}

export default function EditFAQClient({ initialId }: { initialId: number }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: faq, isLoading, error } = useQuery({
    queryKey: ['faq', initialId],
    queryFn: () => fetchFAQ(initialId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '', answer: '' },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq, form]);

  const mutation = useMutation({
    mutationFn: updateFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq', initialId] });
      setIsEditing(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({ id: initialId, data: values });
  };

  const handleCancel = () => {
    if (faq) {
      form.reset({ question: faq.question, answer: faq.answer });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (error || !faq) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">FAQ not found or failed to load.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/faqs">
            <ArrowLeft className="mr-2 size-4" />
            Back to FAQs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/faqs">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit FAQ</h1>
            <p className="text-muted-foreground">ID: {faq.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Save className="mr-2 size-4" />
              Edit FAQ
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={mutation.isPending}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Spinner className="mr-2 size-4" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            {isEditing ? (
              <div className="border-b pb-4">
                <Input
                  {...form.register('question')}
                  className="text-lg font-medium border-none shadow-none focus-visible:ring-2 focus-visible:ring-primary px-0"
                  placeholder="Enter question..."
                />
                {form.formState.errors.question && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.question.message}
                  </p>
                )}
              </div>
            ) : (
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
            )}

            <AccordionContent className="pt-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    {...form.register('answer')}
                    rows={8}
                    className="min-h-32 resize-none"
                    placeholder="Enter answer..."
                  />
                  {form.formState.errors.answer && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.answer.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        Last updated: {new Date(faq.updated_at).toLocaleString()}
      </div>
    </div>
  );
}


























// // app/admin/faqs/[id]/page.tsx
// 'use client';

// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Spinner } from '@/components/ui/spinner';
// import { ArrowLeft, Save, X } from 'lucide-react';
// import Link from 'next/link';

// const formSchema = z.object({
//   question: z.string().min(1, 'Question is required'),
//   answer: z.string().min(1, 'Answer is required'),
// });

// type FormValues = z.infer<typeof formSchema>;

// async function fetchFAQ(id: string) {
//   const res = await fetch(`/api/faqs/${id}`);
//   if (!res.ok) throw new Error('Failed to fetch FAQ');
//   return res.json();
// }

// async function updateFAQ({ id, data }: { id: string; data: FormValues }) {
//   const res = await fetch(`/api/faqs/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error('Failed to update FAQ');
//   return res.json();
// }

// export default function EditFAQPage({ params }: { params: { id: string } }) {
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);

//   const { data: faq, isLoading, error } = useQuery({
//     queryKey: ['faq', params.id],
//     queryFn: () => fetchFAQ(params.id),
//   });

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       question: '',
//       answer: '',
//     },
//   });

//   // Populate form when data loads
//   React.useEffect(() => {
//     if (faq) {
//       form.reset({
//         question: faq.question,
//         answer: faq.answer,
//       });
//     }
//   }, [faq, form]);

//   const mutation = useMutation({
//     mutationFn: updateFAQ,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['faqs'] });
//       queryClient.invalidateQueries({ queryKey: ['faq', params.id] });
//       setIsEditing(false);
//       // Optional: show success toast
//     },
//   });

//   const onSubmit = (values: FormValues) => {
//     mutation.mutate({ id: params.id, data: values });
//   };

//   const handleCancel = () => {
//     if (faq) {
//       form.reset({
//         question: faq.question,
//         answer: faq.answer,
//       });
//     }
//     setIsEditing(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spinner className="size-10" />
//       </div>
//     );
//   }

//   if (error || !faq) {
//     return (
//       <div className="container mx-auto py-8 text-center">
//         <p className="text-red-500">FAQ not found or failed to load.</p>
//         <Button asChild className="mt-4">
//           <Link href="/admin/faqs">
//             <ArrowLeft className="mr-2 size-4" />
//             Back to FAQs
//           </Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 max-w-4xl">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <Button asChild variant="outline" size="icon">
//             <Link href="/admin/faqs">
//               <ArrowLeft className="size-4" />
//             </Link>
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">Edit FAQ</h1>
//             <p className="text-muted-foreground">ID: {faq.id}</p>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           {!isEditing ? (
//             <Button onClick={() => setIsEditing(true)}>
//               <Save className="mr-2 size-4" />
//               Edit FAQ
//             </Button>
//           ) : (
//             <>
//               <Button
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={mutation.isPending}
//               >
//                 <X className="mr-2 size-4" />
//                 Cancel
//               </Button>
//               <Button
//                 onClick={form.handleSubmit(onSubmit)}
//                 disabled={mutation.isPending}
//               >
//                 {mutation.isPending ? (
//                   <Spinner className="mr-2 size-4" />
//                 ) : (
//                   <Save className="mr-2 size-4" />
//                 )}
//                 Save Changes
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
//           <AccordionItem value="item-1">
//             {isEditing ? (
//               <div className="border-b pb-4">
//                 <Input
//                   {...form.register('question')}
//                   className="text-lg font-medium border-none shadow-none focus-visible:ring-2 focus-visible:ring-primary px-0"
//                   placeholder="Enter question..."
//                 />
//                 {form.formState.errors.question && (
//                   <p className="text-sm text-red-500 mt-1">
//                     {form.formState.errors.question.message}
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <AccordionTrigger className="text-lg font-medium hover:no-underline">
//                 {faq.question}
//               </AccordionTrigger>
//             )}

//             <AccordionContent className="pt-4">
//               {isEditing ? (
//                 <div className="space-y-4">
//                   <Textarea
//                     {...form.register('answer')}
//                     rows={8}
//                     className="min-h-32 resize-none"
//                     placeholder="Enter answer..."
//                   />
//                   {form.formState.errors.answer && (
//                     <p className="text-sm text-red-500">
//                       {form.formState.errors.answer.message}
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="prose prose-sm max-w-none text-muted-foreground">
//                   {faq.answer}
//                 </div>
//               )}
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>
//       </form>

//       <div className="mt-6 text-sm text-muted-foreground">
//         Last updated: {new Date(faq.updated_at).toLocaleString()}
//       </div>
//     </div>
//   );
// }