export function saveUserToLocalStorage(user) {
    window.localStorage.setItem('user', JSON.stringify(user))
}

// eslint-disable-next-line no-unused-vars
export function getUserFromLocalStorage(user) {
    try {
        return JSON.parse(window.localStorage.getItem('user'))
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        return null
    }
}

// eslint-disable-next-line no-unused-vars
export function removeUserFromLocalStorage(user) {
    window.localStorage.removeItem('user')
}
