module.exports = function () {
    this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve
        this.reject = reject
    }.bind(this))
    Object.freeze(this)
}