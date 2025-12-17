import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function updatePostsAfterLike(postsArray, updatedPost) {
    return postsArray.map((post) =>
        post.id === updatedPost.id ? updatedPost : post,
    )
}

export function formatDate(dateString) {
    return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ru,
    })
}

export function sanitizeInput(input) {
    if (typeof input !== 'string') return input

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&#34;')
        .replace(/\//g, '&#x2F;')
}
