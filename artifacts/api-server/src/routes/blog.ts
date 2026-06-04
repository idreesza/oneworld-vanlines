import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, desc, ilike, and, count } from "drizzle-orm";
import { CreateBlogPostBody, UpdateBlogPostBody, ListBlogPostsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/blog/posts", async (req, res) => {
  try {
    const query = ListBlogPostsQueryParams.parse(req.query);
    const conditions = [];
    if (query.category) conditions.push(eq(blogPostsTable.category, query.category));
    if (query.featured) conditions.push(eq(blogPostsTable.isFeatured, query.featured));
    if (query.search) conditions.push(ilike(blogPostsTable.title, `%${query.search}%`));

    const allPosts = await db.select().from(blogPostsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(blogPostsTable.createdAt));

    const total = allPosts.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const posts = allPosts.slice((page - 1) * limit, page * limit);
    return res.json({ posts, total, page, limit });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog/posts", async (req, res) => {
  try {
    const body = CreateBlogPostBody.parse(req.body);
    const [post] = await db.insert(blogPostsTable).values({
      ...body,
      tags: body.tags ?? [],
      isFeatured: body.isFeatured ?? false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
    }).returning();
    return res.status(201).json(post);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/posts/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug));
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json(post);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/blog/posts/:slug", async (req, res) => {
  try {
    const body = UpdateBlogPostBody.parse(req.body);
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    Object.entries(body).forEach(([k, v]) => { if (v !== undefined) updates[k] = v; });
    if (body.publishedAt) updates.publishedAt = new Date(body.publishedAt);
    const [post] = await db.update(blogPostsTable).set(updates).where(eq(blogPostsTable.slug, req.params.slug)).returning();
    if (!post) return res.status(404).json({ error: "Post not found" });
    return res.json(post);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blog/posts/:slug", async (req, res) => {
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/categories", async (req, res) => {
  try {
    const posts = await db.select({ category: blogPostsTable.category }).from(blogPostsTable);
    const counts: Record<string, number> = {};
    posts.forEach(p => { counts[p.category] = (counts[p.category] ?? 0) + 1; });
    const categories = Object.entries(counts).map(([name, postCount]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      postCount,
    }));
    return res.json(categories);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
