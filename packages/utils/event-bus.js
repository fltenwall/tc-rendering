export default class EventBus {
    _observer = {}
    
    eventName = 'event'
    constructor(eventName) {
        this.eventName = eventName || this.eventName
    }
    subscribe(event, callback) {
        if (Object.prototype.toString.call(callback) !== '[object Function]') return
        if (!this._observer[event]) this._observer[event] = []
        this._observer[event].push(callback)
        return this
    }

    publish(e) {
        let event = e[this.eventName]
        let subscribes = this._observer[event]
        if (!subscribes || !subscribes.length) {
            console.warn('unsubscribe action or no actions in observer, please check out')
            return
        }

        subscribes.forEach(callback => callback(e))
        return this
    }

    unsubscribe(event, callback) {
        if (!this._observer[event] || !this._observer[event].length) return
        let subscribes = this._observer[event]

        subscribes.some((item, index, arr) => {
            if (item === callback) {
                arr.splice(index, 1)
                return true
            }
        })
        return this
    }
    clearEvents(event) {
        if (!this._observer[event] || !this._observer[event].length) return
        this._observer[event] = []
    }
}