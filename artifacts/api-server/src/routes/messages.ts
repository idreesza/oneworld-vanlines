import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SendMessageBody, ListMessagesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/messages", async (req, res) => {
  try {
    const query = ListMessagesQueryParams.parse(req.query);
    const messages = await db.select().from(messagesTable)
      .where(query.leadId ? eq(messagesTable.leadId, query.leadId) : undefined)
      .orderBy(desc(messagesTable.sentAt));
    return res.json(messages);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const body = SendMessageBody.parse(req.body);
    const [message] = await db.insert(messagesTable).values({
      leadId: body.leadId,
      direction: "outbound",
      channel: body.channel,
      content: body.content,
      status: "sent",
    }).returning();
    return res.status(201).json(message);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
