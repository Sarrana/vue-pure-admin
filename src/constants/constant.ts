//路由列表
/* export const routes = [
  {id: 1, path: '', }
] */

// 状态枚举
export const enum STATUS {
  FALSE = 0,
  TRUE = 1
}

// 订单状态
export const enum ORDERSTATUS {
  PENDING = 0, // 待处理
  SUCCESS = 1, // 成功
  FAILED = 2 // 失败
}
export const ORDERSTATUSOPTIONS = [
  { label: "待处理", value: ORDERSTATUS.PENDING, color: "#E6A23C" },
  { label: "交易成功", value: ORDERSTATUS.SUCCESS, color: "#67C23A" },
  { label: "交易失败", value: ORDERSTATUS.FAILED, color: "#F56C6C" }
];

// 聊天记录类型
export const enum CHATTYPE {
  USER = 1, // 用户
  CUSTOMERSERVICE = 2 // 客服
}

// 视频类型
export const enum VIDOETYPE {
  LONG = 1,
  SHORT = 2
}

// 表单类型枚举 （查询用）
export const enum FORMITEMTYPE {
  INPUT,
  EDITOR,
  SELECT, // 下拉选择（单选）
  RANGEPICKER, // 日期范围选择器
  DATEPICKER, // 日期选择器
  UPLOADIMG, // 上传图片
  UPLOADIMGRAW, // 上传图片
  UPLOADVIDEO, // 上传视频
  SELECTTAGS, // 多选标签
  SWITCH, // Switch
  TREE, // 树形菜单
  UPLOADMULTI,
  RADIO,
  TREESELECT,
  ARRAY,
  SELECTMULTI,
  SELECTTREE
}

// 图片类型
export const enum IMGTYPE {
  JPEG = "jpeg",
  PNG = "png",
  WEBP = "webp"
}

// 读取的图片文件类型
export const enum IMGFILETYPE {
  BLOB = "blob",
  BASE64 = "base64"
}

// 应用平台类型枚举
export const enum PLATFORMTYPE {
  WEB = "WEB",
  ANDROID = "Android",
  PWA = "PWA",
  IOS = "IOS"
}
// 平台类型选项
export const PLATFORMTYPEOPTIONS = [
  { label: "WEB", value: PLATFORMTYPE.WEB },
  { label: "Android", value: PLATFORMTYPE.ANDROID },
  { label: "PWA", value: PLATFORMTYPE.PWA },
  { label: "IOS", value: PLATFORMTYPE.IOS }
];

// 展示平台 (目前用于联系方法展示端)
export const enum SHOWPLATFORM {
  APP = 0, // 显示在app端
  LANDINGPAGE = 2, // 显示在落地页
  WEB = 3,
  PWA = 1
}
export const SHOWPLATFORMOPTIONS = [
  { label: "APP端", value: SHOWPLATFORM.APP, text: "APP端" },
  { label: "落地页", value: SHOWPLATFORM.LANDINGPAGE, text: "落地页" },
  { label: "网页端", value: SHOWPLATFORM.WEB, text: "网页端" },
  { label: "PWA", value: SHOWPLATFORM.PWA, text: "PWA" }
];

// 广告处理类型枚举
export const enum ADACTION {
  NOTHING = 0, // 不处理
  OUTLINK = 1, // 外部跳转
  TAGLINK = 2, // 标签跳转
  INNERLINK = 3, // 内部跳转
  CERTAINVIDEO = 4, // 指定视频
  VIPPAGE = 6 // 充值VIP
}
export const ADACTIONOPTIONS = [
  // { label: "不处理", value: ADACTION.NOTHING },
  { label: "外部跳转", value: ADACTION.OUTLINK }
  // { label: "标签跳转", value: ADACTION.TAGLINK },
  // { label: "内部跳转", value: ADACTION.INNERLINK },
  // { label: "指定视频", value: ADACTION.CERTAINVIDEO },
  // { label: "充值VIP", value: ADACTION.VIPPAGE }
];

// Default setting for pagination
export const ITEMPERPAGE = 10;

// 点击取消按钮时的操作
export const enum CANCELACION {
  RESET, // 重置表单
  CALLBACK, // 回调
  CLOSE // 关闭弹窗
}

export const enum VIDEOENCODESTATUS {
  ENCODING = 0, // 转码中
  SUCCESS = 1, // 转码成功
  FAILED = 2 // 转码失败
  // REUPLOAD = 4 // 重传中
}
export const VIDEOENCODEOPTIONS = [
  { label: "转码中", value: VIDEOENCODESTATUS.ENCODING, color: "#E6A23C" },
  { label: "转码完成", value: VIDEOENCODESTATUS.SUCCESS, color: "#67C23A" },
  { label: "转码失败", value: VIDEOENCODESTATUS.FAILED, color: "#F56C6C" }
  // { label: "重传中", value: VIDEOENCODESTATUS.REUPLOAD, color: "#909399" }
];

export const APPROVEDSTATUSOPTIONS = [
  { label: "未审核", value: 0, color: "#E6A23C" },
  { label: "已通过", value: 1, color: "#67C23A" },
  { label: "已驳回", value: 2, color: "#F56C6C" }
];

// 身份用户
export const enum IDENTITYSTATUS {
  GENERAL = 1, // 普通用户
  MASTER = 2, // up主
  ORIGINAL = 3, // 原创主
  ALLUSER = 4 // 所有用户
}
export const IDENTITYSTATUSOPTIONS = [
  { label: "普通用户", value: IDENTITYSTATUS.GENERAL },
  { label: "up主", value: IDENTITYSTATUS.MASTER },
  { label: "原创主", value: IDENTITYSTATUS.ORIGINAL },
  { label: "所有用户", value: IDENTITYSTATUS.ALLUSER }
];

// 身份用户
export const enum ADPLACEMENTSTATUS {
  POSTDETAIL = 1, // 帖子详情
  HOMEWINDOW = 2, // 首页弹窗
  ANNOUNCEMENT = 3, // 弹窗公告
  SPLASHPAGE = 4, // 启屏页
  FLOATWINDOWN = 5 // 浮窗
}
export const ADPLACEMENTSTATUSOPTIONS = [
  { label: "帖子详情", value: ADPLACEMENTSTATUS.POSTDETAIL },
  { label: "首页弹窗", value: ADPLACEMENTSTATUS.HOMEWINDOW },
  { label: "弹窗公告", value: ADPLACEMENTSTATUS.ANNOUNCEMENT },
  { label: "启屏页", value: ADPLACEMENTSTATUS.SPLASHPAGE },
  { label: "浮窗", value: ADPLACEMENTSTATUS.FLOATWINDOWN }
];

export const enum ADTYPESTATUS {
  NOTDEAL = 0, // 不处理
  EXTERNALJUMP = 1, // 外部跳转
  LABELJUMP = 2, // 跳转标签
  INTERNALJUMP = 3, // 内部跳转
  SPECIFIEDVDO = 4, // 指定视频
  RECHARGEVIP = 5 // 充值VIP
}
export const ADTYPESTATUSOPTIONS = [
  { label: "不处理", value: ADTYPESTATUS.NOTDEAL },
  { label: "外部跳转", value: ADTYPESTATUS.EXTERNALJUMP },
  { label: "跳转标签", value: ADTYPESTATUS.LABELJUMP },
  { label: "内部跳转", value: ADTYPESTATUS.INTERNALJUMP },
  { label: "指定视频", value: ADTYPESTATUS.SPECIFIEDVDO },
  { label: "充值VIP", value: ADTYPESTATUS.RECHARGEVIP }
];

// 审核状态
export const enum REVIEWSTATUS {
  TOBEREVIEW = 0, // 待审核
  PASSED = 1, // 审核通过
  NOTPASSED = 2 // 审核失败
}
export const REVIEWSTATUSOPTIONS = [
  { label: "待审核", value: REVIEWSTATUS.TOBEREVIEW },
  { label: "审核通过", value: REVIEWSTATUS.PASSED },
  { label: "审核失败", value: REVIEWSTATUS.NOTPASSED }
];

export const MAXITEMPERPAGE = 1000;
export const PREFIXAPI = "/api";

// Permission category enumeration
export const enum PERM_CATE_TYPE {
  DIRECTERY = 0,
  MENU = 1,
  BUTTON = 2
}
// Permission category options
export const PERM_CATE_OPTIONS = [
  // { label: "目录", value: PERM_CATE_TYPE.DIRECTERY },
  { label: "菜单", value: PERM_CATE_TYPE.MENU },
  { label: "按钮", value: PERM_CATE_TYPE.BUTTON }
];

export const paymentChannelTypes = [
  { label: "山姆", value: 0 },
  { label: "宏远", value: 1 },
  { label: "铭森", value: 2 }
];

export const paymentTypes = [
  { label: "微信", value: 1 },
  { label: "支付宝", value: 2 }
];
