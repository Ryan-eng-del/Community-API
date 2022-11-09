import Router from 'koa-router'
import PublicController from '../controller/PublicController'
import ContentController from '../controller/ContentController'

const router = new Router()

router.prefix('/public')
router.get('/getCaptcha', PublicController.getCaptcha)
router.get('/getList', ContentController.getPostList)
router.get('/getTopWeek', ContentController.getTopWeek)
router.get('/getTips', ContentController.getTips)
router.get('/getLinks', ContentController.getLinks)

export default router
