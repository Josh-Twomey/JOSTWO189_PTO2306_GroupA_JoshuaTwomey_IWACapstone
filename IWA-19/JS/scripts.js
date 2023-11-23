import { BOOKS_PER_PAGE, authors, genres, books } from "../JS/data.js";

const bookArrayNoDuplicates = [];
let booksMatchingFilterCriteria = [];
let pageCount = 1;
let displayedBooksCount = [0, 36];

//This for loop removes the duplicate entries from books array and populates the bookArrayNoDuplicates 
for (const obj of books) {
  const newObject = { ...obj }; // Creates shallow copy of obj
  if (!bookArrayNoDuplicates.some((book) => book.title === newObject.title)) {
    bookArrayNoDuplicates.push(newObject);
  }
}

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

/*=====================Show More Button=====================*/

/**
 * Updates the text of the showMoreButton based on the array.length being displayed.
 * Disables button if no more books to display 
 * @param {number}
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

/** Updates the displayed books when the button is clicked*/
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

/*=====================Book Display=====================*/

/**Creates the display for the book list
 * @param {array} : array with the book data
 * @returns : displays the books on the webpage
*/
const createDisplay = (array) => {
  document.querySelector("[data-list-items]").innerHTML = "";
  const bookListFragment = document.createDocumentFragment();
  let visibleBooksArray = [];
  updateButton(array.length);
  if (array.length > 36) {
    visibleBooksArray = array.slice(displayedBooksCount[0], displayedBooksCount[1]);
  } else {
    visibleBooksArray = array.slice(displayedBooksCount[0], array.length);
  }

/**
 * Creates an HTML element for displaying the book details.
 * @param {object} : book data split into relevant content
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
 This code iterates through the 'visibleBooksArray' and creates an HTML element for
 each item in the array using the 'createBookHtml' function.
*/

  for (let i = 0; i < visibleBooksArray.length; i++) {
    const bookList = createBookHtml({
      author: authors[visibleBooksArray[i].author],
      id: visibleBooksArray[i].id,
      image: visibleBooksArray[i].image,
      title: visibleBooksArray[i].title,
    });

    bookListFragment.appendChild(bookList);
  }

  const bookDisplay = document.querySelector("[data-list-items]");
  bookDisplay.appendChild(bookListFragment);
};
// Original Display for the web page created
createDisplay(bookArrayNoDuplicates);

/*=====================Book Search Overlay=====================*/

/** If the toggle is open, Authors and Genres are loaded dynamically to the drop-down menus respectively*/
const bookSearchOverlayToggle = (event) => {
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

    document.querySelector("[data-search-authors]").appendChild(authorsFragment);
  }
};

/**Displays books that meet the criteria based on user selection from options 
 * given on the overlay
*/
const bookSearchOverlaySubmit = (event) => {
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

bookSearchOpen.addEventListener("click", bookSearchOverlayToggle);
bookSearchCancel.addEventListener("click", bookSearchOverlayToggle);
bookSearchSubmit.addEventListener("submit", bookSearchOverlaySubmit);

/*=====================Theme Setting Overlay=====================*/

const themeSettingOverlayToggle = (event) => {
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

/**Changes the colours of the page based on user selection from options given on the overlay*/
const themeSettingOverlaySubmit = (event) => {
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

themeSettingOpen.addEventListener("click", themeSettingOverlayToggle);
themeSettingCancel.addEventListener("click", themeSettingOverlayToggle);
themeSettingSubmit.addEventListener("submit", themeSettingOverlaySubmit);

/*=====================Book Preview Overlay=====================*/

/**Displays Preview Overlay with more information on a book the user clicks on*/
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

