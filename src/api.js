import got from 'got'
import { defaultAppId, appId2Secret } from './const.js'

const getAccessToken = async (appId = defaultAppId) => {
  const appSecret = appId2Secret[appId]

  if (!appSecret) {
    throw new Error(`AppId ${appId} not found in appId2Secret`)
  }

  const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`

  try {
    const response = await got(tokenUrl, { method: 'GET' })
    const data = JSON.parse(response.body)
    if (data.access_token) {
      console.log('Access token obtained successfully')
      return data.access_token
    } else {
      throw new Error(`Failed to get access token: ${JSON.stringify(data)}`)
    }
  } catch (error) {
    console.error('Failed to get access token:', error)
    throw error
  }
}

export const getCallId = async (
  caller_openid,
  listener_openid,
  sub_id,
  appId = defaultAppId
) => {
  const accessToken = await getAccessToken(appId)
  console.log('Access Token:', accessToken)
  // host 'https://api.weixin.qq.com'
  // const apiUrl = `http://43.137.159.166:80/wxa/genvoipservicecallid?access_token=${accessToken}`
  const apiUrl = `https://api.weixin.qq.com/wxa/genvoipservicecallid?access_token=${accessToken}`
  const response = await got(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Host: 'api.weixin.qq.com',
    },
    body: JSON.stringify({
      caller_openid,
      listener_openid,
      sub_id,
    }),
  })

  return JSON.parse(response.body)
}

export const getOpenId = async (code, appId = defaultAppId) => {
  const appSecret = appId2Secret[appId]

  if (!appSecret) {
    throw new Error(`AppId ${appId} not found in appId2Secret`)
  }

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
  const response = await got(url, { method: 'GET' })
  const data = JSON.parse(response.body)
  console.log('Openid obtained successfully:', data)
  return data.openid
}
