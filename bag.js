const CONVENIENCE_FEES = 99;
let bagItemObjects;
onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  if (!bagSummaryElement) return;

  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;

  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;
  
  if (totalItem === 0) {
    bagSummaryElement.innerHTML = `<h3>Your Bag is Empty!</h3>`;
    return;
  }

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container" style="margin-bottom: 20px;">
    <div class="price-header" style="font-weight: bold; font-size: 14px; margin-bottom: 15px; color: #535766;">PRICE DETAILS (${totalItem} Items) </div>
    <div class="price-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
      <span class="price-item-tag">Total MRP</span>
      <span class="price-item-value">₹${totalMRP}</span>
    </div>
    <div class="price-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
      <span class="price-item-tag">Discount on MRP</span>
      <span class="price-item-value priceDetail-base-discount" style="color: #03a685;">-₹${totalDiscount}</span>
    </div>
    <div class="price-item" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
      <span class="price-item-tag">Convenience Fee</span>
      <span class="price-item-value">₹99</span>
    </div>
    <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eaeaec;">
    <div class="price-footer" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; color: #3e4152;">
      <span class="price-item-tag">Total Amount</span>
      <span class="price-item-value">₹${finalPayment}</span>
    </div>
  </div>
  <button class="btn-place-order" style="width: 100%; background-color: #ff3f6c; color: white; padding: 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 14px;">
    <div>PLACE ORDER</div>
  </button>
  `;
}

function loadBagItemObjects() {
  let bagItemsStr = localStorage.getItem('bagItems');
  let currentBagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  bagItemObjects = currentBagItems.map(itemId => items.find(item => item.id == itemId));
}

function displayBagItems() {
  let containerElement = document.querySelector('.bag-items-container');
  if (!containerElement) return;
  
  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    if (bagItem) innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
}

function removeFromBag(itemId) {
  let bagItemsStr = localStorage.getItem('bagItems');
  let bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  // Remove ONLY the first matching item to allow multiples of the same item if you ever add them
  const index = bagItems.indexOf(itemId.toString());
  if (index > -1) {
      bagItems.splice(index, 1);
  }
  
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  if (typeof displayBagIcon === 'function') displayBagIcon();
  displayBagItems();
  displayBagSummary();
}

function generateItemHTML(item) {
  return `<div class="bag-item-container" style="display: flex; border: 1px solid #eaeaec; padding: 15px; border-radius: 4px; margin-bottom: 15px; position: relative;">
    <div class="item-left-part" style="width: 120px; margin-right: 15px;">
      <img class="bag-item-img" src="${item.image}" style="width: 100%;">
    </div>
    <div class="item-right-part" style="flex: 1;">
      <div class="company" style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${item.company}</div>
      <div class="item-name" style="color: #535766; font-size: 14px; margin-bottom: 10px;">${item.item_name}</div>
      <div class="price-container" style="font-size: 14px; margin-bottom: 10px;">
        <span class="current-price" style="font-weight: bold;">Rs ${item.current_price}</span>
        <span class="original-price" style="text-decoration: line-through; color: #7e818c; margin: 0 5px;">Rs ${item.original_price}</span>
        <span class="discount-percentage" style="color: #ff905a;">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period" style="font-size: 12px; color: #282c3f; margin-bottom: 5px;">
        <span class="return-period-days" style="font-weight: bold;">${item.return_period} days</span> return available
      </div>
      <div class="delivery-details" style="font-size: 12px; color: #282c3f;">
        Delivery by
        <span class="delivery-details-days" style="color: #03a685;">${item.delivery_date}</span>
      </div>
    </div>
    <div class="remove-from-cart" onclick="removeFromBag('${item.id}')" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 18px; font-weight: bold;">X</div>
  </div>`;
}