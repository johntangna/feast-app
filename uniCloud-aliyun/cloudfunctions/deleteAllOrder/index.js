'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	//返回数据给客户端
	return await db.collection("bigmouth_order").where({
		_id: dbCmd.neq(null)
	}).remove()
};
