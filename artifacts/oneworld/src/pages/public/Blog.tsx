import { useState } from "react";
import { Link } from "wouter";
import { useListBlogPosts, getListBlogPostsQueryKey, useListBlogCategories, getListBlogCategoriesQueryKey } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data: postsData, isLoading } = useListBlogPosts(
    { category: selectedCategory, page, limit: 9 },
    { query: { queryKey: getListBlogPostsQueryKey({ category: selectedCategory, page, limit: 9 }) } }
  );
  const { data: categories } = useListBlogCategories({ query: { queryKey: getListBlogCategoriesQueryKey() } });

  const posts = postsData?.posts ?? [];
  const total = postsData?.total ?? 0;
  const totalPages = Math.ceil(total / 9);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">Moving Insights</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Moving Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Expert guides, local area insights, and practical tips for DFW and Austin moves.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => { setSelectedCategory(undefined); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}
          >
            All Articles
          </button>
          {(categories ?? []).map(cat => (
            <button
              key={cat.slug}
              onClick={() => { setSelectedCategory(cat.name); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}
            >
              {cat.name} ({cat.postCount})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No posts found. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="group border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full flex flex-col">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/30 h-40 flex items-center justify-center">
                    {post.isFeatured && <div className="absolute top-4 left-4"><Badge className="bg-primary text-primary-foreground gap-1"><Star className="w-3 h-3" /> Featured</Badge></div>}
                    <span className="text-4xl font-serif font-bold text-primary/20">{post.title[0]}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                      Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded border border-border hover:bg-muted disabled:opacity-40 text-sm">Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 rounded border text-sm ${page === i + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{i + 1}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded border border-border hover:bg-muted disabled:opacity-40 text-sm">Next</button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
