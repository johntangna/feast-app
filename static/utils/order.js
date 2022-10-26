import Request from "static/utils/request.js"

const db = Request.getUcDb()

async function addOrder(query, fk_user_number, order_remark, order_details, update = false) {
	const id = new Date().getTime();
	if (update) {
		return await db.collection(query).where(Request.dbCmd().and({
			create_time: Request.dateFormat("YYYY-mm-dd", new Date()),
			fk_user_number: Number(fk_user_number)
		})).update({
			order_id: Number(id),
			order_remark: order_remark,
			time: new Date().getTime(),
			order_details: order_details
		})
	} else {
		return await db.collection(query).add({
			order_id: Number(id),
			fk_user_number: Number(fk_user_number),
			order_status: 1,
			delivery_type: 1,
			order_remark: order_remark,
			time: new Date().getTime(),
			create_time: Request.dateFormat("YYYY-mm-dd", new Date()),
			order_details: order_details
		})
	}

}

async function queryOrder(query, fk_user_number) {
	return await db.collection(query).where("fk_user_number == " + fk_user_number).orderBy("time desc").limit(30)
		.get()
}

async function queryOrderById(query, order_id) {
	return await db.collection(query).where("order_id == " + Number(order_id)).get()
}

module.exports = {
	addOrder: addOrder,
	allOrder: queryOrder,
	queryOrderById: queryOrderById
}
