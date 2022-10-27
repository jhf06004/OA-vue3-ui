// 导入svg下所有的svg文件
const req = import.meta.globEager("../../icons/svg/*.svg")
const modules = {}
// 去除相对路由../../
for (const key in req) {
    modules[(key.split('../../icons/svg/'))[1]] = req[key].default
}
// 去除文件后缀名
const icons = Object.keys(modules).map(item => {
    return item.substring(0, item.lastIndexOf("."))
})

export default icons
