import PostModel from '../model/PostModel'
import LinksModel from '../model/LinksModel'
import { checkCode, getJWTPayload } from '../common/util'
import UserModel from '../model/UserModel'
import UserCollectModel from '../model/UserCollect'

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

  /* 获取本周热议 */
  async getTopWeek(ctx) {
    const result = await PostModel.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  /* 查询友链 */
  async getLinks(ctx) {
    const result = await LinksModel.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  /* 查询温馨提醒 */
  async getTips(ctx) {
    const result = await LinksModel.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  /* 发表文章 */
  async addPost(ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断用户的积分数是否 > fav，否则，提示用户积分不足发贴
      // 用户积分足够的时候，新建Post，减除用户对应的积分
      const user = await UserModel.findByID({ _id: obj.id })
      if (user.favs < body.fav) {
        ctx.body = {
          code: 501,
          msg: '积分不足'
        }
        return
      } else {
        await UserModel.updateOne(
          { _id: obj.id },
          { $inc: { favs: -body.fav } }
        )
      }

      const newPost = new PostModel(body)
      newPost.uid = obj.id
      const result = await newPost.save()
      ctx.body = {
        code: 200,
        msg: '成功的保存的文章',
        data: result
      }
    } else {
      // 图片验证码验证失败
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败'
      }
    }
  }

  /* 获取文章详情 */
  async getPostDetail(ctx) {
    const params = ctx.query
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return
    }
    const post = await PostModel.findByTid(params.tid)
    if (!post) {
      ctx.body = {
        code: 200,
        data: {},
        msg: '查询文章详情成功'
      }
      return
    }

    const newPost = post.toJSON()
    // 更新文章阅读记数
    await PostModel.updateOne({ _id: params.tid }, { $inc: { reads: 1 } })
    if (post._id) {
      ctx.body = {
        code: 200,
        data: newPost,
        msg: '查询文章详情成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '获取文章详情失败'
      }
    }
  }

  /* 收藏文章 */
  async setCollect(ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    const isCollect = body.isCollect
    // isCollect false - 未收藏 => 转成收藏， true - 收藏了 => 删除收藏
    const result = await UserCollectModel.handleCollect(
      obj._id,
      body.tid,
      isCollect
    )
    ctx.body = {
      code: 200,
      data: result,
      isCollect: !isCollect,
      msg: isCollect ? '已取消收藏！' : '收藏成功！'
    }
  }

  /* 删除发帖记录 */
  async deletePostByUid(ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    const post = await PostModel.findOne({ uid: obj.id, _id: params.tid })
    if (post.id === params.tid && post.isEnd === '0') {
      const result = await PostModel.deleteOne({ _id: params.tid })
      console.log(result, 'result')
      if (result.acknowledged) {
        ctx.body = {
          code: 200,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '执行删除失败！'
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '删除失败，无权限！'
      }
    }
  }
}

export default new ContentController()
