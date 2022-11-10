import Router from 'koa-router'
import ContentController from '../../controller/ContentController'

const router = new Router()

router.prefix('/content')

router.post('/add', ContentController.addPost)

export default router
