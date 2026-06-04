import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import estimatesRouter from "./estimates";
import workersRouter from "./workers";
import jobsRouter from "./jobs";
import blogRouter from "./blog";
import faqsRouter from "./faqs";
import documentsRouter from "./documents";
import pricingRouter from "./pricing";
import messagesRouter from "./messages";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(estimatesRouter);
router.use(workersRouter);
router.use(jobsRouter);
router.use(blogRouter);
router.use(faqsRouter);
router.use(documentsRouter);
router.use(pricingRouter);
router.use(messagesRouter);
router.use(dashboardRouter);

export default router;
