import express from 'express'
import bodyParser from 'body-parser'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { getCallId, getOpenId } from './api.js'
import { defaultAppId, appId2Secret } from './const.js'

const app = express()

// 使用 body-parser 解析请求体
app.use(bodyParser.json()) // 解析 JSON 格式
app.use(bodyParser.urlencoded({ extended: true })) // 解析 URL-encoded 格式

const initDB = async (appId) => {
  // 初始化 lowdb
  const adapter = new JSONFile(`./${appId}_db.json`)
  const db = new Low(adapter, {})

  // 初始化数据库
  await db.read()
  db.data ||= { users: [] }
  await db.write()
  return db
}

// 初始化所有数据库
const dbMap = {}
for (const appId of Object.keys(appId2Secret)) {
  dbMap[appId] = await initDB(appId)
}

// 获取数据库的辅助函数
const getDB = (appId) => {
  const db = dbMap[appId || defaultAppId]
  if (!db) {
    throw new Error(`Database for appId ${appId} not found`)
  }
  return db
}

// 登录：用 code 换取 openId（唯一需要 code 的接口）
app.post('/login', async (req, res) => {
  try {
    const { code, appId } = req.body
    console.log(`login`, { code, appId })
    const openId = await getOpenId(code, appId || defaultAppId)
    res.json({ openId })
  } catch (e) {
    console.error('login error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// 更新用户信息
app.post('/updateUser', async (req, res) => {
  console.log(`updateUser`, req.body)

  const { openId, name, subId, roomType, appId } = req.body
  if (!openId) {
    return res.status(400).json({ error: 'openId is required' })
  }

  const db = getDB(appId)
  await db.read()
  const oldUserIdx = db.data.users.findIndex((user) => user.openId === openId)

  if (oldUserIdx !== -1) {
    const user = db.data.users[oldUserIdx]
    db.data.users[oldUserIdx] = {
      ...user,
      name: name || user.name,
      subId: subId || user.subId,
      roomType: roomType || user.roomType,
      updatedAt: new Date().toISOString(),
    }
  } else {
    db.data.users.push({
      openId,
      name: name || '',
      subId: subId || '',
      roomType: roomType || '',
      createdAt: new Date().toISOString(),
    })
  }

  await db.write()
  res.json({ success: true, openId })
})

// 获取所有用户
app.get('/getUsers', async (req, res) => {
  const { appId } = req.query
  const db = getDB(appId)
  await db.read()
  res.json({ users: db.data.users })
})

// 呼叫
app.post('/getCallId', async (req, res) => {
  const { callerOpenId, listenerOpenId, appId } = req.body
  const db = getDB(appId)

  // 从 db 中找到 openId = listenerOpenId 的，获取它的subId
  await db.read()
  const listener = db.data.users.find((user) => user.openId === listenerOpenId)
  if (!listener) {
    return res.status(404).json({
      success: false,
      error: 'Listener user not found',
    })
  }

  if (!listener.subId) {
    return res.json({
      success: false,
      error: 'Listener user has no subId',
    })
  }

  const subId = listener.subId
  const resp = await getCallId(
    callerOpenId,
    listenerOpenId,
    subId,
    appId || defaultAppId
  )
  console.log(`getCallId: `, {
    callerOpenId,
    listenerOpenId,
    resp,
  })

  res.json(resp)
})

const PORT = process.env.PORT || 80
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
