/**

*检查登录状态

*一些中间件可以帮助我们确保用户经过身份验证。

*/

// TODO:  验证登录状态
/**
 *检查登录状态
 *一些中间件可以帮助我们确保用户经过身份验证。
 */
import router from '../router'
import store from '../store'

export default Vue => {
    // Authorize (Make sure that is the first hook.)
    router.beforeHooks.unshift((to, from, next) => {
        // 不需要权限的直接跳转
        if (!to.meta.requireAuth) return next()

        // 验证登录状态
        store.dispatch('checkToken')
            .then(valid => {
                // authorized

                console.log(valid)
                if (valid) {
                    store.dispatch('getUserPermissions').then(res => {
                        const { memusMap } = res
                        if (memusMap.Courses && to.name === 'Home') {
                            return next()
                        } else if (memusMap[to.name]) {
                            return next()
                        } else if (Object.keys(memusMap).length > 0) {
                            return next({ name: memusMap[Object.keys(memusMap)[0]].name })
                        } else {
                            next({ name: 'PermissionDenied' })
                        }
                    })
                    return next()
                }
                // 未通过验证则跳转到登录页面
                // console.log('Unauthorized')
                next({ name: 'Login', query: { redirect: to.fullPath } })
            })
    })

    // // login page visiable
    router.beforeEach((to, from, next) => {
        if (to.name !== 'Login') return next()
            // check login state
        store.dispatch('checkToken')
            .then(valid => {
                if (!valid) return next()
                    // when logged in
                console.log('Authorized')
                next({ path: to.query.redirect || '/' })
            })
    })
}