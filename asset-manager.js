import likeActive from './assets/images/like-active.svg'
import likeInactive from './assets/images/like-not-active.svg'

export function getLikeImagePath(isLiked) {
    return isLiked ? likeActive : likeInactive
}

export const LIKE_IMAGES = {
    ACTIVE: likeActive,
    INACTIVE: likeInactive,
}
