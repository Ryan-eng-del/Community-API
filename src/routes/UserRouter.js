import Router from 'koa-router'
import LoginController from '../controller/LoginController'
import userController from '../controller/UserController'

const router = new Router()

router.prefix('/user')
router.post('/login', LoginController.login)
router.post('/register', LoginController.register)
router.post('/forget', LoginController.forget)
router.get('/signRecord', userController.userSign)

export default router
