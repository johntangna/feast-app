import Request from "../request.js"

const db = Request.getUcDb()

async function getInvote(query) {
	return await db.collection(query).orderBy("invote_number desc").get()
}

module.exports = {
	getInvote: getInvote
}