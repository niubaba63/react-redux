// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants
/**
 * 封装订阅逻辑 用于组件连接 redux store ，以及嵌套订阅的后代组件，以便我们可以确保
 * 祖先组件在后代之前重绘 re-render
 * 这里是用一个典型的订阅发布模式，通过对store或父级subscription进行监听，来进行组件的更新(onStateChange)。
 * https://segmentfault.com/a/1190000007956140
 */
const CLEARED = null
const nullListeners = {
    notify() {
    }
}

function createListenerCollection() {
    // the current/next pattern is copied from redux's createStore code.
    // TODO: refactor+expose that code to be reusable here?
    let current = []
    let next = []

    return {
        clear() {
            next = CLEARED
            current = CLEARED
        },

        notify() {
            const listeners = current = next
            for (let i = 0; i < listeners.length; i++) {
                listeners[i]()
            }
        },

        subscribe(listener) {
            let isSubscribed = true
            if (next === current) next = current.slice()
            next.push(listener)

            return function unsubscribe() {
                if (!isSubscribed || current === CLEARED) return
                isSubscribed = false

                if (next === current) next = current.slice()
                next.splice(next.indexOf(listener), 1)
            }
        }
    }
}

export default class Subscription {
    constructor(store, parentSub, onStateChange) {
        this.store = store
        this.parentSub = parentSub
        this.onStateChange = onStateChange
        this.unsubscribe = null
        this.listeners = nullListeners
    }

    addNestedSub(listener) {
        this.trySubscribe()
        return this.listeners.subscribe(listener)
    }

    notifyNestedSubs() {
        this.listeners.notify()
    }

    isSubscribed() {
        return Boolean(this.unsubscribe)
    }

    trySubscribe() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.parentSub
                ? this.parentSub.addNestedSub(this.onStateChange)
                : this.store.subscribe(this.onStateChange)

            this.listeners = createListenerCollection()
        }
    }

    tryUnsubscribe() {
        if (this.unsubscribe) {
            this.unsubscribe()
            this.unsubscribe = null
            this.listeners.clear()
            this.listeners = nullListeners
        }
    }
}
