import Request from "static/utils/request.js"

const db = Request.getUcDb()
const dbCmd = Request.dbCmd()


async function queryGoodsDetails(query, catalogId) {
	return await db.collection(query).orderBy("goods_details_id asc").where(dbCmd.and({
		del: 0,
		fk_goods_id: catalogId
	})).get()
}

async function addGoodsDetails(query, {
	goods_details_id,
	fk_goods_id,
	pic,
	title,
	introduce,
	mini_price,
}) {
	return await db.collection(query).add({
		goods_details_id: goods_details_id,
		fk_goods_id: fk_goods_id,
		pic: pic,
		recom_status: false,
		stock_number: 999,
		title: title,
		introduce: introduce,
		mini_price: mini_price,
		specs_status: false,
		del: 0
	})
}

async function updateGoodsDetails(query, {
	id,
	fk_goods_id,
	pic,
	title,
	introduce,
	mini_price,
	del = 0
}) {
	return await db.collection(query).where(Request.dbCmd().and({
		goods_details_id: Number(id)
	})).update({
		fk_goods_id: fk_goods_id,
		pic: pic,
		title: title,
		introduce: introduce,
		mini_price: mini_price,
		del: del
	})
}

async function deleteGoodsDetails(query, id) {
	return await db.collection(query).where(Request.dbCmd().add({
		goods_id: Number(id)
	})).remove()
}


module.exports = {
	queryGoodsDetails: queryGoodsDetails,
	updateGoodsDetails: updateGoodsDetails,
	addGoodsDetails: addGoodsDetails,
	deleteGoodsDetails: deleteGoodsDetails
}
