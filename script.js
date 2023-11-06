const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const listItems = document.getElementById('list-items');
const removeBtn = document.querySelector('.btn-remove');
const clearBtn = document.getElementById('clear-button');
const searchInput = document.querySelector('.search');
const submitBtn = document.querySelector('.form-control .btn');
let isEdit = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemDom(item));
}

// Add Item
function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if(newItem === '') {
    alert('Lütfen ürün isminizi girin.')
    return;
  } 

  if(isEdit) {
    const itemToEdit = listItems.querySelector('.edit');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit');
    itemToEdit.remove();
    isEdit = false;
  } else {
    if(checkItemExist(newItem)) {
      alert('Bu ürün zaten listenizde ekli!');
      return;
    }
  }

  // Created element in DOM
  addItemDom(newItem);

  // Created element in LocalStorage
  addItemLocalStorage(newItem);

  checkUI();
}

// Add Item DOM
function addItemDom(item) {
  const li = document.createElement('li');
  li.className = 'item';
  li.appendChild(document.createTextNode(item));

  li.appendChild(createButton('btn-remove'));

  listItems.appendChild(li);
}
// Create Button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  button.appendChild(createIcon('fa-solid fa-xmark icon'));
  return button;
}
// Create Icon
function createIcon(classes) {
  const icon = document.createElement('icon');
  icon.className = classes;
  return icon;
}

// Add Item Local Storage
function addItemLocalStorage(item) {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
  let itemsFromStorage;

  if(localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}


// Remove Item
function removeItem(e) {
  if(e.target.parentElement.classList.contains('btn-remove')) {
    remove(e.target.parentElement.parentElement);
  } else {
    if(e.target.classList.contains('item')) {
      editItem(e.target);
    }
  }
}

function remove(item) {
  if(confirm('Ürünü silmek istiyor musunuz?')){
    item.remove();
    removeItemFromStorage(item.textContent);
  }
  checkUI();
}


// Remove Item From Local Storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  // Filter item to remove
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


// The Same Item Cannot Be Entered
function checkItemExist(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

function editItem(item) {
  isEdit = true;

  listItems.querySelectorAll('li').forEach((i) => i.classList.remove('edit'));

  item.classList.add('edit');
  itemInput.value = item.textContent;
  submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ürün Düzenle';
  submitBtn.style.backgroundColor = '#86f68d';
}

// Search
function search(e) {
  const liItems = listItems.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  liItems.forEach((item) => {
    const itemName = item.textContent.toLowerCase();

    if(itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Clear All Items
function clearItems() {
  const liItems = listItems.querySelectorAll('li');
  
  liItems.forEach((item) => item.remove());
  localStorage.clear();

  checkUI();
}

// Check
function checkUI() {
  itemInput.value = '';
  const liItem = document.querySelectorAll('.item');
  if(liItem.length === 0) {
    clearBtn.style.display = 'none';
    searchInput.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    searchInput.style.display = 'block';
  }

  submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ürün Ekle';
  submitBtn.style.backgroundColor = '#f1faee';

  isEdit = false;
}

function init() {
  displayItems();
  checkUI();
  itemForm.addEventListener('submit', addItem);
  listItems.addEventListener('click', removeItem);
  clearBtn.addEventListener('click', clearItems);
  searchInput.addEventListener('input', search);
}

init();
