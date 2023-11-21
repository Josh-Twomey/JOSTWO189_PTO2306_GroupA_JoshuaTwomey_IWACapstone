import { BOOKS_PER_PAGE ,authors, genres, books } from "../JS/data.js";

let page = 1;
let range = [0,36];
if (!books && !Array.isArray(books)) throw new Error("Source required");
if (!range && range.length < 2) throw new Error("Range must be an array with two numbers");
const showMore = document.querySelector("[data-list-button]");
const updateButtonText = (number) => {
  showMore.innerHTML = /* html */ [
    `<span>Show more</span>
     <span class="list__remaining">(${number - (BOOKS_PER_PAGE * page)})</span>`,
  ];
  showMore.disabled = !(books.length - [page * BOOKS_PER_PAGE] > 0);
};

const createDisplay = (array) => {
  document.querySelector("[data-list-items]").innerHTML = "";
  const fragment = document.createDocumentFragment();
  let extracted = []
  updateButtonText(array.length);
  if (array.length > 36) {
   extracted = array.slice(range[0], range[1]);
  } else {
   extracted = array.slice(range[0],array.length) 
  }
  const createPreview = (bookDetails) => {
    const { id, title, author, image } = bookDetails;
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />

            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
            </div>
        `;

    return element;
  };

  for (let i = 0; i < extracted.length; i++) {
    const preview = createPreview({
      author: authors[extracted[i].author],
      id: extracted[i].id,
      image: extracted[i].image,
      title: extracted[i].title,
    });

    fragment.appendChild(preview);
  }

  const bookDisplay = document.querySelector("[data-list-items]");
  bookDisplay.appendChild(fragment);
  
};

createDisplay(books);




const showMoreBooks = (event) => {
  page = page + 1;
  const amountToDisplay = BOOKS_PER_PAGE * page
  range.pop()
  range.push(amountToDisplay)
  createDisplay(books)
}

showMore.addEventListener('click', showMoreBooks)
 


// Needed?
// document.querySelector('[data-list-button]').innerHTML = 


// EventListener?
// data-list-close.click() { data-list-active.open === false }

const searchOpen = document.querySelector("[data-header-search]");
const searchCancel = document.querySelector("[data-search-cancel]");
const searchSave = document.querySelector("[data-search-form]");
const searchOverlay = document.querySelector("[data-search-overlay]");

const searchOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    searchOverlay.open = false;
    searchSave.reset()
  } else if (
    event.target.innerHTML !== "Cancel" &&
    event.target.innerHTML !== "Search"
  ) {
    searchOverlay.open = true;
    document.querySelector('[data-search-title]').focus();

    const genresFragment = document.createDocumentFragment();
    const allGenresOption = document.createElement("option");
    allGenresOption.value = "any";
    allGenresOption.textContent = "All Genres";
    genresFragment.appendChild(allGenresOption);

    for (const genreKey of Object.keys(genres)) {
      const genre = genres[genreKey]; // Access the genre value using its key
      const genreOption = document.createElement("option");
      genreOption.value = genreKey; // Set the option value to the genre key
      genreOption.textContent = genre; // Set the option text to the genre value
      genresFragment.appendChild(genreOption);
    }

    document.querySelector("[data-search-genres]").appendChild(genresFragment);
    
    const authorsFragment = document.createDocumentFragment();
    const allAuthorsOption = document.createElement("option");
    allAuthorsOption.value = "any";
    allAuthorsOption.textContent = "All Authors";
    authorsFragment.appendChild(allAuthorsOption);

    for (const authorKey of Object.keys(authors)) {
      const author = authors[authorKey]; // Access the author value using its key
      const authorOption = document.createElement("option");
      authorOption.value = authorKey; // Set the option value to the author key
      authorOption.textContent = author; // Set the option text to the author value
      authorsFragment.appendChild(authorOption);
    }

    document.querySelector("[data-search-authors]").appendChild(authorsFragment);
  }
};


    const searchOverlaySubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { author, genre, title} = Object.fromEntries(formData)
    const result = []
    let counter = 0;
    title ? counter++ : "";
    author !== "any" ? counter++ : "";
    genre !== "any" ? counter++ : "";
    
    if (counter !== 0 ) {
    for (let i = 0; i < books.length; i++) {
        let titleMatch = false;
        if (title !== "") {
          titleMatch = books[i].title
            .toLocaleLowerCase()
            .includes(title.trim().toLocaleLowerCase());
        }
        let authorMatch = books[i].author === author;
        let genreMatch = false;
        for (let j = 0; j < books[i].genres.length; j++) {
          if (books[i].genres[j] === genre) {
            genreMatch = true;
          }
        }
      
      const checkAll3 = authorMatch && genreMatch && titleMatch;
      const check2 =
        (authorMatch && (genreMatch || titleMatch)) ||
        (genreMatch && titleMatch);
      const check1 = genreMatch || authorMatch || titleMatch;

      if (counter === 3) {
        checkAll3 ? result.push(books[i]) : '';
      } else if (counter === 2) {
        check2 ? result.push(books[i]) : '';
      } else if (counter === 1) {
        check1 ? result.push(books[i]) : '';
      }
    }
    createDisplay(result); 
}
    searchOverlay.open = false;
}


searchOpen.addEventListener("click", searchOverlayToggle);
searchCancel.addEventListener("click", searchOverlayToggle);
searchSave.addEventListener("submit", searchOverlaySubmit);



    
    // if (display.length < 1){
    //     document.querySelector('[data-list-message]').class.add('list__message_show')}
    // else {
    //     document.querySelector('[data-list-message]').class.remove('list__message_show')}


    
    



//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

/* Selects specific elements from the DOM using data attributes and assigns them to 
  variables for further use.*/
const settingOpen = document.querySelector('[data-header-settings]')
const settingCancel = document.querySelector('[data-settings-cancel]');
const settingSave = document.querySelector("[data-settings-form]");
const settingOverlay = document.querySelector("[data-settings-overlay]");

// Code to toggle the setting overlay
const settingOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    settingOverlay.open = false;
  } else if (event.target.innerHTML !== "Cancel" && event.target.innerHTML !== "Save"){
    settingOverlay.open = true;
  };
}

const settingOverlaySubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const {theme} = Object.fromEntries(formData);
  const matches = theme === "night";
  const root = document.documentElement;

  if (matches) {
    root.style.setProperty("--color-dark", "255, 255, 255");
    root.style.setProperty("--color-light", "10, 10, 20");
  } else {
    root.style.setProperty("--color-dark", "10, 10, 20");
    root.style.setProperty("--color-light", "255, 255, 255");
  }
  settingOverlay.open=false
};

settingOpen.addEventListener("click", settingOverlayToggle);
settingCancel.addEventListener("click", settingOverlayToggle);
settingSave.addEventListener("submit", settingOverlaySubmit);


 
// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if (active) break;
//         const previewId = node?.dataset?.preview

//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         }
//     }

//     if (!active) return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title

//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }
