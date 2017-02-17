import { Component, PropTypes, Children } from 'react'
import Subscription from '../utils/Subscription'
import storeShape from '../utils/storeShape'
import warning from '../utils/warning'

//警告直接修改 store
let didWarnAboutReceivingStore = false
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return
  }
  didWarnAboutReceivingStore = true

  warning(
    '<Provider> does not support changing `store` on the fly. ' +
    'It is most likely that you see this error because you updated to ' +
    'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
    'automatically. See https://github.com/reactjs/react-redux/releases/' +
    'tag/v2.0.0 for the migration instructions.'
  )
}

export default class Provider extends Component {
  //指定数据并要将数据传递下去的父组件要定义 childContextTypes 和 getChildContext() ；
  // 想要接收到数据的子组件 必须定义 contextTypes 来使用传递过来的 context
  //context中放入Redux的store，方便子组件获取
  getChildContext() {
    return { store: this.store, storeSubscription: null }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  render() {
    //返回props.children 中的第一个
    return Children.only(this.props.children)
  }
}
//如果不是生产环境 检查是否直接修改store 如果有给出警告
if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    const { store } = this
    const { store: nextStore } = nextProps

    if (store !== nextStore) {
      warnAboutReceivingStore()
    }
  }
}
//propTypes定义
Provider.propTypes = {
  store: storeShape.isRequired,  // store必须含有storeShape (subscribe, dispatch, getState)
  children: PropTypes.element.isRequired // children必须是一个React元素
}

//指定childContext的数据类型
Provider.childContextTypes = {
  store: storeShape.isRequired,
  storeSubscription: PropTypes.instanceOf(Subscription)
}
Provider.displayName = 'Provider'
