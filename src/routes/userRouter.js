import Router from "koa-router"
import userController from "../controller/userController"
const router = new Router();


router.prefix('/user')
router.post("/login", userController.login);
router.post("/register", userController.register)
router.post("/forget", userController.forget )
export default  router;