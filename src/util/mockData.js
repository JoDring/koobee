const mockString =
    '{\n' +
    '  "code": "0",\n' +
    '  "msg": "OK",\n' +
    '  "data": {\n' +
    '    "pageCount": 18,\n' +
    '    "navbars": [\n' +
    '      {\n' +
    '        "id": 1,\n' +
    '        "title": "必备",\n' +
    '        "iconUrl": "http://360.cooseatech.cn/appstore/startup/%E5%BF%85%E5%A4%87_1508466892015_icon_%E5%85%A5%E5%8F%A3_%E5%BF%85%E5%A4%87.png",\n' +
    '        "type": "need",\n' +
    '        "updateTime": "2018-03-07 14:28:08",\n' +
    '        "istatus": 1,\n' +
    '        "sn": 1\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 2,\n' +
    '        "title": "榜单",\n' +
    '        "iconUrl": "http://360.cooseatech.cn/appstore/images/1520403916261_逃生.png.webp",\n' +
    '        "type": "rank",\n' +
    '        "updateTime": "2018-03-07 14:28:24",\n' +
    '        "istatus": 1,\n' +
    '        "sn": 2\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 3,\n' +
    '        "title": "分类",\n' +
    '        "iconUrl": "http://360.cooseatech.cn/appstore/startup/%E5%88%86%E7%B1%BB_1508466855670_icon_%E5%85%A5%E5%8F%A3_%E5%88%86%E7%B1%BB.png",\n' +
    '        "type": "category",\n' +
    '        "updateTime": "2018-03-07 14:28:20",\n' +
    '        "istatus": 1,\n' +
    '        "sn": 3\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 4,\n' +
    '        "title": "游戏",\n' +
    '        "iconUrl": "http://360.cooseatech.cn/appstore/startup/%E5%8D%95%E6%9C%BA_1508466977964_icon_%E5%85%A5%E5%8F%A3_%E5%8D%95%E6%9C%BA.png",\n' +
    '        "type": "game",\n' +
    '        "updateTime": "2018-03-07 14:28:33",\n' +
    '        "istatus": 1,\n' +
    '        "sn": 4\n' +
    '      }\n' +
    '    ],\n' +
    '    "pageIndex": 1,\n' +
    '    "pageSize": 20,\n' +
    '    "pageItemCount": 346,\n' +
    '    "apps": [\n' +
    '      {\n' +
    '        "id": 15138,\n' +
    '        "name": "葫芦娃",\n' +
    '        "packageName": "air.com.ada.hlxd.android",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=15138",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t01753f4ec0ad5a283b.png",\n' +
    '        "versionCode": 1001003,\n' +
    '        "versionName": "1.1.3",\n' +
    '        "apkSize": 122967484,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 316325,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "妖精，快放了我爷爷",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 2916,\n' +
    '        "name": "秒拍",\n' +
    '        "packageName": "com.yixia.videoeditor",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=2916",\n' +
    '        "iconUrl": "http://cdnimages.img-cn-hangzhou.aliyuncs.com/appstore/appinfo/icons/1514880918628.jpg@!appBigIcon",\n' +
    '        "versionCode": 65198,\n' +
    '        "versionName": "6.7.51",\n' +
    '        "apkSize": 12654592,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 5331799,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "阿凡达斯",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 69500,\n' +
    '        "name": "中原找房",\n' +
    '        "packageName": "com.centaline.androidsalesblog",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=69500",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t01b404e526771fbd3e.png",\n' +
    '        "versionCode": 500,\n' +
    '        "versionName": "5.0.0",\n' +
    '        "apkSize": 22982301,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 1984,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "买卖二手房、搜新房、租房的专业房产软件",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 1979565,\n' +
    '        "name": "途虎养车",\n' +
    '        "packageName": "cn.TuHu.android",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=1979565",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t017f56fc6692a83d34.png",\n' +
    '        "versionCode": 70,\n' +
    '        "versionName": "5.1.6",\n' +
    '        "apkSize": 40366420,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 5,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "途虎养车，洗车只要1分钱！",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 1977726,\n' +
    '        "name": "唯品会",\n' +
    '        "packageName": "com.achievo.vipshop",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=1977726",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t01cb07dced210ba232.png",\n' +
    '        "versionCode": 812,\n' +
    '        "versionName": "6.12.2",\n' +
    '        "apkSize": 46454506,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 10136703,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "唯品会  一家专门做特卖的网站",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 6038,\n' +
    '        "name": "最右",\n' +
    '        "packageName": "cn.xiaochuankeji.tieba",\n' +
    '        "downloadUrl": "http://192.168.1.187:8080/appstore/appinfo/download?appId=6038",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t01753f4ec0ad5a283b.png",\n' +
    '        "versionCode": 40200,\n' +
    '        "versionName": "4.0.2",\n' +
    '        "apkSize": 26515252,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 1033744,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "最右，看搞笑短视频的社区",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 1977961,\n' +
    '        "name": "免费小说大全",\n' +
    '        "packageName": "com.aikan",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=1977961",\n' +
    '        "iconUrl": "http://p19.qhimg.com/t01834b925652eba811.png",\n' +
    '        "versionCode": 1010403,\n' +
    '        "versionName": "1.4.03.16212",\n' +
    '        "apkSize": 5190656,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 6592778,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 20436,\n' +
    '        "name": "免费电子书",\n' +
    '        "packageName": "com.mianfeia.book",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=20436",\n' +
    '        "iconUrl": "http://p0.qhimg.com/t0191d076a471d75576.png",\n' +
    '        "versionCode": 64,\n' +
    '        "versionName": "3.9.3",\n' +
    '        "apkSize": 8287272,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 666951,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "免费阅读还能赚钱的APP",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 31,\n' +
    '        "name": "宝宝听音乐",\n' +
    '        "packageName": "com.cn.baoyi.babysong",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=31",\n' +
    '        "iconUrl": "http://p17.qhimg.com/t012f378e62ebc992b4.png",\n' +
    '        "versionCode": 200287,\n' +
    '        "versionName": "2.87",\n' +
    '        "apkSize": 1447936,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 39734,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 3558,\n' +
    '        "name": "小资钱包",\n' +
    '        "packageName": "com.xiaoziqianbao.xzqb",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=3558",\n' +
    '        "iconUrl": "http://p18.qhimg.com/t0192b83b9fdbc6d641.png",\n' +
    '        "versionCode": 30,\n' +
    '        "versionName": "2.3.0",\n' +
    '        "apkSize": 9481598,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 68304,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "小资钱包，收益更好的理财产品",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 3001,\n' +
    '        "name": "微财讯",\n' +
    '        "packageName": "com.cjmrh.app",\n' +
    '        "downloadUrl": "http://192.168.0.126:8080/appstore/appinfo/download?appId=3001",\n' +
    '        "iconUrl": "http://p19.qhimg.com/t01a0c20b41632b26a5.png",\n' +
    '        "versionCode": 38,\n' +
    '        "versionName": "5.3",\n' +
    '        "apkSize": 8373248,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 25218,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "汇集全国股市精英，天天帮你选到涨停股。",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 38,\n' +
    '        "name": "录屏大师",\n' +
    '        "packageName": "com.screeclibinvoke",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=38",\n' +
    '        "iconUrl": "http://p15.qhimg.com/t019b7414da9485a134.png",\n' +
    '        "versionCode": 20160901,\n' +
    '        "versionName": "2.1.2",\n' +
    '        "apkSize": 11024384,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 221996,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "实用工具 录制屏幕 ",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 37,\n' +
    '        "name": "经理人分享",\n' +
    '        "packageName": "com.managershare",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=37",\n' +
    '        "iconUrl": "http://p17.qhimg.com/t0101aca6c3d0d10b39.png",\n' +
    '        "versionCode": 74,\n' +
    '        "versionName": "3.4.3",\n' +
    '        "apkSize": 6608896,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 20921,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "教育学习教育学习教育学习",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 769,\n' +
    '        "name": "乐享动",\n' +
    '        "packageName": "com.fitmix.sdk",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=769",\n' +
    '        "iconUrl": "http://p18.qhimg.com/t01bbcff96cd647c426.png",\n' +
    '        "versionCode": 44,\n' +
    '        "versionName": "2.2.4",\n' +
    '        "apkSize": 17409072,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 200532,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "有运动音乐推荐的计步器软件",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 4484,\n' +
    '        "name": "亿连驾驶助手",\n' +
    '        "packageName": "net.easyconn.carman",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=4484",\n' +
    '        "iconUrl": "http://p17.qhimg.com/t0197e101dca09a6286.png",\n' +
    '        "versionCode": 326,\n' +
    '        "versionName": "3.3.5.7",\n' +
    '        "apkSize": 48218683,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 2708,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "智能语音对讲，实时路况导航",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 693,\n' +
    '        "name": "平安WiFi",\n' +
    '        "packageName": "com.pingan.pinganwifi",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=693",\n' +
    '        "iconUrl": "http://p19.qhimg.com/t01c9113bff28b57a62.png",\n' +
    '        "versionCode": 791,\n' +
    '        "versionName": "4.5.5",\n' +
    '        "apkSize": 12315551,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 1825581,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "注册即可免费领100M平安流量",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 3539,\n' +
    '        "name": "走秀奢侈品",\n' +
    '        "packageName": "com.xiu.app",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=3539",\n' +
    '        "iconUrl": "http://p18.qhimg.com/t014112886293dfaf6f.png",\n' +
    '        "versionCode": 250,\n' +
    '        "versionName": "4.3.0",\n' +
    '        "apkSize": 19167764,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 252376,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "走秀网2016秋冬上新，换季折扣",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 4713,\n' +
    '        "name": "拍拍贷借款",\n' +
    '        "packageName": "com.ppdai.loan",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=4713",\n' +
    '        "iconUrl": "http://p18.qhimg.com/t01581bd0bc1a1bd908.png",\n' +
    '        "versionCode": 26,\n' +
    '        "versionName": "4.0.1",\n' +
    '        "apkSize": 6784851,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 189847,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "2小时极速信用贷，有身份证就能借",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 5312,\n' +
    '        "name": "火理财",\n' +
    '        "packageName": "com.huolicai.android",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=5312",\n' +
    '        "iconUrl": "http://p19.qhimg.com/t0102f03dfd66b603de.png",\n' +
    '        "versionCode": 50,\n' +
    '        "versionName": "2.6.1",\n' +
    '        "apkSize": 6409809,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 464312,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "火理财-活期年化7%的金融投资理财助手",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      },\n' +
    '      {\n' +
    '        "id": 1977699,\n' +
    '        "name": "当当",\n' +
    '        "packageName": "com.dangdang.buy2",\n' +
    '        "downloadUrl": "http://192.168.1.148:8080/appstore/appinfo/download?appId=1977699",\n' +
    '        "iconUrl": "http://img6.uuserv30.net/20150416/1429179365672/142917936566982.png",\n' +
    '        "versionCode": 121,\n' +
    '        "versionName": "6.2.1",\n' +
    '        "apkSize": 34713382,\n' +
    '        "istatus": 0,\n' +
    '        "downloadTimes": 8357720,\n' +
    '        "screenshotsUrl": null,\n' +
    '        "description": null,\n' +
    '        "brief": "万种图书，满100减30，满300减100",\n' +
    '        "detailUrl": null,\n' +
    '        "appTypeId": 0\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';
export  default  JSON.parse(mockString)