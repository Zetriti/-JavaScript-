import { renderHeaderComponent } from './header-component'
import { renderUploadImageComponent } from './upload-image-component'
import { sanitizeInput } from './utils'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    let imageUrl = ''
    let description = ''
    let isLoading = false

    const render = () => {
        const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <div class="form-error" id="image-error" style="color: red; display: none;"></div>
          <label>
            Опишите фотографию:
            <textarea 
              class="input textarea" 
              id="description-input" 
              placeholder="Введите описание фотографии..."
              rows="4"
              ${isLoading ? 'disabled' : ''}
            >${description}</textarea>
          </label>
          <div class="form-error" id="description-error" style="color: red; display: none;"></div>
          <button class="button" id="add-button" 
            ${isLoading || !imageUrl ? 'disabled="true"' : ''}>
            ${isLoading ? 'Публикую...' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  `

        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        )
        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: uploadImageContainer,
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                    const addButton = document.getElementById('add-button')
                    const imageError = document.getElementById('image-error')

                    if (newImageUrl) {
                        if (!isLoading) {
                            addButton.removeAttribute('disabled')
                        }
                        imageError.style.display = 'none'
                    } else {
                        addButton.setAttribute('disabled', 'true')
                    }
                },
            })
        }

        const descriptionInput = document.getElementById('description-input')
        descriptionInput?.addEventListener('input', () => {
            description = descriptionInput.value.trim()
            const descriptionError =
                document.getElementById('description-error')

            if (description.length > 0 && description.length < 3) {
                descriptionError.textContent =
                    'Описание должно содержать минимум 3 символа'
                descriptionError.style.display = 'block'
            } else {
                descriptionError.style.display = 'none'
            }
        })

        document.getElementById('add-button').addEventListener('click', () => {
            description = sanitizeInput(descriptionInput.value.trim())

            let hasError = false

            if (!imageUrl) {
                const imageError = document.getElementById('image-error')
                imageError.textContent = 'Выберите фотографию'
                imageError.style.display = 'block'
                hasError = true
            }

            if (!description || description.length < 3) {
                const descriptionError =
                    document.getElementById('description-error')
                descriptionError.textContent =
                    'Введите описание (минимум 3 символа)'
                descriptionError.style.display = 'block'
                hasError = true
            }

            if (!hasError) {
                isLoading = true
                render()

                onAddPostClick({
                    description,
                    imageUrl,
                })
            }
        })
    }

    render()
}
