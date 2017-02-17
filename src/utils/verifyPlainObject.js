import isPlainObject from 'lodash/isPlainObject'
import warning from './warning'

//通过判断是否是plainObject，使用lodash来判断，并给个warning。这个方法主要是用在非production环境下，对数据格式进行检测，并抛出异常
export default function verifyPlainObject(value, displayName, methodName) {
    if (!isPlainObject(value)) {
        warning(
            `${methodName}() in ${displayName} must return a plain object. Instead received ${value}.`
        )
    }
}
