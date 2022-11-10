import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema

const LikeSchema = new Schema({
  cid: { type: String, ref: 'comments' },
  huid: { type: String, ref: 'users' }, // 被点赞用户的id
  uid: { type: String, ref: 'users' }, // 点赞用户的id
  created: { type: Date },
  updated: { type: Date }
})

LikeSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

LikeSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

const LikeModel = mongoose.model('likes', LikeSchema)

export default LikeModel
