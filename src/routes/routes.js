import combineRoutes from 'koa-combine-routers'
import userRouter from './UserRouter'
import publicRouter from './PublicRouter'

export default combineRoutes([userRouter, publicRouter])
