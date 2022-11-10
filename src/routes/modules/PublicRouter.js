import Router from 'koa-router'
import PublicController from '@/controller/PublicController'
import ContentController from '@/controller/ContentController'
import CommentsController from '../../controller/CommentsController'

const router = new Router()

router.prefix('/public')
router.get('/getCaptcha', PublicController.getCaptcha)
router.get('/getList', ContentController.getPostList)
router.get('/getTopWeek', ContentController.getTopWeek)
router.get('/getTips', ContentController.getTips)
router.get('/getLinks', ContentController.getLinks)
router.get('/getComments', CommentsController.getComments)
router.get('/getDetail', ContentController.getPostDetail)
router.get('/getUserPosts', ContentController.getPostPublic)
router.get('/getUserComments', CommentsController.getCommentPublic)

export default router
