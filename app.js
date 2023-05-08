// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.groceryForm');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submitBtn');
const container = document.querySelector('.groceryContainer');
const list = document.querySelector('.groceryList');
const clearBtn = document.querySelector('.clearBtn');
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********
// adding Items
form.addEventListener("submit", addItem);
// clearing list
clearBtn.addEventListener('click', clearList);
// loading content
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const id = new Date().getTime().toString();
    const value = grocery.value;
    if (value && !editFlag) {
        createList(id, value);
        // show container
        container.classList.add('showContainer');
        // alert
        displayAlert('Item added to the list', 'Success');
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Item edited', 'Success');
        editLocalStorage(editID,value);
        setBackToDefault();
    }
    else {
        displayAlert('Please enter an item', 'Danger');
    }
};

// alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert${action}`);

    // timeout
    setTimeout(function () {
        alert.textContent = '';
        alert.classList.remove(`alert${action}`);
    }, 1500)
};

function clearList() {
    const items = document.querySelectorAll('.groceryItem');
    items.forEach(function (item) {
        list.removeChild(item);
    });
    container.classList.remove('showContainer');
    displayAlert('List cleared', 'Success')
    setBackToDefault();
    localStorage.removeItem('list');
};

// editing
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    console.log(editID);
    submitBtn.textContent = 'edit'
};

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove('showContainer')
    };
    displayAlert('Item deleted', 'Danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
};

function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
};

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getFromLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
    // console.log('Added to local storage');
}
function removeFromLocalStorage(id) {
    let items = getFromLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
    // console.log('Removed from local storage');
};

function editLocalStorage(id, value){
    let items = getFromLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
    // console.log('local storage edited');
}

function getFromLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) :[];
}

// create list
function createList(id, value){
    const element = document.createElement('article');
        // add class
        element.classList.add('groceryItem');
        // set ID
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btnContainer">
          <button type="button" class="editBtn">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="deleteBtn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
        // edit btn
        const editBtn = element.querySelector('.editBtn');
        editBtn.addEventListener('click', editItem);
        // delete btn
        const deleteBtn = element.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', deleteItem);
        // append to list
        list.appendChild(element);
};

// ****** SETUP ITEMS **********
function setupItems(){
    let items = getFromLocalStorage();
    if (items.length > 0){
        items.forEach(function(item){
            createList(item.id, item.value)
        });
    container.classList.add('showContainer');
    };
}