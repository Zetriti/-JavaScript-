import { USER_POSTS_PAGE } from '../routes'
import { renderHeaderComponent } from './header-component'
import { posts, goToPage, likePost, dislikePost } from '../index'
import { formatDate } from './utils'
import { getLikeImagePath } from '../asset-manager'

export function renderPostsPageComponent({ appEl }) {
    console.log('Актуальный список постов:', posts)
    if (posts.length === 0) {
        const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <p style="text-align: center; margin-top: 20px;">Пока нет постов</p>
      </div>
    `
        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })
        return
    }

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

                renderPostsPageComponent({ appEl })
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
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image" alt="${
            post.user.name
        }">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}" alt="Пост пользователя ${
            post.user.name
        }">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
          <img src="${getLikeImagePath(post.isLiked)}">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
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
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }

    for (let likeButton of document.querySelectorAll('.like-button')) {
        const postId = likeButton.dataset.postId
        const post = posts.find((p) => p.id === postId)

        likeButton.addEventListener('click', () => {
            handleLikeClick(postId, post.isLiked)
        })
    }
}
