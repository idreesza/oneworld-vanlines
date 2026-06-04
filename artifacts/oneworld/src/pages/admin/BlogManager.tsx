import { useState } from "react";
import { useListBlogPosts, getListBlogPostsQueryKey, useCreateBlogPost, useDeleteBlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function BlogManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", excerpt: "", content: "", category: "", tags: "" });

  const { data: postsData, isLoading } = useListBlogPosts({ limit: 50 }, { query: { queryKey: getListBlogPostsQueryKey({ limit: 50 }) } });
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();

  const posts = postsData?.posts ?? [];

  const handleCreate = () => {
    if (!form.slug || !form.title || !form.content || !form.category) { toast({ title: "Fill all required fields", variant: "destructive" }); return; }
    createPost.mutate({
      data: { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), isFeatured: false, publishedAt: new Date().toISOString() },
    }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }); setIsOpen(false); setForm({ slug: "", title: "", excerpt: "", content: "", category: "", tags: "" }); toast({ title: "Post published" }); },
    });
  };

  const handleDelete = (slug: string) => {
    if (!confirm("Delete this post?")) return;
    deletePost.mutate({ slug }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }); toast({ title: "Post deleted" }); } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Blog Posts</h2>
          <Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4 mr-2" /> New Post</Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <div key={post.slug} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{post.title}</span>
                    {post.isFeatured && <Badge className="text-xs">Featured</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span>/blog/{post.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/blog/${post.slug}`}><button className="p-2 hover:bg-muted rounded"><ExternalLink className="w-4 h-4" /></button></Link>
                  <button onClick={() => handleDelete(post.slug)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Blog Post</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Slug *</label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="my-post-slug" /></div>
                <div><label className="text-sm font-medium mb-1 block">Category *</label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="DFW Moving Guides" /></div>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Title *</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label className="text-sm font-medium mb-1 block">Excerpt</label><Input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} /></div>
              <div><label className="text-sm font-medium mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="dallas, moving tips, local" /></div>
              <div><label className="text-sm font-medium mb-1 block">Content *</label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10} /></div>
              <Button onClick={handleCreate} className="w-full" disabled={createPost.isPending}>{createPost.isPending ? "Publishing..." : "Publish Post"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
