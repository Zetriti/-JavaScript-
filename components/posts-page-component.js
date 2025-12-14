import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage } from '../index.js'

export function renderPostsPageComponent({ appEl }) {
    // @TODO: реализовать рендер постов из api
    console.log('Актуальный список постов:', posts)

    /**
     * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)
        const diffWeek = Math.floor(diffDay / 7)
        const diffMonth = Math.floor(diffDay / 30)
        const diffYear = Math.floor(diffDay / 365)

        if (diffMin < 1) return 'только что'
        if (diffMin < 60)
            return `${diffMin} минут${getWordEnding(diffMin, ['у', 'ы', ''])} назад`
        if (diffHour < 24)
            return `${diffHour} час${getWordEnding(diffHour, ['', 'а', 'ов'])} назад`
        if (diffDay < 7)
            return `${diffDay} день${getWordEnding(diffDay, ['', 'я', 'ей'])} назад`
        if (diffWeek < 4)
            return `${diffWeek} недел${getWordEnding(diffWeek, [
                'ю',
                'и',
                'ь',
            ])} назад`
        if (diffMonth < 12)
            return `${diffMonth} месяц${getWordEnding(diffMonth, [
                '',
                'а',
                'ев',
            ])} назад`
        return `${diffYear} год${getWordEnding(diffYear, ['', 'а', 'ов'])} назад`
    }

    const getWordEnding = (number, endings) => {
        const cases = [2, 0, 1, 1, 1, 2]
        return endings[
            number % 100 > 4 && number % 100 < 20
                ? 2
                : cases[Math.min(number % 10, 5)]
        ]
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
          <img src="./assets/images/${
              post.isLiked ? 'like-active' : 'like-not-active'
          }.svg">
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
}
