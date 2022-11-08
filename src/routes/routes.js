import combineRoutes from "koa-combine-routers";
import userRouter from "./userRouter";
import publicRouter from "./publicRouter";


export default combineRoutes([userRouter, publicRouter])