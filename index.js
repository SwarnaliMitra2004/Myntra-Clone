let bagItems;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  try {
    bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  } catch (e) {
    bagItems = []; // Fallback to an empty array if parsing fails
  }
  displayItemsOnHomePage();
  displayBagIcon();
}

function addToBag(itemId) {
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector('.bag-item-count');
  if (bagItemCountElement) {
      bagItemCountElement.style.visibility = bagItems.length > 0 ? 'visible' : 'hidden';
      bagItemCountElement.innerText = bagItems.length;
  }
}

function displayItemsOnHomePage() {
  let itemsContainerElement = document.querySelector('.items-container');
  if (!itemsContainerElement) return;
  
  let innerHtml = '';
  items.forEach(item => {
    innerHtml += `
    <div class="item-container" style="width: 250px;">
      <img class="item-image" src="${item.image}" alt="item image" style="width: 100%;">
      <div class="rating" style="font-size: 12px; font-weight: 700; margin: 5px 0;">
          ${item.rating.stars} ⭐ | ${item.rating.count}
      </div>
      <div class="company-name" style="font-size: 16px; font-weight: 700; color: #282c3f;">${item.company}</div>
      <div class="item-name" style="color: #535766; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.item_name}</div>
      <div class="price" style="margin-top: 10px; font-size: 14px;">
          <span class="current-price" style="font-weight: bold;">Rs ${item.current_price}</span>
          <span class="original-price" style="text-decoration: line-through; color: #7e818c; margin: 0 5px;">Rs ${item.original_price}</span>
          <span class="discount" style="color: #ff905a;">(${item.discount_percentage}% OFF)</span>
      </div>
      <button class="btn-add-bag" onclick="addToBag('${item.id}')" style="width: 100%; padding: 10px; background-color: #ff3f6c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 10px;">Add to Bag</button>
    </div>`
  });
  itemsContainerElement.innerHTML = innerHtml;
}