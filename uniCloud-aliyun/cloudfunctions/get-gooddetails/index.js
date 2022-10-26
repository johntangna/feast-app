'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const goodsArr = new Array();
	const data = await db.collection("bigmouth_goods").orderBy('goods_id').get()
	data.data.forEach(async (item) => {
		const goods = await db.collection("bigmouth_goods").where({
			goods_id:  item.goods_id
		}).get()
		console.log(goods)
		const goodsDetails = await db.collection("bigmouth_goods_details").get();
		let res = await db.collection(goods, goodsDetails).field("title, goods").get()
		goodsArr.push(res.data)
	})
	return goodsArr
};
