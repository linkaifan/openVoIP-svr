import 'dotenv/config'

export const appId2Secret = {
  [process.env.WX_APP_ID_1]: process.env.WX_APP_SECRET_1, // 官方音视频
  [process.env.WX_APP_ID_2]: process.env.WX_APP_SECRET_2, // fans 小程序
}

export const defaultAppId = process.env.DEFAULT_APP_ID
