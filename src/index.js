import koa from "koa";
import compose from "koa-compose";
import koaBody from "koa-body";
import helmet from "koa-helmet";
import statics from "koa-static";
import jsonUtil from "koa-json";
import cors from "@koa/cors";
import path from "path";
import router from "./routes/routes";
import JWT from 'koa-jwt'
import config from "./config";
import errorHandle from "./common/ErrorHandle";



/* 初始化app */
const app = new koa();

/* 定义公共路径，不需要jwt鉴权 */
const jwt = JWT({ secret: config.JWT_SECRET }).unless({
  path: [/^\/user/, /^\/public/ ]
})

/*使用 koa-compose整合中间件*/
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, "../public")),
  cors(),
  jsonUtil({ pretty: false, param: "pretty" }),
  helmet(),
  errorHandle, //等到 upstream 的 stack unwind 的时候会捕获错误
  jwt,
]);

/* 使用中间件 */
app.use(middleware);
app.use(router());



app.listen(3001, () => {
  console.log("Koa App Success Start!");
});
