import BlogDetail from '../BlogDetail';
import { BlogPostDetail } from '@/services/blogService';
import { Metadata } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

async function fetchInitialPost(slug: string): Promise<BlogPostDetail | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/${slug}`, {
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!res.ok) {
      return undefined;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchInitialPost(slug);

  if (!post) {
    return {
      title: 'Bài viết không tìm thấy',
      description: 'Bài viết không tồn tại hoặc đã bị xóa.',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialPost = await fetchInitialPost(slug);

  return (
    <>
      <BlogDetail initialPost={initialPost} slug={slug} />
    </>
  );
}

