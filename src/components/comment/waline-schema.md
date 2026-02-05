# Waline 评论系统数据库结构总结

> 本文总结给出的 SQL 语句所创建的数据库对象与字段含义，用于理解 Waline 评论系统的数据存储结构与常见用途。

## 总览
- 使用了 3 个表与配套序列（PostgreSQL 风格的 `SEQUENCE` + `NEXTVAL` 自增主键）：
  - `wl_comment`：评论内容与层级关系的主表
  - `wl_counter`：页面或资源的互动计数（浏览/反应）
  - `wl_users`：用户与第三方账号绑定信息
- 每张表都有对应的自增序列：`wl_comment_seq`、`wl_counter_seq`、`wl_users_seq`。

## 序列（SEQUENCE）
- `CREATE SEQUENCE wl_comment_seq;` 等语句分别创建了用于主键自增的序列。
- 表的 `id` 主键使用 `DEFAULT NEXTVAL('...')` 从对应序列中获取递增值，确保主键唯一且连续。

## 表结构与字段解释

### 1) wl_comment（评论主表）
用于存储每条评论的主体内容、作者信息、层级关系与元数据。

- 主键
  - `id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_comment_seq')`
- 关联与作者信息
  - `user_id int DEFAULT NULL`：关联到 `wl_users.id`（可为空，表示匿名或未绑定用户）
  - `nick varchar(255) DEFAULT NULL`：评论者昵称
  - `mail varchar(255) DEFAULT NULL`：评论者邮箱
  - `link varchar(255) DEFAULT NULL`：评论者个人主页或外链
- 评论内容与上下文
  - `comment text`：评论正文
  - `url varchar(255) DEFAULT NULL`：评论所属页面的路径（如文章地址）
  - `pid int DEFAULT NULL`：父评论 ID（楼层/父子关系）
  - `rid int DEFAULT NULL`：被回复的评论 ID（精确指向）
- 状态与标记
  - `status varchar(50) NOT NULL DEFAULT ''`：评论状态（如正常、审核中、已删除等，具体取决于业务约定）
  - `sticky numeric DEFAULT NULL`：置顶权重（数值越大越靠前）
- 交互与环境
  - `"like" int DEFAULT NULL`：点赞数
  - `ip varchar(100) DEFAULT ''`：评论者 IP
  - `ua text`：User-Agent（浏览器/设备信息）
- 时间戳
  - `insertedAt timestamp(0) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP`：插入时间（推荐作为真实创建时间）
  - `createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`：创建时间（与 insertedAt 一致或用于兼容）
  - `updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`：更新时间

> 常见用途：
> - 通过 `url` 筛选某页面的所有评论
> - 通过 `pid`/`rid` 构建评论的树形/楼中楼结构
> - 按 `insertedAt` 排序实现时间线
> - 使用 `status` 控制审核/隐藏逻辑
> - 使用 `sticky` 与 `"like"` 实现置顶与热度排序

### 2) wl_counter（互动计数表）
用于记录某 `url` 的互动统计与反应表情计数。

- 主键
  - `id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_counter_seq')`
- 计数项
  - `time int DEFAULT NULL`：累计时间或次数（具体语义由业务定义）
  - `reaction0` ~ `reaction8 int DEFAULT NULL`：9 类反应（如不同表情/反应类型的计数）
- 上下文与时间戳
  - `url varchar(255) NOT NULL DEFAULT ''`：对应页面或资源路径（唯一性建议后续建立索引或唯一约束）
  - `createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`
  - `updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`

> 常见用途：
> - 快速读取某页面的互动数据（浏览/表情反应）
> - 与前端的“浏览量/反应”组件联动展示

### 3) wl_users（用户表）
用于管理用户基础信息与第三方登录绑定。

- 主键
  - `id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_users_seq')`
- 基础信息
  - `display_name varchar(255) NOT NULL DEFAULT ''`：显示名称
  - `email varchar(255) NOT NULL DEFAULT ''`
  - `password varchar(255) NOT NULL DEFAULT ''`：密码（需结合服务端安全策略，不建议明文存储）
  - `type varchar(50) NOT NULL DEFAULT ''`：用户类型/角色（如 admin、user、oauth-user）
  - `label varchar(255) DEFAULT NULL`：标签（如备注/身份标识）
- 个人资料
  - `url varchar(255) DEFAULT NULL`：个人主页
  - `avatar varchar(255) DEFAULT NULL`：头像
- 第三方账号绑定
  - `github/twitter/facebook/google/weibo/qq/oidc varchar(255) DEFAULT NULL`：各平台的绑定标识
  - `"2fa" varchar(32) DEFAULT NULL`：双因素认证标识（具体格式依实现）
- 时间戳
  - `createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`
  - `updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP`

> 常见用途：
> - 作为评论者的身份来源（与 `wl_comment.user_id` 关联）
> - 支持各类 OAuth 登录

## 设计建议（可选优化）
- 索引：
  - `wl_comment(url)`、`wl_comment(pid)`、`wl_comment(rid)`、`wl_comment(insertedAt)`
  - `wl_counter(url)` 唯一索引或普通索引
  - `wl_users(email)` 唯一索引（避免重复注册）
- 约束：
  - `wl_comment.user_id` 建立外键到 `wl_users(id)`（视业务是否允许匿名决定是否强制）
  - `"like"`、`reaction*` 字段建议默认 `0` 并添加非负约束
- 安全：
  - `password` 应使用安全哈希（如 bcrypt/argon2），不可明文
  - 结合服务端实现，对 `status` 流程（审核/删除）进行约束与审计

## 与 Waline 的对应关系
- `wl_comment` 对应评论的增删改查与楼层关系。
- `wl_counter` 对应前端的浏览与反应统计组件。
- `wl_users` 对应用户与第三方登录信息；如设置 `login: 'enable'/'force'` 会影响是否需要用户身份才能评论。

---

本文仅总结结构与字段作用，实际运行需结合你的服务端实现（ORM/迁移脚本、CORS、鉴权、中间件等）。

