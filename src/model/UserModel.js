import mongoose from '../config/DBHelper'
import moment from 'dayjs'
import { setMd5 } from '../common/util'

const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    index: { unique: true },
    sparse: true
  },
  name: { type: String },
  password: {
    type: String,
    required: true,
    set: (value) => setMd5(value)
  },
  points: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/img/header.jpg' },
  mobile: { type: String, default: '' },
  status: { type: String, default: '0' },
  signature: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 },
  created: { type: Date },
  updated: { type: Date }
})

UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})
/* schema类的静态方法 */
UserSchema.statics = {
  findByID: function (id) {
    return this.findOne(
      { _id: id },
      {
        /* 排除字段 */
        password: 0
      }
    )
  }
}
const UserModel = mongoose.model('users', UserSchema)

export default UserModel
