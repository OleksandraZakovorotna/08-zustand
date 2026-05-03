import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';
  const title = tag === 'all' ? 'All Notes' : `Notes tagged with "${tag}"`;

  return {
    title: title,
    description: `Browse ${title.toLowerCase()} on NoteHub.`,
    openGraph: {
      title: title,
      description: `Browse ${title.toLowerCase()} on NoteHub.`,
      url: `https://localhost:3000/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


export default async function Page({
  params }: Props) {
  const { slug } = await params;

    const tag = slug?.[0]; 
    
  const queryClient = new QueryClient();
  const tagForQuery = tag === 'all' ? undefined : tag;

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tagForQuery],
      queryFn: () =>
          fetchNotes("", 1, tagForQuery),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}