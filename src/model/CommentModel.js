import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  tid: { type: String, ref: 'post' },
  uid: { type: String, ref: 'users' }, // 文章作者ID
  cuid: { type: String, ref: 'users' }, // 评论用户的ID
  content: { type: String },
  hands: { type: Number, default: 0 },
  status: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isBest: { type: String, default: '0' },
  created: { type: Date },
  updated: { type: Date }
})

CommentSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentSchema.statics = {
  findByTid: function (id) {
    return this.find({ tid: id })
  },
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  getCommentsList: function (id, page, limit) {
    return this.find({ tid: id })
      .populate({
        path: 'cuid',
        select: '_id name pic isVip',
        match: { status: { $eq: '0' } }
      })
      .populate({
        path: 'tid',
        select: '_id title status'
      })
      .skip(page * limit)
      .limit(limit)
  },

  getCommentsPublic: function (id, page, limit) {
    return this.find({ cuid: id })
      .populate({
        path: 'tid',
        select: '_id title'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },

  queryCount: function (id) {
    return this.find({ tid: id }).countDocuments()
  }
}

const CommentModel = mongoose.model('comments', CommentSchema)

export default CommentModel
