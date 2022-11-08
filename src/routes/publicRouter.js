import Router from "koa-router";
import publicController from "../controller/publicController";
const router = new Router();

router.prefix("/public")
router.get("/getCaptcha", publicController.getCaptcha)
export default router;