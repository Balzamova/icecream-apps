const button = document.querySelector('.btn-load');
const fileInput = document.getElementById('btnInput');
const editorBlock = document.querySelector('main');


const modalWindow = () => {
  return `
    <div class='modal__wrapper'>
      <div class="modal__window">
        <div class="modal__btn modal__close"></div>
        <div class="modal__title">Error</div>
        <div class="modal__subtitle">Please add not less than 2 and not more than 5 files.</div>
        <button class="modal__btn modal__button">ok</button>
      </div>
    </div>`;
}

const closeModalWindow = () => {
  const modal = document.querySelector('.modal__wrapper');
  editorBlock.removeChild(modal);
}

const listenClosing = () => {
  const closeBtns = document.querySelectorAll('.modal__btn');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModalWindow);
  });
}

const showModalWindow = () => {
  const modal = modalWindow();
  editorBlock.insertAdjacentHTML('afterbegin', modal);

  listenClosing();
}

const isValidFilesLength = (files) => {
  let isValid;
  (files.length >= 2 && files.length <= 5) ? isValid = true : isValid = false;
  return isValid;
}

const getNewCard = (url, file, id) => {
  return `
    <div class="preview__block" id="${id}" draggable="true" ondragstart="drag(event)">
      <img class='preview__img' src='${url}' alt='${file.name}'/>
      <div class="preview__name">${file.name}</div>
      <div class="preview__size">${file.size}kb</div>
    </div>
  `;
}

const loadFiles = (files) => {
  const previewContainer = document.querySelector('.preview__container');

  for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image')) continue;

      const reader = new FileReader();

      reader.addEventListener('load', function (event) {
      const url = event.target.result;
      const newImage = getNewCard(url, file, i);
      previewContainer.insertAdjacentHTML('beforeend', newImage);
    });

    reader.readAsDataURL(file);
  }
}

const removeButton = () => {
  button.parentElement.removeChild(button);
}

const addContainer = () => {
  editorBlock.insertAdjacentHTML('beforeend', `
    <div 
      class='preview__container' 
      ondrop="drop(event)" 
      ondragover="allowDrop(event)"
    ></div>
  `);
}

const checkId = (elem) => {
  if (elem.classList.contains('preview__img')
    || elem.classList.contains('preview__name')
    || elem.classList.contains('preview__size')) {
    return elem.parentElement.id;
  }

  return elem.id;
}

const isReplaceWithNext = (event) => {
  const items = document.querySelectorAll('.preview__block');

  const movingElemId = event.dataTransfer.getData("text");
  const currentElemId = checkId(event.target);

  let currentIndex;
  let movingIndex;
  let isNext;

  for (let i = 0; i < items.length; i++) {
    if (movingElemId === items[i].id) {
      movingIndex = i;
    }

    if (currentElemId === items[i].id) {
      currentIndex = i;
    }
  }

  currentIndex < movingIndex ? isNext = true : isNext = false;
  return isNext;
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  const id = checkId(event.target);
  event.dataTransfer.setData("text", id);
}

function drop(event) {
  event.preventDefault();

  const movingElemId = event.dataTransfer.getData("text");
  const currentElemId = checkId(event.target);

  const movingElem = document.getElementById(movingElemId);
  const currentElem = document.getElementById(currentElemId);

  if (!currentElem) return;

  if (isReplaceWithNext(event)) {
    currentElem.before(movingElem);
  } else {
    currentElem.after(movingElem);
  }
}

const loadHandler = () => {
  const files = fileInput.files;
  const isValid = isValidFilesLength(files);

  if (!isValid) {
    showModalWindow();
  } else {
    removeButton();
    addContainer();
    loadFiles(files);
  }
}

fileInput.addEventListener('change', loadHandler);