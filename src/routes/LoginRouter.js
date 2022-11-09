import Router from 'koa-router'
import LoginController from '../controller/LoginController'

const router = new Router()

router.prefix('/userLogin')
router.post('/login', LoginController.login)
router.post('/register', LoginController.register)
router.post('/forget', LoginController.forget)
router.post('/reset', LoginController.reset)

export default router
