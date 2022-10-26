const templateKey = 'CX2002030923534650064';
const domainLinks = uni.getSystemInfoSync().platform === 'devtools' ? 'https://open3.api.ddyy.top' :
	'https://api.ddyy.top'; //API后台地址，这个不用修改
/**
 * 通用ucdb
 */
function getUcDb() {
	return uniCloud.database();
}
function getDbCommand() {
	return getUcDb().command
}
function dateFormat(fmt, date) {
    let reg
    const ops = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString()
    }

    for (let op in ops) {
        reg = new RegExp("(" + op + ")").exec(fmt)
        if (reg) {
            fmt = fmt.replace(reg[1], reg[1].length <= 1 ? ops[op] : ops[op].padStart(2, '0'))
        }
    }
    return fmt
}
/**
 * 通用基础表查询
 */
async function baseQuery(query, orderBy = "", getOne = false, sort = "asc") {
	return await getUcDb().collection(query).where("del==" + Number(0)).orderBy(orderBy + " " + sort).get({
		getOne: getOne
	})
}
/**
 * 根据条件只查一条
 */
async function baseQueryOne(query, where1, where2) {
	return await getUcDb().collection(query).where(where1 + "==" + where2).get({
		getOne: true
	})
}
/**
 * 新增或者更新用户记录
 */
async function saveOrUpdate(query, user_number, where1) {
	const res = await baseQueryOne(query, where1, user_number)
	if (res.result?.data) {
		return await getUcDb().collection(query).where(where1 + "==" + user_number).update({
			user_number: Number(user_number)
		})
	} else {
		return await getUcDb().collection(query).add({
			user_number: Number(user_number),
			invote: false
		})
	}
}
async function saveOrUpdateUser(query, user_number, where1) {
	const res = await baseQueryOne(query, where1, user_number)
	if (res.result?.data) {
		return await getUcDb().collection(query).where(getDbCommand().and({
			user_number: Number(user_number)
		})).update({
			user_number: Number(user_number)
		})
	} else {
		return await getUcDb().collection(query).add({
			user_number: Number(user_number),
			invote: false
		})
	}
}
/**
 * 关联表联合查询规范
 * @param {Object} parentQuery 父表
 * @param {Object} subQuery 子表
 * @param {Object} query1 前置查询条件1
 * @param {Object} query2 后置查询条件2
 * @param {Object} result1 返回结果集1
 * @param {Object} result2 返回结果集2
 */
async function uninoSelect(parentQuery, subQuery, query1, query2, result1, result2) {
	const resultCollection1 = getUcDb().collection(parentQuery).where(query1 + "==" + query2 + "&&" + "del==" + Number(0)).getTemp()
	const resultCollection2 = getUcDb().collection(subQuery).where("del==" + Number(0)).getTemp();
	let res = await getUcDb().collection(resultCollection1, resultCollection2).field(result1 + "," + result2).get()
	return res
}

function serverGet(name, data) {
	let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__yipinUserInfo').token;
		let headers = {
			// 'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if (token) {
			headers.authorization = token;
		}
		let postData = data;

		// uni.request({
		// 	url: domainLinks + url,
		// 	data: postData,
		// 	method: 'GET',
		// 	header: headers,
		// 	success: function(res) {
		// 		resolve(res.data);
		// 	}
		// })
		uniCloud.callFunction({
			name: name,
			data: postData,
			success(res) {
				resolve(res)
			}
		})
	});
	return promise;
}

function serverPost(url, data) {
	let promise = new Promise((resolve) => {
		let token = uni.getStorageSync('__yipinUserInfo').token;
		let headers = {
			// 'template-key': templateKey, //模版服务码
			// 'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
		};
		if (token) {
			headers.authorization = token;
		}
		let postData = data;
		uni.request({
			url: domainLinks + url,
			data: postData,
			method: 'POST',
			header: headers,
			success: function(res) {
				resolve(res.data);
			}
		})
	});
	return promise;
}

function templateConfig() {
	let promise = new Promise((resolve) => {
		const res = baseQuery("bigmouth_template");
		resolve(res)
	});
	return promise;
}
function getShopInfo() {
	let promise = new Promise((resolve) => {
		const res = baseQuery("bigmouth_shopinfo");
		resolve(res)
	});
	return promise;
}

module.exports = {
	get: serverGet,
	post: serverPost,
	config: templateConfig,
	getUcDb: getUcDb,
	dbCmd: getDbCommand,
	dateFormat: dateFormat,
	uninoSelect: uninoSelect,
	baseQuery: baseQuery,
	baseQueryOne: baseQueryOne,
	saveOrUpdate: saveOrUpdate,
	saveOrUpdateUser: saveOrUpdateUser,
	getShopInfo: getShopInfo
}
