import Router from 'koa-router'
import userController from '../controller/UserController'

const router = new Router()

router.prefix('/user')

router.get('/signRecord', userController.userSign)
router.post('/changePassword', userController.changePasswd)
router.post('/updateUser', userController.updateUserInfo)
router.post('/updateUserName', userController.updateUsername)

export default router
