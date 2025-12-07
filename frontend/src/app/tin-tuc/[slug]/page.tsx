import BlogDetail from '../BlogDetail';
import { Metadata } from 'next';
import { getPostBySlug, BlogPostData } from '@/data/blogPosts';

// Convert BlogPostData to BlogPostDetail format
function convertToBlogPostDetail(post: BlogPostData): any {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || post.description || '',
    content: post.content || post.description || '',
    featuredImage: post.imageUrl,
    author: post.author || 'Admin',
    publishedDate: post.publishedDate || new Date().toISOString(),
    category: post.category || '',
    tags: post.tags || [],
    isHighlighted: post.isHighlighted || false,
    viewCount: 0,
    metaTitle: post.title,
    metaDescription: post.excerpt || post.description || '',
    metaKeywords: post.tags?.join(', ') || '',
    comments: [],
    relatedPosts: [],
  };
}

async function fetchInitialPost(slug: string): Promise<any | undefined> {
  const post = getPostBySlug(slug);
  if (!post) {
    return undefined;
  }
  return convertToBlogPostDetail(post);
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

