import Request from "static/utils/request.js"

const db = Request.getUcDb()

async function getAllGoods(query, orderBy) {
	return await db.collection(query).orderBy(orderBy + " asc").get()
}


module.exports = {
	getAllGoods: getAllGoods
}
