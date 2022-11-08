import mongoose from "../config/DBHelper";
import md5 from "md5"
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            set: (value) => md5(value),
        }
    }
)

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;