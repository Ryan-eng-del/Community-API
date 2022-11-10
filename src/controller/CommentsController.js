import { checkCode, getJWTPayload } from '../common/util'
import CommentModel from '../model/CommentModel'
import LikeModel from '../model/LikeModel'
import LinksModel from '../model/LinksModel'
import PostModel from '../model/PostModel'
import UserModel from '../model/UserModel'

/* 检查用户是否处在禁言状态 */
const canReply = async (ctx) => {
  let result = false
  const obj = await getJWTPayload(ctx.header.authorization)
  if (typeof obj.id === 'undefined') {
    return result
  } else {
    const user = await UserModel.findByID(obj.id)
    if (user.status === '0') {
      result = true
    }
    return result
  }
}

class CommentsController {
  /* 获取评论列表 */
  async getComments(ctx) {
    const params = ctx.query
    const tid = params.tid
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    let result = await CommentModel.getCommentsList(tid, page, limit)
    console.log(result, 'result')
    // 判断用户是否登录，已登录的用户才去判断点赞信息
    const auth = ctx.header.authorization
    const obj = auth ? await getJWTPayload(auth) : {}

    if (obj.id) {
      result = result.map((item) => item.toJSON())
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        item.handed = '0'
        const commentsHands = await LinksModel.findOne({
          cid: item._id,
          uid: obj.id
        })

        if (commentsHands && commentsHands.cid) {
          if (commentsHands.uid === obj.id) {
            item.handed = '1'
          }
        }
      }
    }

    const total = await CommentModel.queryCount(tid)

    ctx.body = {
      code: 200,
      total,
      data: result,
      msg: '查询成功'
    }
  }

  /* 发表评论 */
  async addComment(ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已被禁言！'
      }
      return
    }
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    const result = await checkCode(sid, code)
    if (!result) {
      ctx.body = {
        code: 500,
        msg: '图片验证码不正确,请检查！'
      }
      return
    }
    const newComment = new CommentModel(body)

    const obj = await getJWTPayload(ctx.header.authorization)

    /* 评论人的id */
    newComment.cuid = obj.id
    const post = await PostModel.findOne({ _id: body.tid })

    /* 被评论人的id */
    newComment.uid = post.uid
    const comment = await newComment.save()

    // 评论 文章+1
    await PostModel.updateOne({ _id: body.tid }, { $inc: { answer: 1 } })

    if (comment._id) {
      ctx.body = {
        code: 200,
        data: comment,
        msg: '评论成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '评论失败'
      }
    }
  }

  /* 更新评论 */
  async updateComment(ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已被禁言！'
      }
      return
    }
    const { body } = ctx.request
    const result = await CommentModel.updateOne(
      { _id: body.cid },
      { $set: body }
    )

    ctx.body = {
      code: 200,
      msg: '修改成功',
      data: result
    }
  }

  /* 点赞评论 */
  async setHands(ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const params = ctx.query

    // 判断用户是否已经点赞
    const tmp = await LikeModel.find({ cid: params.cid, uid: obj.id })
    if (tmp.length > 0) {
      ctx.body = {
        code: 200,
        msg: '您已经点赞，请勿重复点赞'
      }
      return
    }

    const comment = await CommentModel.findById(params.cid)

    const newHands = new LikeModel({
      cid: params.cid, // 评论id
      huid: comment.cuid, // 被赞用户
      uid: obj.id // 当前用户，即点赞用户
    })

    const data = await newHands.save()

    // 更新comments表中对应的记录的hands信息 +1
    const result = await CommentModel.updateOne(
      { _id: params.cid },
      { $inc: { hands: 1 } }
    )

    if (result.acknowledged && result.matchedCount === 1) {
      ctx.body = {
        code: 200,
        msg: '点赞成功',
        data
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '保存点赞记录失败！'
      }
    }
  }
}

export default new CommentsController()
