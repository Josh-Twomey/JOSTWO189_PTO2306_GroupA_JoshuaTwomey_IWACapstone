import { BOOKS_PER_PAGE ,authors, genres, books } from "../JS/data.js";
const newArray = []
let result = []


for (const obj of books) {
  const newObject = { ...obj }; // Create a deep copy of the current object
  if (!newArray.some((item) => item.title === newObject.title)) {
    newArray.push(newObject);
  }
}


let page = 1;
let range = [0,36];
if (!books && !Array.isArray(books)) throw new Error("Source required");
if (!range && range.length < 2) throw new Error("Range must be an array with two numbers");
const showMore = document.querySelector("[data-list-button]");

const updateButtonText = (number) => {
  if ((number - (BOOKS_PER_PAGE * page) >= 0)) {
    showMore.innerHTML = /* html */ [
      `<span>Show more</span>
       <span class="list__remaining">(${number - (BOOKS_PER_PAGE * page)})</span>`,
    ];
    showMore.disabled = false;
    console.log(number * page);
  } else {
    showMore.innerHTML = /* html */ [
      `<span>Show more</span>
       <span class="list__remaining">(0)</span>`,
    ];
    showMore.disabled = true;
  }
};


const showMoreBooks = () => {
      if (result.length > 0) {
        page = page + 1;
        const amountToDisplay = BOOKS_PER_PAGE * page;
        range.pop();
        range.push(amountToDisplay);
        createDisplay(result);
      } else {
        page = page + 1;
        const amountToDisplay = BOOKS_PER_PAGE * page;
        range.pop();
        range.push(amountToDisplay);
        createDisplay(newArray);
      }
};
  

showMore.addEventListener("click", showMoreBooks);

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
    element.setAttribute("id", id);

    element.innerHTML = /* html */ `
            <img
                id=${id}
                class="preview__image"
                src="${image}"
            />

            <div class="preview__info" id=${id}>
                <h3 class="preview__title" id=${id}>${title}</h3>
                <div class="preview__author" id=${id}>${author}</div>
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

createDisplay(newArray);

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
    let counter = 0;
    page = 1
    range = [0, 36];
    title ? counter++ : "";
    author !== "any" ? counter++ : "";
    genre !== "any" ? counter++ : "";
    
    if (counter !== 0 ) {
    for (let i = 0; i < newArray.length; i++) {
        let titleMatch = false;
        if (title !== "") {
          titleMatch = newArray[i].title
            .toLocaleLowerCase()
            .includes(title.trim().toLocaleLowerCase());
        }
        let authorMatch = newArray[i].author === author;
        let genreMatch = false;
        for (let j = 0; j < newArray[i].genres.length; j++) {
          if (newArray[i].genres[j] === genre) {
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
    
    if ((result.length === 0)) {
          createDisplay(result);
          document
            .querySelector(".list__message")
            .style.setProperty("display", "block");
        } else {
          createDisplay(result);
          document
            .querySelector(".list__message")
            .style.setProperty("display", "none");
        }
} else {
  createDisplay(newArray);
  result = []
}
    searchOverlay.open = false;
    searchSave.reset()
}


searchOpen.addEventListener("click", searchOverlayToggle);
searchCancel.addEventListener("click", searchOverlayToggle);
searchSave.addEventListener("submit", searchOverlaySubmit);


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


 
const dataListOpen = document.querySelector('[data-list-items]')
const dataListClose = document.querySelector("[data-list-close]");
const dataListToggle = (event) => {
  let specificBook = event.target.id;
  if (event.target.innerHTML !== "Close"){
    event.preventDefault();
    console.log(event);
    document.querySelector("[data-list-active]").open = true;
    for (const obj of newArray) {
      if (obj.id === specificBook){
        document.querySelector("[data-list-image]").src = obj.image;
        document.querySelector("[data-list-title]").innerHTML = obj.title;
        document.querySelector("[data-list-subtitle]").innerHTML = `${authors[obj.author]} (${new Date(obj.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerHTML = obj.description;
      }
    }
  } else if (event.target.innerHTML === "Close"){
    document.querySelector("[data-list-active]").open = false;
  }
}

dataListOpen.addEventListener("click", dataListToggle)
dataListClose.addEventListener("click", dataListToggle);

