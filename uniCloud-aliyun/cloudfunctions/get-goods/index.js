'use strict';
exports.main = async (event, context) => {
	return uniCloud.database().collection("bigmouth_goods").get()
};
