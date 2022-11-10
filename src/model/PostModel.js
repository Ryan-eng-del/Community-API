import mongoose from '@/config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema
const PostSchema = new Schema({
  uid: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: 100 },
  tags: {
    type: Array,
    default: []
  },
  created: { type: Date },
  updated: { type: Date }
})

PostSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.statics = {
  /* 获取文章列表 */
  getList: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: 'uid',
        select: 'name isVip pic'
      })
  },
  /* 获取本周热议 */
  getTopWeek: async function () {
    return await this.find({
      created: {
        $gte: moment().subtract(1, 'days')
      }
    })
      .sort({ answer: -1 })
      .limit(15)
  },
  /* 根据文章详情获取发表人 */
  findByTid: function (id) {
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: 'name pic isVip _id'
    })
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
