# 公司内部使用餐厅小程序-集成钉钉登录


* [后台维护页面（启动项目后缀加上此链接）](/pages/admin/index)

已经实现可以使用XML语法支持前端文件下载，下载格式为xml，该格式可以兼容打开excel

**由于安全性问题，一般都要配合后端api才行，但是此功能已经解决纯前端下载文件不安全的问题**

* [后台云开发管理地址#](https://unicloud.dcloud.net.cn/)



* 图片上传服务器

由于考虑到系统设计的复杂性，所以使用简单方案处理，如果想自己实现，可以根据情况，使用指定文件服务器拉取文件列表

[unicloud文件上传#](https://unicloud.dcloud.net.cn/cloud-storage?platform=aliyun&appid=)

* 数据库服务器

采用unicloud云数据库存储数据，改数据库为非关系型数据库，直接存取相关键值对

[云数据库#](https://unicloud.dcloud.net.cn/cloud-database?platform=aliyun&appid=)

__使用的库__
* bigmouth_goods 商品类目
* bigmouth_goods_details 商品表
* bigmouth_invote 投票表
* bigmouth_order 订单表 ps：订单详情字段也在此表中，没有使用详情关联表去做
* bigmouth_shopinfo 店铺信息
* bigmouth_template 模板通用
* bigmouth_userinfo 只用作记录用，本身已经集成钉钉，看情况使用

__未使用库__
* bigmouth_cart 购物车
* bigmouth_orderdetails 订单关联详情


## Thanks

该代码集成的效果，是基于此[源码库](https://github.com/WHaveFun/yipin.git)，由于是学习使用，谨表示感谢此源码库