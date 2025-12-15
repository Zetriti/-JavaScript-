import './styles.css'
import './ui-kit.css'
import { getPosts, addPost, getUserPosts, likePost, dislikePost } from './api'
import { renderAddPostPageComponent } from './components/add-post-page-component'
import { renderAuthPageComponent } from './components/auth-page-component'
import { renderUserPostsPageComponent } from './components/user-posts-page-component'

import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes'
import { renderPostsPageComponent } from './components/posts-page-component'
import { renderLoadingPageComponent } from './components/loading-page-component'
import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
} from './helpers'

export let user = getUserFromLocalStorage()
window.user = user
export let page = null
export let posts = []

const getToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined
    return token
}

export const logout = () => {
    user = null
    window.user = null
    removeUserFromLocalStorage()
    goToPage(POSTS_PAGE)
}

export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage)
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE
            return renderApp()
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getPosts({ token: getToken() })
                .then((newPosts) => {
                    page = POSTS_PAGE
                    posts = newPosts
                    renderApp()
                })
                .catch((error) => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }

        if (newPage === USER_POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getUserPosts({
                token: getToken(),
                userId: data.userId,
            })
                .then((newPosts) => {
                    page = USER_POSTS_PAGE
                    posts = newPosts
                    renderApp()
                })
                .catch((error) => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }

        page = newPage
        renderApp()

        return
    }

    throw new Error('страницы не существует')
}

const renderApp = () => {
    const appEl = document.getElementById('app')
    if (page === LOADING_PAGE) {
        return renderLoadingPageComponent({
            appEl,
            user,
            goToPage,
        })
    }

    if (page === AUTH_PAGE) {
        return renderAuthPageComponent({
            appEl,
            setUser: (newUser) => {
                user = newUser
                window.user = newUser
                saveUserToLocalStorage(user)
                goToPage(POSTS_PAGE)
            },
            user,
            goToPage,
        })
    }

    if (page === ADD_POSTS_PAGE) {
        return renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
                addPost({
                    token: getToken(),
                    description,
                    imageUrl,
                })
                    .then((response) => {
                        console.log('Ответ от сервера:', response)
                        if (response.result === 'ok') {
                            return getPosts({ token: getToken() })
                        } else {
                            throw new Error('Ошибка при добавлении поста')
                        }
                    })
                    .then((newPosts) => {
                        posts = newPosts
                        goToPage(POSTS_PAGE)
                    })
                    .catch((error) => {
                        console.error('Ошибка при добавлении поста:', error)
                        const errorMessage =
                            error.message ||
                            'Ошибка при добавлении поста. Попробуйте еще раз.'
                        alert(errorMessage)
                        page = ADD_POSTS_PAGE
                        renderApp()
                    })
            },
        })
    }

    if (page === POSTS_PAGE) {
        return renderPostsPageComponent({
            appEl,
        })
    }

    if (page === USER_POSTS_PAGE) {
        return renderUserPostsPageComponent({
            appEl,
        })
    }
}
export { likePost, dislikePost }
goToPage(POSTS_PAGE)
