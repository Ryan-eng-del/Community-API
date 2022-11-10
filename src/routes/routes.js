import combineRoutes from 'koa-combine-routers'

const moduleFiles = require.context('./modules', true, /\.js$/)

const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path, 'path')
  items.push(value.default)
  return items
}, [])

export default combineRoutes(modules)
