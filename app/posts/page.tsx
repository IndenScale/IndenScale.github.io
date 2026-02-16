import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "文章 | 宋涤非",
  description: "所有文章列表",
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-12">文章</h1>
      
      {posts.length === 0 ? (
        <p className="text-muted-foreground">暂无文章</p>
      ) : (
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/posts/${post.slug}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                            <span key={tag} className="hover:text-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-medium group-hover:text-muted-foreground transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
