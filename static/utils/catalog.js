import Request from "static/utils/request.js"

const db = Request.getUcDb()
async function queryCatalog(query) {
	return await db.collection(query).orderBy("goods_id asc").where("del == 0").get()
}

async function addCatalog(query, 
	id,
	title
) {
	return await db.collection(query).add({
		goods_id: id,
		title: title,
		del: 0
	})
}

async function updateCatalog(query, id, title, del = 0) {
	return await db.collection(query).where(Request.dbCmd().and({
		goods_id: Number(id)
	})).update({
		title: title,
		del: del
	})
}

async function deleteCatalog(query, id) {
	return await db.collection(query).where(Request.dbCmd().add({
		goods_id: Number(id)
	})).remove()
}


module.exports = {
	queryCatalog: queryCatalog,
	updateCatalog: updateCatalog,
	addCatalog: addCatalog,
	deleteCatalog: deleteCatalog
}
