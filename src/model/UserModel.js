import mongoose from '../config/DBHelper'
import md5 from 'md5'
import moment from 'dayjs'

const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: { type: String },
  password: {
    type: String,
    required: true,
    set: (value) => md5(value)
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

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
