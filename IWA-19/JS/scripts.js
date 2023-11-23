import { BOOKS_PER_PAGE, authors, genres, books } from "../JS/data.js";
// Add jsDoc to some functions
const bookArrayNoDuplicates = [];
let booksMatchingFilterCriteria = [];
//This for loop removes the duplicate entries from books array and populates the bookArrayNoDuplicates 
for (const obj of books) {
  const newObject = { ...obj }; // Creates shallow copy of obj
  if (!bookArrayNoDuplicates.some((book) => book.title === newObject.title)) {
    bookArrayNoDuplicates.push(newObject);
  }
}
let pageCount = 1;
let displayedBooksCount = [0, 36];

if (!bookArrayNoDuplicates && !Array.isArray(bookArrayNoDuplicates)) throw new Error("Source required");
if (!displayedBooksCount && displayedBooksCount.length < 2)
  throw new Error("Range must be an array with two numbers");

/* Selecting specific elements from the DOM using data attributes and assigning them to 
   variables for further use.*/
const showMoreButton = document.querySelector("[data-list-button]");
const bookSearchOpen = document.querySelector("[data-header-search]");
const bookSearchCancel = document.querySelector("[data-search-cancel]");
const bookSearchSubmit = document.querySelector("[data-search-form]");
const bookSearchOverlay = document.querySelector("[data-search-overlay]");
const themeSettingOpen = document.querySelector("[data-header-settings]");
const themeSettingCancel = document.querySelector("[data-settings-cancel]");
const themeSettingSubmit = document.querySelector("[data-settings-form]");
const themeSettingOverlay = document.querySelector("[data-settings-overlay]");
const bookPreviewOpen = document.querySelector("[data-list-items]");
const bookPreviewClose = document.querySelector("[data-list-close]");


/**
 * JavaScript code for updating the text of a button based on a given number.
 * If the number is greater than or equal to a certain value, the button text will include the remaining number of items.
 * Otherwise, the button text will indicate that there are no remaining items and the button will be disabled.
 */

const updateButton = (number) => {
  if (number - BOOKS_PER_PAGE * pageCount >= 0) {
    showMoreButton.innerHTML = /* html */ [
      `<span>Show more</span>
       <span class="list__remaining">(${
         number - BOOKS_PER_PAGE * pageCount
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

const showMoreBooks = () => {
  if (booksMatchingFilterCriteria.length > 0) {
    pageCount = pageCount + 1;
    const amountToDisplay = BOOKS_PER_PAGE * pageCount;
    displayedBooksCount.pop();
    displayedBooksCount.push(amountToDisplay);
    createDisplay(booksMatchingFilterCriteria);
  } else {
    pageCount = pageCount + 1;
    const amountToDisplay = BOOKS_PER_PAGE * pageCount;
    displayedBooksCount.pop();
    displayedBooksCount.push(amountToDisplay);
    createDisplay(bookArrayNoDuplicates);
  }
};

showMoreButton.addEventListener("click", showMoreBooks);

const createDisplay = (array) => {
  document.querySelector("[data-list-items]").innerHTML = "";
  const bookListFragment = document.createDocumentFragment();
  let visibleBooks = [];
  updateButton(array.length);
  if (array.length > 36) {
    visibleBooks = array.slice(displayedBooksCount[0], displayedBooksCount[1]);
  } else {
    visibleBooks = array.slice(displayedBooksCount[0], array.length);
  }

/**
 * Creates an HTML element for displaying the book details.
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

  for (let i = 0; i < visibleBooks.length; i++) {
    const bookList = createBookHtml({
      author: authors[visibleBooks[i].author],
      id: visibleBooks[i].id,
      image: visibleBooks[i].image,
      title: visibleBooks[i].title,
    });

    bookListFragment.appendChild(bookList);
  }

  const bookDisplay = document.querySelector("[data-list-items]");
  bookDisplay.appendChild(bookListFragment);
};
// Original Display for the web page created
createDisplay(bookArrayNoDuplicates);



const searchOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    bookSearchOverlay.open = false;
    bookSearchSubmit.reset();
  } else if (
    event.target.innerHTML !== "Cancel" &&
    event.target.innerHTML !== "Search"
  ) {
    bookSearchOverlay.open = true;
    document.querySelector("[data-search-title]").focus();

    const genresFragment = document.createDocumentFragment();
    const allGenresOption = document.createElement("option");
    allGenresOption.value = "any";
    allGenresOption.textContent = "All Genres";
    genresFragment.appendChild(allGenresOption);

    for (const genreKey of Object.keys(genres)) {
      const genre = genres[genreKey]; 
      const genreOption = document.createElement("option");
      genreOption.value = genreKey; 
      genreOption.textContent = genre; 
      genresFragment.appendChild(genreOption);
    }

    document.querySelector("[data-search-genres]").appendChild(genresFragment);

    const authorsFragment = document.createDocumentFragment();
    const allAuthorsOption = document.createElement("option");
    allAuthorsOption.value = "any";
    allAuthorsOption.textContent = "All Authors";
    authorsFragment.appendChild(allAuthorsOption);

    for (const authorKey of Object.keys(authors)) {
      const author = authors[authorKey];
      const authorOption = document.createElement("option");
      authorOption.value = authorKey; 
      authorOption.textContent = author; 
      authorsFragment.appendChild(authorOption);
    }

    document
      .querySelector("[data-search-authors]")
      .appendChild(authorsFragment);
  }
};

const searchOverlaySubmit = (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const formData = new FormData(event.target);
  const { author, genre, title } = Object.fromEntries(formData);
  let counter = 0;
  pageCount = 1;
  displayedBooksCount = [0, 36];
  booksMatchingFilterCriteria = [];
  title ? counter++ : "";
  author !== "any" ? counter++ : "";
  genre !== "any" ? counter++ : "";

  if (counter !== 0) {
    for (let i = 0; i < bookArrayNoDuplicates.length; i++) {
      let titleOfBookMatches = false;
      if (title !== "") {
        titleOfBookMatches = bookArrayNoDuplicates[i].title
          .toLocaleLowerCase()
          .includes(title.trim().toLocaleLowerCase());
      }
      let authorOfBookMatches = bookArrayNoDuplicates[i].author === author;
      let genreOfBookMatches = false;
      for (let j = 0; j < bookArrayNoDuplicates[i].genres.length; j++) {
        if (bookArrayNoDuplicates[i].genres[j] === genre) {
          genreOfBookMatches = true;
        }
      }

      const bookMatchesAllFilters = authorOfBookMatches && genreOfBookMatches && titleOfBookMatches;
      const bookMatchesAnyTwoFilters =
        (authorOfBookMatches && (genreOfBookMatches || titleOfBookMatches)) ||
        (genreOfBookMatches && titleOfBookMatches);
      const bookMathesOneFilter = genreOfBookMatches || authorOfBookMatches || titleOfBookMatches;

      if (counter === 3) {
        bookMatchesAllFilters ? booksMatchingFilterCriteria.push(bookArrayNoDuplicates[i]) : "";
      } else if (counter === 2) {
        bookMatchesAnyTwoFilters ? booksMatchingFilterCriteria.push(bookArrayNoDuplicates[i]) : "";
      } else if (counter === 1) {
        bookMathesOneFilter ? booksMatchingFilterCriteria.push(bookArrayNoDuplicates[i]) : "";
      }
    }

    if (booksMatchingFilterCriteria.length === 0) {
      createDisplay(booksMatchingFilterCriteria);
      document
        .querySelector(".list__message")
        .style.setProperty("display", "block");
    } else {
      createDisplay(booksMatchingFilterCriteria);
      document
        .querySelector(".list__message")
        .style.setProperty("display", "none");
    }
  } else {
    createDisplay(bookArrayNoDuplicates);
  }
  bookSearchOverlay.open = false;
  bookSearchSubmit.reset();
};

bookSearchOpen.addEventListener("click", searchOverlayToggle);
bookSearchCancel.addEventListener("click", searchOverlayToggle);
bookSearchSubmit.addEventListener("submit", searchOverlaySubmit);



const settingOverlayToggle = (event) => {
  if (event.target.innerHTML === "Cancel") {
    themeSettingSubmit.reset();
    themeSettingOverlay.open = false;
  } else if (
    event.target.innerHTML !== "Cancel" &&
    event.target.innerHTML !== "Save"
  ) {
    themeSettingOverlay.open = true;
  }
};

const settingOverlaySubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  const selectedNight = theme === "night";
  const root = document.documentElement;

  if (selectedNight) {
    root.style.setProperty("--color-dark", "255, 255, 255");
    root.style.setProperty("--color-light", "10, 10, 20");
  } else {
    root.style.setProperty("--color-dark", "10, 10, 20");
    root.style.setProperty("--color-light", "255, 255, 255");
  }
  themeSettingOverlay.open = false;
  themeSettingSubmit.reset()
};

themeSettingOpen.addEventListener("click", settingOverlayToggle);
themeSettingCancel.addEventListener("click", settingOverlayToggle);
themeSettingSubmit.addEventListener("submit", settingOverlaySubmit);



const bookPreivewToggle = (event) => {
  let selectedBook = event.target.id;
  if (event.target.innerHTML !== "Close") {
    event.preventDefault();
    overlayDataSecondaryStyling();

    document.querySelector("[data-list-active]").open = true;
    for (const obj of bookArrayNoDuplicates) {
      if (obj.id === selectedBook) {
        document.querySelector("[data-list-image]").src = obj.image;
        document.querySelector("[data-list-blur]").src = document.querySelector("[data-list-image]").src;
        document.querySelector("[data-list-title]").innerHTML = obj.title;
        document.querySelector("[data-list-subtitle]").innerHTML = `${authors[obj.author]} 
        (${new Date(obj.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerHTML = obj.description;
      }
    }
  } else if (event.target.innerHTML === "Close") {
    document.querySelector("[data-list-active]").open = false;
  }
};

bookPreviewOpen.addEventListener("click", bookPreivewToggle);
bookPreviewClose.addEventListener("click", bookPreivewToggle);

/**
 * Adds a scroll bar in order to read the whole description of a book
 */
const overlayDataSecondaryStyling = () => {
const overlayDataSecondary = document.querySelector(".overlay__data_secondary");
overlayDataSecondary.style.setProperty("padding", "20px");
overlayDataSecondary.style.setProperty("overflow-x", "hidden");
overlayDataSecondary.style.setProperty("overflow-y", "scroll");
overlayDataSecondary.style.setProperty("max-height", "250px");
}

