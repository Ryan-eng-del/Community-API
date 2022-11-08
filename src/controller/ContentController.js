import PostModel from '../model/PostModel'

class ContentController {
  /* 获取文章列表 */
  async getPostList(ctx) {
    const body = ctx.query
    /* 处理获取数据的分页查询 */
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}
    /* 处理获取数据的查询条件 */
    if (body.title) {
      options.title = { $regex: body.title }
    }
    if (body.catalog && body.catalog.length > 0) {
      options.catalog = { $in: body.catalog }
    }
    if (body.isTop) {
      options.isTop = body.isTop
    }
    if (body.isEnd) {
      options.isEnd = body.isEnd
    }
    if (body.status) {
      options.status = body.status
    }

    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      options.tags = { $elemMatch: body.tags }
    }

    const result = await PostModel.getList(options, sort, page, limit)

    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功！！'
    }
  }
}

export default new ContentController()
