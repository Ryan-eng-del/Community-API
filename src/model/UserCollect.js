import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema

const UserCollectSchema = new Schema({
  uid: { type: String },
  tid: { type: String, ref: 'post' },
  created: { type: Date },
  updated: { type: Date }
})

UserCollectSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserCollectSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserCollectSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

UserCollectSchema.statics = {
  // 查询特定用户的收藏数据
  getListByUid: function (id, page, limit) {
    return this.find({ uid: id })
      .skip(limit * page)
      .limit(limit)
      .sort({ created: -1 })
  },
  queryCollectCount: function (options) {
    return this.find(options).countDocuments()
  },
  queryCollectByUserId: function (uid, limit, pageSize) {
    return this.find({ uid })
      .skip(limit * (pageSize - 1))
      .limit(limit)
  },

  // 查询总数
  countByUid: function (id) {
    return this.find({ uid: id }).countDocuments()
  },

  isCollect: function (uid, tid) {
    // 判断用户是否收藏了该文章
    return this.findOne({ uid, tid }).then((doc) => {
      return !!doc
    })
  },
  // 根据用户是否有收藏，设置收藏，或者删除收藏
  handleCollect: function (uid, tid, isCollect) {
    if (isCollect) {
      return this.deleteMany({ uid, tid })
    } else {
      return this.create({ uid, tid })
    }
  },

  // 获取用户收藏，关联post表、user表
  getCollectList: function (_uid, _skip, _limit) {
    return this.find({ uid: _uid })
      .sort({ created: -1 })
      .skip(_skip || 0)
      .limit(_limit || 10)
      .populate({
        path: 'tid',
        select: 'uid title content answer',
        populate: {
          path: 'uid',
          select: 'name pic'
        }
      })
  },

  // 删除用户收藏
  deleteCollect: function (_uid, _tid) {
    return this.deleteMany({ uid: _uid, tid: _tid })
  },

  deleteByPostId: function (tid) {
    return this.deleteMany({ tid })
  },

  findByID: function (id) {
    return this.findOne(
      { _id: id },
      {
        password: 0
      }
    )
  }
}

const UserCollectModel = mongoose.model('user_collect', UserCollectSchema)

export default UserCollectModel
