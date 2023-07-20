const emojiListElement = document.querySelector(".emoji-list");
const categorySelectElement = document.getElementById("category-select");
const paginationElement = document.querySelector(".pagination");
const emojisPerPage = 10;
let currentPage = 1;
let allEmojis = [];

async function fetchEmojis() {
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/all");
    allEmojis = await response.json();

    const categories = [...new Set(allEmojis.map((emoji) => emoji.category))];
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.textContent = category;
      option.value = category;
      categorySelectElement.appendChild(option);
    });

    categorySelectElement.addEventListener("change", () => {
      currentPage = 1;
      populateEmojis(allEmojis);
    });

    populateEmojis(allEmojis);
  } catch (error) {
    console.error("Error fetching emojis:", error);
  }
}

const maxPaginationButtons = 20;

function populatePagination(totalEmojis) {
  const numPages = Math.ceil(totalEmojis / emojisPerPage);
  paginationElement.innerHTML = "";

  let startPage = 1;
  let endPage = numPages;

  if (numPages > maxPaginationButtons) {
    const middlePage = Math.ceil(maxPaginationButtons / 2);
    if (currentPage >= middlePage && currentPage <= numPages - middlePage + 1) {
      startPage = currentPage - middlePage + 1;
      endPage = currentPage + middlePage - 1;
    } else if (currentPage < middlePage) {
      endPage = maxPaginationButtons;
    } else {
      startPage = numPages - maxPaginationButtons + 1;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement("button");
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.classList.add("active");
    }
    pageLink.addEventListener("click", () => {
      currentPage = i;
      populateEmojis(allEmojis);
    });
    paginationElement.appendChild(pageLink);
  }
}
function populateEmojis(emojis) {
  const selectedCategory = categorySelectElement.value;
  const filteredEmojis = selectedCategory
    ? emojis.filter((emoji) => emoji.category === selectedCategory)
    : emojis;

  emojiListElement.innerHTML = "";

  const startIndex = (currentPage - 1) * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const pageEmojis = filteredEmojis.slice(startIndex, endIndex);

  for (let i = 0; i < pageEmojis.length; i++) {
    const emoji = pageEmojis[i];
    const emojiCard = createEmojiCard(emoji);
    emojiListElement.appendChild(emojiCard);
  }

  populatePagination(filteredEmojis.length);
}



function createEmojiCard(emoji) {
  const emojiCard = document.createElement("div");
  emojiCard.classList.add("emoji-card");
  emojiCard.innerHTML = `<div class="emoji-icon">${emoji.htmlCode}</div>
                          <div>Name: ${emoji.name}</div>
                          <div>Category: ${emoji.category}</div>
                          <div>Group: ${emoji.group}</div>`;
  return emojiCard;
}

fetchEmojis();
