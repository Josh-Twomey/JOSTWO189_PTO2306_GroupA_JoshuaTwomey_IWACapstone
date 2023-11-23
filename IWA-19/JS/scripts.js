import { BOOKS_PER_PAGE, authors, genres, books } from "../JS/data.js";
/**
 * bookArray has no duplicate entries compared to the books array given in the data.js file 
*/
const bookArray = [];
/**
 * searchArray is populated with the correct books that fit the filters the user has searched for
 */
let searchArray = [];

for (const obj of books) {
  const newObject = { ...obj }; // Create a deep copy of the current object
  if (!bookArray.some((item) => item.title === newObject.title)) {
    bookArray.push(newObject);
  }
}
/**
 * page counter to use in the showMoreButton
 */
let pageCounter = 1;
/**
 * range used to change the bookList length
 */
let range = [0, 36];
if (!bookArray && !Array.isArray(bookArray)) throw new Error("Source required");
if (!range && range.length < 2)
  throw new Error("Range must be an array with two numbers");

const showMoreButton = document.querySelector("[data-list-button]");

/**
 * JavaScript code for updating the text of a button based on a given number.
 * If the number is greater than or equal to a certain value, the button text will include the remaining number of items.
 * Otherwise, the button text will indicate that there are no remaining items and the button will be disabled.
 */

const updateButtonText = (number) => {
  if (number - BOOKS_PER_PAGE * pageCounter >= 0) {
    showMoreButton.innerHTML = /* html */ [
      `<span>Show more</span>
       <span class="list__remaining">(${
         number - BOOKS_PER_PAGE * pageCounter
       })</span>`,
    ];
    showMoreButton.disabled = false;
  } else {
    showMoreButton.innerHTML = /* html */ [
      `<span>Show more</span>
       <span class="list__remaining">(0)</span>`,
    ];
    showMoreButton.disabled = true;
  }
};
// Add feature to scroll to the top of the page
const showMoreBooks = () => {
  if (searchArray.length > 0) {
    pageCounter = pageCounter + 1;
    const amountToDisplay = BOOKS_PER_PAGE * pageCounter;
    range.pop();
    range.push(amountToDisplay);
    createDisplay(searchArray);
  } else {
    pageCounter = pageCounter + 1;
    const amountToDisplay = BOOKS_PER_PAGE * pageCounter;
    range.pop();
    range.push(amountToDisplay);
    createDisplay(bookArray);
  }
};

showMoreButton.addEventListener("click", showMoreBooks);

const createDisplay = (array) => {
  document.querySelector("[data-list-items]").innerHTML = "";
  const bookListFragment = document.createDocumentFragment();
  let extractedArray = [];
  updateButtonText(array.length);
  if (array.length > 36) {
    extractedArray = array.slice(range[0], range[1]);
  } else {
    extractedArray = array.slice(range[0], array.length);
  }
/**
 * JavaScript code to create an HTML element for displaying book details.
 */

  const createBookHtml = (bookDetails) => {
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

/*
 This code iterates through the 'extractedArray' and creates an HTML element for
 each item in the array using the 'createBookHtml' function. The created HTML 
 elements are then appended to the 'bookListFragment'.
*/

  for (let i = 0; i < extractedArray.length; i++) {
    const bookList = createBookHtml({
      author: authors[extractedArray[i].author],
      id: extractedArray[i].id,
      image: extractedArray[i].image,
      title: extractedArray[i].title,
    });

    bookListFragment.appendChild(bookList);
  }

  const bookDisplay = document.querySelector("[data-list-items]");
  bookDisplay.appendChild(bookListFragment);
};

createDisplay(bookArray);

const searchOpen = document.querySelector("[data-header-search]");
const searchCancel = document.querySelector("[data-search-cancel]");
const searchSave = document.querySelector("[data-search-form]");
const searchOverlay = document.querySelector("[data-search-overlay]");

const searchOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    searchOverlay.open = false;
    searchSave.reset();
  } else if (
    event.target.innerHTML !== "Cancel" &&
    event.target.innerHTML !== "Search"
  ) {
    searchOverlay.open = true;
    document.querySelector("[data-search-title]").focus();

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

    document
      .querySelector("[data-search-authors]")
      .appendChild(authorsFragment);
  }
};

const searchOverlaySubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { author, genre, title } = Object.fromEntries(formData);
  let counter = 0;
  pageCounter = 1;
  range = [0, 36];
  searchArray = [];
  title ? counter++ : "";
  author !== "any" ? counter++ : "";
  genre !== "any" ? counter++ : "";

  if (counter !== 0) {
    for (let i = 0; i < bookArray.length; i++) {
      let titleMatch = false;
      if (title !== "") {
        titleMatch = bookArray[i].title
          .toLocaleLowerCase()
          .includes(title.trim().toLocaleLowerCase());
      }
      let authorMatch = bookArray[i].author === author;
      let genreMatch = false;
      for (let j = 0; j < bookArray[i].genres.length; j++) {
        if (bookArray[i].genres[j] === genre) {
          genreMatch = true;
        }
      }

      const checkAll3 = authorMatch && genreMatch && titleMatch;
      const check2 =
        (authorMatch && (genreMatch || titleMatch)) ||
        (genreMatch && titleMatch);
      const check1 = genreMatch || authorMatch || titleMatch;

      if (counter === 3) {
        checkAll3 ? searchArray.push(bookArray[i]) : "";
      } else if (counter === 2) {
        check2 ? searchArray.push(bookArray[i]) : "";
      } else if (counter === 1) {
        check1 ? searchArray.push(bookArray[i]) : "";
      }
    }

    if (searchArray.length === 0) {
      createDisplay(searchArray);
      document
        .querySelector(".list__message")
        .style.setProperty("display", "block");
    } else {
      createDisplay(searchArray);
      document
        .querySelector(".list__message")
        .style.setProperty("display", "none");
    }
  } else {
    createDisplay(bookArray);
  }
  searchOverlay.open = false;
  searchSave.reset();
};

searchOpen.addEventListener("click", searchOverlayToggle);
searchCancel.addEventListener("click", searchOverlayToggle);
searchSave.addEventListener("submit", searchOverlaySubmit);

/* Selects specific elements from the DOM using data attributes and assigns them to 
  variables for further use.*/
const settingOpen = document.querySelector("[data-header-settings]");
const settingCancel = document.querySelector("[data-settings-cancel]");
const settingSave = document.querySelector("[data-settings-form]");
const settingOverlay = document.querySelector("[data-settings-overlay]");

// Code to toggle the setting overlay
const settingOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    settingSave.reset();
    settingOverlay.open = false;
  } else if (
    event.target.innerHTML !== "Cancel" &&
    event.target.innerHTML !== "Save"
  ) {
    settingOverlay.open = true;
  }
};

const settingOverlaySubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  const matches = theme === "night";
  const root = document.documentElement;

  if (matches) {
    root.style.setProperty("--color-dark", "255, 255, 255");
    root.style.setProperty("--color-light", "10, 10, 20");
  } else {
    root.style.setProperty("--color-dark", "10, 10, 20");
    root.style.setProperty("--color-light", "255, 255, 255");
  }
  settingOverlay.open = false;
  settingSave.reset()
};

settingOpen.addEventListener("click", settingOverlayToggle);
settingCancel.addEventListener("click", settingOverlayToggle);
settingSave.addEventListener("submit", settingOverlaySubmit);

const dataListOpen = document.querySelector("[data-list-items]");
const dataListClose = document.querySelector("[data-list-close]");

const dataListToggle = (event) => {
  let specificBook = event.target.id;
  if (event.target.innerHTML !== "Close") {
    event.preventDefault();
    console.log(event);
    document.querySelector("[data-list-active]").open = true;
    for (const obj of newArray) {
      if (obj.id === specificBook) {
        document.querySelector("[data-list-image]").src = obj.image;
        document.querySelector("[data-list-title]").innerHTML = obj.title;
        document.querySelector("[data-list-subtitle]").innerHTML = `${
          authors[obj.author]
        } (${new Date(obj.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerHTML =
          obj.description;
      }
    }
  } else if (event.target.innerHTML === "Close") {
    document.querySelector("[data-list-active]").open = false;
  }
};

dataListOpen.addEventListener("click", dataListToggle);
dataListClose.addEventListener("click", dataListToggle);

const overlayDataSecondary = document.querySelector(".overlay__data_secondary");
overlayDataSecondary.style.setProperty("padding", "20px");
overlayDataSecondary.style.setProperty("overflow-x", "hidden");
overlayDataSecondary.style.setProperty("overflow-y", "scroll");
overlayDataSecondary.style.setProperty("max-height", "250px");

