import Router from 'koa-router'
import ContentController from '../../controller/ContentController'

const router = new Router()

router.prefix('/content')

router.post('/add', ContentController.addPost)
router.post('/collect', ContentController.setCollect)
router.get('/delete', ContentController.deletePostByUid)
router.get('/getAllPosts', ContentController.getPostList)
router.get('/getAllCollections', ContentController.getCollectList)
export default router
