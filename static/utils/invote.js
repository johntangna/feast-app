import Request from "./request.js";
const db = Request.getUcDb();

async function queryAllInvote(query) {
	return await Request.baseQuery(query, "invote_number", false, "desc")
}

/**
 * 投票
 * @param {String} query 查询表明
 * @param {String} where1 条件1
 * @param {Number} goods_details_id 商品详情id
 * @param {String} invote_goods_name 商品详情名字
 * @param {Number} invote_number 投票数量
 */
async function addInvote(query, where1, goods_details_id, invote_goods_name, invote_number, invote_good_price, pic){
	const res = await Request.baseQueryOne(query, where1, goods_details_id)
	console.log(res)
	if (res.result?.data) {
		return await db.collection(query).where(where1 + "==" + goods_details_id).update({
			invote_number: Number(invote_number) + Number(res.result?.data.invote_number)
		})
	} else {
		return await db.collection(query).add({
			invote_goods_details_id: Number(goods_details_id),
			invote_goods_name: invote_goods_name,
			invote_number: Number(invote_number),
			invote_good_price: invote_good_price,
			invote_pic: pic,
			del: 0
		})
	}
}

module.exports = {
	addInvote: addInvote,
	allInvote: queryAllInvote
}