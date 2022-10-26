function getAllFileList(){
	return uni.getSavedFileList({
		success(res) {
			console.info(res)
		}
	})
}

module.exports = {
	getAllFileList: getAllFileList
}