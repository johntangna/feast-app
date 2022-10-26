import Request from "static/utils/request.js"

const db = Request.getUcDb()
const dbCmd = Request.dbCmd()
async function queryOrder(query, time) {
	return await db.collection(query).where(dbCmd.and({
		create_time: String(time)
	})).get()
}

async function addOrder(query){
	
}

async function updateOrder(query) {
	
}

async function deleteOrder(query) {
	
}


module.exports = {
	queryOrder: queryOrder,
	updateOrder: updateOrder,
	addOrder: addOrder,
	deleteOrder: deleteOrder
}