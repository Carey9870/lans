// components/ResourceLinkClient.tsx
'use client';
import Link from 'next/link';
import { ExternalLink, FileText } from 'lucide-react';

interface Props {
  title: string;
  href: string; // slug
  hasPdf: boolean;
  fallbackContent?: string;
}

export function ResourceLinkClient({ title, href, hasPdf, fallbackContent }: Props) {
  const targetUrl = hasPdf
    ? `/resources/${href}.pdf`
    : `/resources/content/${href}`;

  return (
    <Link
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
    >
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <span className="font-medium text-gray-800 group-hover:text-blue-700">
          {title}
        </span>
      </div>
      <div className='flex items-center justify-center'>
        {hasPdf ? (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          PDF
        </span>
      ) : (
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
          {/* Text - no pdf uploaded */}
        </span>
      )}
      </div>
      
      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
    </Link>
  );
}