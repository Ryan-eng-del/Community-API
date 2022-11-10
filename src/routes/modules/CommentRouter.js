import Router from 'koa-router'
import CommentsController from '../../controller/CommentsController'

const router = new Router()

router.prefix('/comment')

router.post('/add', CommentsController.addComment)
router.post('/update', CommentsController.updateComment)
router.get('/like', CommentsController.setHands)

export default router
