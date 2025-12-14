// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = 'Gerasimov'
const baseHost = 'https://webdev-hw-api.vercel.app'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

export function getPosts({ token }) {
    return fetch(postsHost, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }

            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}

export function registerUser({ login, password, name, imageUrl }) {
    return fetch(baseHost + '/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
            imageUrl,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Такой пользователь уже существует')
        }
        return response.json()
    })
}

export function loginUser({ login, password }) {
    return fetch(baseHost + '/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        return response.json()
    })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
    const data = new FormData()
    data.append('file', file)

    return fetch(baseHost + '/api/upload/image', {
        method: 'POST',
        body: data,
    }).then((response) => {
        return response.json()
    })
}

export function addPost({ token, description, imageUrl }) {
    const postData = {
        description: description.trim(),
        imageUrl: imageUrl.trim(),
    }

    return fetch(postsHost, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            Authorization: token,
        },
    }).then(async (response) => {
        console.log('Статус ответа:', response.status)

        if (response.status === 400) {
            const errorText = await response.text()
            throw new Error(errorText)
        }
        if (response.status === 401) {
            throw new Error('Нет авторизации')
        }
        if (response.status === 201) {
            return response.json()
        }
        throw new Error(`Неожиданный статус: ${response.status}`)
    })
}

export function getUserPosts({ token, userId }) {
    return fetch(`${postsHost}/user-posts/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error('Нет авторизации')
            }
            return response.json()
        })
        .then((data) => {
            return data.posts
        })
}
