import { createClient } from 'redis'

const client = createClient()

client.connect().then((res) => {
  console.log('Redis: connected Success!')
})

client.on('error', (err) => {
  console.log('Redis Client Error:' + err)
})

const setValue = async (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (time) {
      await client.set(key, value, {
        EX: time,
        NX: true
      })
    } else {
      await client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((item) => {
      client.hSet(key, item, value[item])
    })
  }
}

const getValue = async (key) => {
  return client.get(key)
}

const getHValue = (key) => {
  return client.hGetAll(key)
}

const delValue = (key) => {
  return client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully')
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

export { client, setValue, getValue, getHValue, delValue }
