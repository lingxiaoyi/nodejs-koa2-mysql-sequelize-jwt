const path = require('path')
const fs = require('fs')
function addMapping(router, mapping) {
    for (let url in mapping) {
        if (!mapping.hasOwnProperty(url)) continue
        if (url.startsWith('get ')) {
            let path = url.substring(4)
            router.get(path, mapping[url])
        } else if (url.startsWith('post ')) {
            let path = url.substring(5)
            router.post(path, mapping[url])
        } else if (url.startsWith('put ')) {
            let path = url.substring(4)
            router.put(path, mapping[url])
        } else if (url.startsWith('delete ')) {
            let path = url.substring(7)
            router.del(path, mapping[url])
        } else {
            console.log(`invalid URL: ${url}`)
        }
    }
}

function addControllers(router, dir) {
    fs.readdirSync(path.resolve(__dirname, dir)).filter((f) => {
        return f.endsWith('.js')
    }).forEach((f) => {
        let mapping = require(path.resolve(__dirname, `${dir}/${f}`))
        addMapping(router, mapping)
    })
}

module.exports = function(dir) {
    let controllers_dir = dir || '../controllers'
    let router = require('koa-router')()
    //let router = new Router()
    addControllers(router, controllers_dir)
    return router
}
