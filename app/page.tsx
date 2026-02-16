import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          宋涤非
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          软件工程、智能体 (AI Agents)、网络安全、领域建模
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a 
            href="https://github.com/IndenScale" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub →
          </a>
          <a 
            href="https://github.com/IndenScale/agenthooks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            AgentHooks →
          </a>
          <a 
            href="https://github.com/IndenScale/monoco-toolkit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Monoco →
          </a>
          <a 
            href="https://github.com/IndenScale/Typedown" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Typedown →
          </a>
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
          <Link 
            href="/posts" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <p className="text-muted-foreground">暂无文章</p>
        ) : (
          <div className="space-y-8">
            {posts.slice(0, 5).map((post) => (
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
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="hover:text-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-medium group-hover:text-muted-foreground transition-colors">
                      {post.title}
                    </h3>
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
      </section>
    </main>
  );
}
