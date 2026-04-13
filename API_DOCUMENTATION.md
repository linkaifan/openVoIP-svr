# API 接口文档

## 基础信息

- **Base URL**: `http://43.160.203.206:80`
- **Content-Type**: `application/json`

## 接口列表

### 1. 更新用户信息

更新或创建用户信息。如果用户已存在（通过 openId 判断），则更新信息；否则创建新用户。

#### 请求信息

- **URL**: `/updateUser`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### 请求参数

| 参数名       | 类型   | 必填 | 说明                                       |
| ------------ | ------ | ---- | ------------------------------------------ |
| code         | string | 是   | 微信小程序登录凭证（wx.login 返回的 code） |
| name         | string | 否   | 用户名称                                   |
| subId        | string | 否   | 订阅 ID                                    |
| idName       | string | 否   | 身份证姓名                                 |
| idCardNumber | string | 否   | 身份证号码                                 |
| roomType     | string | 否   | 房间类型                                   |
| appId        | string | 否   | 小程序 AppId，默认为 `wxf830863afde621eb`  |

#### 请求示例

```json
{
  "code": "081xYn100sZxxx",
  "name": "张三",
  "subId": "P9/rzyfrH9o/oVCw1QvCMCNSMXd5uWUm6wd0YQv3cuRXwVe7fz3LI065hbu8AetT3nG3g1Wh8JJOHw==",
  "idName": "张三",
  "idCardNumber": "123456789012345678",
  "roomType": "voice",
  "appId": "wxf830863afde621eb"
}
```

#### 响应示例

**成功响应 (200)**

```json
{
  "success": true,
  "openId": "oX74N46OrO2kgZcrKufZv3eFzG3M"
}
```

**错误响应 (500)**

```json
{
  "error": "Error message"
}
```

---

### 2. 获取所有用户

获取指定 AppId 对应数据库中的所有用户信息。

#### 请求信息

- **URL**: `/getUsers`
- **Method**: `GET`

#### 请求参数

| 参数名 | 类型   | 必填 | 说明                                       |
| ------ | ------ | ---- | ------------------------------------------ |
| code   | string | 是   | 微信小程序登录凭证（wx.login 返回的 code） |
| appId  | string | 否   | 小程序 AppId，默认为 `wxf830863afde621eb`  |

#### 请求示例

```
GET /getUsers?code=081xYn100sZxxx&appId=wxf830863afde621eb
```

#### 响应示例

**成功响应 (200)**

```json
{
  "users": [
    {
      "openId": "oX74N46OrO2kgZcrKufZv3eFzG3M",
      "name": "张三",
      "subId": "P9/rzyfrH9o/oVCw1QvCMCNSMXd5uWUm6wd0YQv3cuRXwVe7fz3LI065hbu8AetT3nG3g1Wh8JJOHw==",
      "idName": "张三",
      "idCardNumber": "123456789012345678",
      "roomType": "voice",
      "createdAt": "2025-12-18T00:00:00.000Z",
      "updatedAt": "2025-12-18T01:00:00.000Z"
    },
    {
      "openId": "oX74N4wGvQc2GrPm0e3-i99lqQcU",
      "name": "李四",
      "subId": "jbhY58yNaPTioG+GNj2aaX/uVZiaZgQWZZkbETXtQFN8Cfn0QYPORDHKXaQ6h3vEDLp+ZGaLsRCWiQ==",
      "idName": "李四",
      "idCardNumber": "987654321098765432",
      "roomType": "roomType",
      "createdAt": "2025-12-18T00:00:00.000Z"
    }
  ],
  "openId": "oX74N46OrO2kgZcrKufZv3eFzG3M"
}
```

---

### 3. 获取通话 ID

发起音视频通话，获取通话 ID。系统会根据 listenerOpenId 查找对应用户的 subId，然后调用微信官方接口生成通话 ID。

#### 请求信息

- **URL**: `/getCallId`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### 请求参数

| 参数名         | 类型   | 必填 | 说明                                      |
| -------------- | ------ | ---- | ----------------------------------------- |
| callerOpenId   | string | 是   | 呼叫方的 openId                           |
| listenerOpenId | string | 是   | 接听方的 openId                           |
| appId          | string | 否   | 小程序 AppId，默认为 `wxf830863afde621eb` |

#### 请求示例

```json
{
  "callerOpenId": "oX74N46OrO2kgZcrKufZv3eFzG3M",
  "listenerOpenId": "oX74N4wGvQc2GrPm0e3-i99lqQcU",
  "appId": "wxf830863afde621eb"
}
```

#### 响应示例

**成功响应 (200)**

```json
{
  "errcode": 0,
  "errmsg": "ok",
  "call_id": "CALL_ID_STRING"
}
```

**用户未找到 (404)**

```json
{
  "success": false,
  "error": "Listener user not found"
}
```

**微信接口错误 (200)**

```json
{
  "errcode": 40001,
  "errmsg": "invalid credential"
}
```

---

## 数据模型

### User 用户对象

| 字段名       | 类型   | 说明                                      |
| ------------ | ------ | ----------------------------------------- |
| openId       | string | 微信小程序用户唯一标识                    |
| name         | string | 用户名称                                  |
| subId        | string | 订阅 ID（用于音视频通话）                 |
| idName       | string | 身份证姓名                                |
| idCardNumber | string | 身份证号码                                |
| roomType     | string | 房间类型                                  |
| createdAt    | string | 创建时间（ISO 8601 格式）                 |
| updatedAt    | string | 更新时间（ISO 8601 格式，仅在更新时存在） |

---

## 错误码

| 错误码 | 说明                       |
| ------ | -------------------------- |
| 404    | 资源未找到（如用户不存在） |
| 500    | 服务器内部错误             |

### 微信接口错误码

| errcode | 说明                   |
| ------- | ---------------------- |
| 0       | 请求成功               |
| 40001   | access_token 无效      |
| 40003   | openid 无效            |
| 40013   | appid 无效             |
| 41001   | 缺少 access_token 参数 |

---

## 注意事项

1. **code 有效期**: 微信登录凭证 code 只能使用一次，有效期为 5 分钟
2. **数据库隔离**: 不同的 appId 使用独立的数据库文件（`{appId}_db.json`）
3. **字段更新**: 更新用户信息时，未传入的字段会保留原有值
4. **appId 默认值**: 所有接口如果不传 appId，默认使用 `wxf830863afde621eb`

---

## 测试示例

### 使用 curl 测试

```bash
# 1. 更新用户信息
curl -X POST http://localhost:80/updateUser \
  -H "Content-Type: application/json" \
  -d '{
    "code": "081xYn100sZxxx",
    "name": "张三",
    "subId": "test_sub_id",
    "idName": "张三",
    "idCardNumber": "123456789012345678"
  }'

# 2. 获取所有用户
curl -X GET "http://localhost:80/getUsers?code=081xYn100sZxxx"

# 3. 获取通话 ID
curl -X POST http://localhost:80/getCallId \
  -H "Content-Type: application/json" \
  -d '{
    "callerOpenId": "oX74N46OrO2kgZcrKufZv3eFzG3M",
    "listenerOpenId": "oX74N4wGvQc2GrPm0e3-i99lqQcU"
  }'
```

### 使用 JavaScript fetch 测试

```javascript
// 更新用户信息
const updateUser = async (code, userData) => {
  const response = await fetch('http://localhost:80/updateUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      ...userData,
    }),
  })
  return await response.json()
}

// 获取所有用户
const getUsers = async (code) => {
  const response = await fetch(`http://localhost:80/getUsers?code=${code}`)
  return await response.json()
}

// 获取通话 ID
const getCallId = async (callerOpenId, listenerOpenId) => {
  const response = await fetch('http://localhost:80/getCallId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callerOpenId,
      listenerOpenId,
    }),
  })
  return await response.json()
}
```

---

## 更新日志

### v1.0.0 (2025-12-18)

- 初始版本
- 支持用户信息管理
- 支持微信音视频通话
- 支持多 AppId 数据隔离
