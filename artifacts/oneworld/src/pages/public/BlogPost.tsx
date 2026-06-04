import { useParams, Link } from "wouter";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import PublicLayout from "@/components/layout/PublicLayout";
import SeoHead from "@/components/SeoHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug ?? "", { query: { enabled: !!slug, queryKey: getGetBlogPostQueryKey(slug ?? "") } });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-10" />
          <div className="space-y-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}</div>
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </PublicLayout>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.publishedAt ?? undefined,
    "dateModified": post.publishedAt ?? undefined,
    "author": {
      "@type": "Organization",
      "name": "One World Van Lines",
      "url": "https://oneworldvanlines.net"
    },
    "publisher": {
      "@type": "Organization",
      "name": "One World Van Lines",
      "logo": { "@type": "ImageObject", "url": "https://oneworldvanlines.net/logo.jpg" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://oneworldvanlines.net/blog/${slug}` }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://oneworldvanlines.net/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://oneworldvanlines.net/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://oneworldvanlines.net/blog/${slug}` }
    ]
  };

  return (
    <PublicLayout>
      <SeoHead
        title={`${post.title} | One World Van Lines Blog`}
        description={post.excerpt}
        canonical={`/blog/${slug}`}
        schema={[articleSchema, breadcrumbSchema]}
      />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <Badge variant="secondary">{post.category}</Badge>
          {post.publishedAt && <span className="text-muted-foreground text-sm">{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{post.title}</h1>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">{post.excerpt}</p>

        <div className="prose prose-slate max-w-none">
          {post.content.split("\n").map((para, i) => {
            if (para.startsWith("## ")) return <h2 key={i} className="text-2xl font-serif font-bold mt-8 mb-4">{para.slice(3)}</h2>;
            if (para.startsWith("### ")) return <h3 key={i} className="text-xl font-serif font-bold mt-6 mb-3">{para.slice(4)}</h3>;
            if (para.startsWith("- ")) return <li key={i} className="ml-4 text-muted-foreground">{para.slice(2)}</li>;
            if (para.trim() === "") return <br key={i} />;
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>;
          })}
        </div>

        <div className="mt-16 bg-secondary/40 rounded-xl p-8 text-center">
          <h3 className="font-serif font-bold text-xl mb-2">Planning a move in {post.category.includes("Austin") ? "Austin" : "DFW"}?</h3>
          <p className="text-muted-foreground text-sm mb-4">Get a free price range estimate or call us directly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculator"><button className="px-6 py-3 bg-primary text-primary-foreground rounded font-semibold text-sm hover:bg-primary/90 transition-colors">Get a Quote</button></Link>
            <a href="tel:6606677770" className="px-6 py-3 border border-border rounded font-semibold text-sm hover:bg-muted transition-colors">Call (660) 667-7770</a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
