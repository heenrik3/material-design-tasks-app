import { MDCRipple } from './node_modules/@material/ripple'
import { MDCDialog } from './node_modules/@material/dialog'
import { MDCTextField } from './node_modules/@material/textfield'
import { MDCLinearProgress } from './node_modules/@material/linear-progress'

const DOMstrings = {
  body: 'body',
  fab: '.mdc-fab',
  todo_list: '.todo-list',
  progress: '.mdc-linear-progress',
}
const to_dos = []
const elements = {}

function renderDialog(el) {
  const markup = `<div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div
            class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content"
          >
            <div class="mdc-dialog__content" id="my-dialog-content">
              Excluir tarefa?
            </div>
            <div class="mdc-dialog__actions">
              <button
                type="button"
                class="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="cancel"
              >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancelar</span>
              </button>
              <button
                type="button"
                class="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="discard"
              >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Excluir</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>`

  // INSERT DIALOG STRUCTURE ON THE HTML
  document.querySelector('body').insertAdjacentHTML('beforeend', markup)

  // INSTATIATE A NEW DIALOG AND OPEN IT
  const dialogEl = document.querySelector('.mdc-dialog')

  const dialog = new MDCDialog(dialogEl)

  dialog.open()

  dialog.listen('MDCDialog:closing', (e) => {
    // IF USER WANTS TO DELETE THE TODO
    if (e.detail.action === 'discard') {
      // GETS ITS POSITION ON LIST
      const index = Array.prototype.indexOf.call(
        elements.todo_list.children,
        el
      )

      // DELETE IT FROM ARRAY
      to_dos.splice(index, 1)

      // REMOVE IT FROM SCREEN
      elements.todo_list.removeChild(el)
    }

    // REMOVE IT FROM HTML AFTER A SMALL DELAY
    setTimeout(() => {
      document.querySelector('body').removeChild(dialogEl)
    }, 500)
  })
}

function updateTodoList() {
  const list_size = to_dos.length - 1

  const markup = `<div class="mdc-card">
      <div class="mdc-card-content">
        <h2 class="mdc-card__title">${to_dos[list_size].title}</h2>
        <span class="mdc-card__description">${to_dos[list_size].description}</span>
      </div>
      <div class="mdc-card__actions">
                  <button
                    class="mdc-button mdc-card__action mdc-card__action--button"
                    id="action-discard"
                  >
                    <div class="mdc-button__ripple"></div>
                    <span class="mdc-button__label">Excluir</span>
                  </button>
                </div>
              </div>
    </div>`

  elements.todo_list.insertAdjacentHTML('beforeend', markup)
}

function hideModal() {
  const modal = elements.body.querySelector('.modal')

  elements.body.removeChild(modal)
}

function renderModal() {
  const markup = `
    <div class="modal">
      <div class="mdc-card">
        <div class="modal__content">
          <div class="text-field__container">
            <span class="text-field__title">Título</span>
            <label class="mdc-text-field mdc-text-field--filled">
              <span class="mdc-text-field__ripple"></span>
              <span class="mdc-floating-label" id="my-label-id"></span>
              <input
                class="mdc-text-field__input text-field__title"
                type="text"
                aria-labelledby="my-label-id"
              />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>

          <div class="text-field__container">
            <span class="text-field__title">Descrição</span>
            <label
              class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label"
            >
              <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__trailing"></span>
              </span>
              <span class="mdc-text-field__resizer">
                <textarea
                  class="mdc-text-field__input text-field__description"
                  rows="8"
                  cols="40"
                  aria-label="Label"
                ></textarea>
              </span>
            </label>
          </div>
        </div>

        <div class="mdc-card__actions">
          <button
            class="mdc-button mdc-card__action mdc-card__action--button"
            id="action-create"
          >
            <div class="mdc-button__ripple"></div>
            <span class="mdc-button__label">criar</span>
          </button>
        </div>
      </div>
      <div class="modal__background"></div>
    </div>
    `

  elements.body.insertAdjacentHTML('beforeend', markup)

  const inputFiels = document.querySelectorAll('.mdc-text-field')
  const textField = []

  for (var i = 0; i < inputFiels.length; i++) {
    textField.push(new MDCTextField(inputFiels[i]))
  }

  const modal = elements.body.querySelector('.modal')

  modal.querySelector('.mdc-card').addEventListener('click', (e) => {
    const btn = e.target.closest('.mdc-button')
    if (!btn) return

    const title = textField[0].value
    const description = textField[1].value

    if (title && description) {
      to_dos.push({ title: title, description: description })

      elements.progress.classList.remove('hidden')
      elements.progress.classList.add('visible')
      elements.progress.classList.add('mdc-linear-progress--indeterminate')

      setTimeout(function () {
        elements.progress.classList.remove('mdc-linear-progress--indeterminate')

        setTimeout(() => {
          elements.progress.classList.remove('visible')
          elements.progress.classList.add('hidden')
        }, 100)

        updateTodoList()
      }, 1000)
    }

    hideModal()
  })

  modal.querySelector('.modal__background').addEventListener('click', (e) => {
    hideModal()
  })
}

function start() {
  const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action'
  const ripples = [].map.call(document.querySelectorAll(selector), function (
    el
  ) {
    return new MDCRipple(el)
  })

  // GETS ALL THE UI ELEMENTS
  for (let [key, value] of Object.entries(DOMstrings)) {
    elements[key] = document.querySelector(value)
  }

  // ADDS LISTENER FOR CLICKS ON TODO LIST
  elements.todo_list.addEventListener('click', (e) => {
    // IF USER CLICKS ON DELETE BUTTON
    const el = e.target.closest('.mdc-button')
    if (!el) return

    // GETS ITS CARD ELEMENT
    const parentElement = el.parentNode.parentNode

    // PASS ITS CARD TO RENDER DIALOG, IF USER CONFIRMS
    // IT WILL DELETED
    renderDialog(parentElement)
  })

  elements.fab.addEventListener('click', (e) => {
    renderModal()
  })

  const fabRipple = new MDCRipple(elements.fab)
  const linearProgress = new MDCLinearProgress(elements.progress)
}

start()
