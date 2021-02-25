import { TokenService, UserService } from '../services'
import {
    CHANGE_TITLE,
    CHANGE_SESSION,
    TOGGLE_SIDEBAR_COLLAPSE,
    CHANGE_BREADCRUMBS,
    CHANGE_SIDERBAR_MENU
} from './mutation-types'

/**
 * @type {import('vuex/types').ActionTree<typeof import('./state').default>}
 */
const actions = {
    /**
     * 改变页面标题
     */
    changeTitle: ({ commit }, title) => {
        commit(CHANGE_TITLE, title)
    },

    /**
     * 创建新的客户端令牌
     */
    createToken: async({ commit }, { username, password }) => {
        const res = await TokenService.userLogin({
            phone: username.trim(),
            password: password.trim()
        })
        if (res.state !== 1) {
            return Promise.resolve(res)
        }
        const result = JSON.parse(res.content)
        commit(CHANGE_SESSION, { accessToken: result.access_token, refreshToken: result.refresh_token })
        return res
    },

    /**
     * 检查客户端令牌是否可用
     */
    checkToken: async({ commit, getters }) => {
        // validate local store
        if (!getters.session.accessToken) {
            return Promise.resolve(false)
        }

        return Promise.resolve(true)
            // remote
            // try {
            //   await TokenService.get()
            //   return true
            // } catch (err) {
            //   console.error(err)
            //   commit(CHANGE_SESSION, { accessToken: null, refreshToken: null })
            //   return false
            // }
    },

    /**
     * 删除客户端令牌
     */
    deleteToken: async({ commit, getters }) => {
        // await TokenService.delete(getters.session.accessToken)
        commit(CHANGE_SESSION, { accessToken: null, refreshToken: null })
        await Promise.resolve()
    },

    /**
     * 获取当前登录用户信息
     */
    getCurrentUser: async({ commit }) => {
        const res = await UserService.getUserInfo()
        commit(CHANGE_SESSION, { user: res.content })
        return res.data
    },

    /**
     * 获取当前登录用户权限
     */
    getUserPermissions: async({ commit }) => {
        const res = await UserService.getUserPermissions()
        const { menuList, resourceList } = res.content
        let menus = []
        const formatMenu = (treeData) => {
            if (treeData.length > 0) {
                return treeData.map(item => formatMenu(item))
            }
            const result = {}
            if (treeData.shown) {
                result.id = treeData.id
                result.text = treeData.name
                result.label = treeData.name
                result.name = treeData.href
                result.icon = treeData.icon
                result.shown = treeData.shown
            } else {
                return ''
            }

            if (treeData.subMenuList) {
                result.children = []
                treeData.subMenuList.forEach(item => {
                    formatMenu(item) && result.children.push(formatMenu(item))
                })
                if (result.children.length === 0) {
                    delete result.children
                }
            }
            return result
        }

        const memusMap = {}
        const splapMenu = (treeData) => {
            if (treeData.length > 0) {
                return treeData.map(item => splapMenu(item))
            }
            const result = {}
            result.id = treeData.id
            result.text = treeData.name
            result.label = treeData.name
            result.name = treeData.href
            result.icon = treeData.icon
            result.shown = treeData.shown
            result.name && (memusMap[result.name] = result)
            if (treeData.subMenuList) {
                result.children = []
                treeData.subMenuList.forEach(item => {
                    result.children.push(splapMenu(item))
                })
            }
            return result
        }

        splapMenu(menuList)

        menus = formatMenu(menuList)
        commit(CHANGE_SIDERBAR_MENU, menus)
        return { menus, resourceList, menuList, memusMap }
    },

    /**
     * 切换边栏的展开收起
     */
    toggleSidebarCollapse: ({ commit }) => {
        commit(TOGGLE_SIDEBAR_COLLAPSE)
    },

    /**
     * 修改面包屑导航
     */
    changeBreadcrumbs: ({ commit }, breadcrumbs) => {
        commit(CHANGE_BREADCRUMBS, breadcrumbs)
    },

    /**
     * 本地定时更新token
     */
    refreshToken: async({ commit, state }) => {
        const { refreshToken } = state.session
        const res = await TokenService.fetchUpdateToken(refreshToken)
        if (!res) {
            return Promise.resolve()
        }
        const result = JSON.parse(res.content)
        commit(CHANGE_SESSION, { accessToken: result.access_token, refreshToken: result.refresh_token })
        return Promise.resolve()
    }
}

export default actions