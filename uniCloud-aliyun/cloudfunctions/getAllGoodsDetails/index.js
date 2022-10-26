'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const res = await db.collection("bigmouth_goods_details").groupBy("fk_goods_id").orderBy("fk_goods_id" + " desc").get()
	console.info(res)
};
