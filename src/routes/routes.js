import combineRoutes from 'koa-combine-routers'
import userRouter from './UserRouter'
import publicRouter from './PublicRouter'
import loginRouter from './LoginRouter'

export default combineRoutes([userRouter, publicRouter, loginRouter])
