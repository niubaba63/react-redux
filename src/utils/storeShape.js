import {PropTypes} from 'react'
/**
 * 定义存储 store 属性模板
 */
export default PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
})
