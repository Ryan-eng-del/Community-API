import moment from 'dayjs'
import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' },
  favs: { type: Number },
  created: { type: Date },
  updated: { type: Date }
})

SignRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.statics = {
  /* 通过用户的id，去查找签到表的记录 */
  findByUid: function (uid) {
    return this.findOne({ uid }).sort({ created: -1 })
  }
}
const SignRecordModel = mongoose.model('sign_record', SignRecordSchema)

export default SignRecordModel
