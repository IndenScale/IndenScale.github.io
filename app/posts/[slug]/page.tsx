import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "文章未找到",
    };
  }
  
  return {
    title: `${post.title} | 宋涤非`,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Back Link */}
      <Link 
        href="/posts" 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
      >
        ← 返回文章列表
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
      </header>

      {/* Content */}
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </article>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-border">
        <Link 
          href="/posts" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回文章列表
        </Link>
      </div>
    </main>
  );
}
