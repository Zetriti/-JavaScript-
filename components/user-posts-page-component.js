import { renderHeaderComponent } from './header-component'
import { posts, goToPage, likePost, dislikePost } from '../index'
import { POSTS_PAGE } from '../routes'
import { formatDate, sanitizeInput } from './utils'

export function renderUserPostsPageComponent({ appEl }) {
    console.log('Посты пользователя:', posts)

    if (posts.length === 0) {
        const appHtml = `
            <div class="page-container">
                <div class="header-container"></div>
                <div class="loading-page">
                    <div class="loader"><div></div><div></div><div></div></div>
                </div>
            </div>
        `
        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })
        return
    }

    const user = posts[0].user

    const handleLikeClick = (postId, isLiked) => {
        if (!window.user) {
            alert('Чтобы поставить лайк, нужно авторизоваться')
            return
        }

        const token = `Bearer ${window.user.token}`

        const apiCall = isLiked ? dislikePost : likePost

        apiCall({ token, postId })
            .then((updatedPost) => {
                const postIndex = posts.findIndex((p) => p.id === postId)
                if (postIndex !== -1) {
                    posts[postIndex] = updatedPost
                }

                renderUserPostsPageComponent({ appEl })
            })
            .catch((error) => {
                console.error('Ошибка при обработке лайка:', error)
                alert('Не удалось обновить лайк. Попробуйте еще раз.')
            })
    }

    const postsHtml = posts
        .map(
            (post) => `
                <li class="post">
                    <div class="post-header">
                        <img src="${post.user.imageUrl}" class="post-header__user-image" alt="${sanitizeInput(post.user.name)}">
                        <p class="post-header__user-name">${sanitizeInput(post.user.name)}</p>
                    </div>
                    <div class="post-image-container">
                        <img class="post-image" src="${post.imageUrl}" alt="Пост пользователя ${sanitizeInput(post.user.name)}">
                    </div>
                    <div class="post-likes">
                        <button data-post-id="${post.id}" class="like-button">
                            <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg">
                        </button>
                        <p class="post-likes-text">
                            Нравится: <strong>${post.likes.length}</strong>
                        </p>
                    </div>
                    <p class="post-text">
                        ${sanitizeInput(post.user.name)}
                        ${sanitizeInput(post.description)}
                    </p>
                    <p class="post-date">
                        ${formatDate(post.createdAt)}
                    </p>
                </li>
            `,
        )
        .join('')

    const appHtml = `
        <div class="page-container">
            <div class="header-container"></div>
            <div class="posts-user-header">
                <img src="${user.imageUrl}" class="posts-user-header__user-image">
                <p class="posts-user-header__user-name">${sanitizeInput(user.name)}</p>
            </div>
            <ul class="posts">
                ${postsHtml}
            </ul>
        </div>
    `

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    document.querySelector('.logo').addEventListener('click', () => {
        goToPage(POSTS_PAGE)
    })
    for (let likeButton of document.querySelectorAll('.like-button')) {
        const postId = likeButton.dataset.postId
        const post = posts.find((p) => p.id === postId)

        likeButton.addEventListener('click', () => {
            handleLikeClick(postId, post.isLiked)
        })
    }
}
