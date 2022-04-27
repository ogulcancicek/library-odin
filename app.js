const addBtn = document.querySelector(".add-book");
const addBookForm = document.querySelector("#addBookForm");
const submitBtn = addBookForm.querySelector(".submitBtn");
const mainContainer = document.querySelector(".main");
const alertContainer = document.querySelector(".alert-container");

class Book {

    constructor(title, author, page, isRead){
        this.title = title;
        this.author = author;
        this.page = page;
        this.isRead = isRead;
    }

}

class Library {

    constructor(){
        this.library = [];
    }

    addBook(newBook){
        if(!this.library.some((book) => book.title ===  newBook.title)){
            this.library.push(newBook);
            return true;
        }
        return false;
    }

    removeBook(bookTitle){
        for (let book of this.library){
            if(book.title === bookTitle){
                this.library.pop(book);
                break
            }
        }
    }

}

const library = new Library();

addBtn.addEventListener("click", () => {
    addBookForm.reset();
})
addBookForm.onsubmit = addBook;

const getFromInput = (e) => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const page = document.getElementById("page").value;
    const isRead = document.getElementById("isRead").checked;

    return new Book(title, author, page, isRead);
}

function addBook (e){
    e.preventDefault();
    const newBook = getFromInput();
    let success = library.addBook(newBook);
    if(success){
        createNewBookContainer(newBook);
    }else{
        showError();
    }
}

function createNewBookContainer(newBook){
    const div = document.createElement("div");
    div.setAttribute("Data-title",`${newBook.title}`)
    const uList = document.createElement("ul");

    for(const prop in newBook){
        const listItem = document.createElement("li");
        if (prop === "isRead"){
            const statusBtn = document.createElement("button");
            statusBtn.id = "statusBtn";
            if (newBook[prop]){
                statusBtn.style.backgroundColor = `var(--readColor)`;
                statusBtn.textContent = "Read";
            }else{
                statusBtn.style.backgroundColor = `var(--notReadColor)`;
                statusBtn.textContent = "Not Read";
            }
            listItem.appendChild(statusBtn);
            statusBtn.addEventListener("click",changeStatus);
        }else{
            listItem.textContent = `${capitalizeProperties(prop)} : ${newBook[prop]}`;
        }
        uList.appendChild(listItem);
    }

    const listItem = document.createElement("li");
    const removeBtn = document.createElement("button");
    removeBtn.id = "removeBtn";
    removeBtn.textContent = "Remove";
    listItem.appendChild(removeBtn);
    uList.append(listItem);
    removeBtn.addEventListener("click",removeBook);
    
    div.classList.add("book-con");
    div.appendChild(uList);
    mainContainer.prepend(div);    
}

function removeBook(e){
    const uList = e.target.parentNode.parentNode;
    const bookTitle = uList.firstChild.textContent.slice(8,);
    
    library.removeBook(bookTitle);
    removeDisplay(bookTitle);
}

function removeDisplay(bookTitle){
    const bookToRemove = document.querySelector(`[Data-title='${bookTitle}']`);
    mainContainer.removeChild(bookToRemove);
}

function changeStatus(e){
    const uList = e.target.parentNode.parentNode;
    const bookTitle = uList.firstChild.textContent.slice(8,);
    
    for (let book of library.library){
        if(book.title === bookTitle){
            let status = book.isRead;
            book.isRead = !status;
            if (status) {
                e.target.style.backgroundColor = `var(--notReadColor)`;
                e.target.textContent = "Not Read";
                e.target.style.transition = "all 0.5s";
            }else{
                e.target.style.backgroundColor = `var(--readColor)`;
                e.target.textContent = "Read";
                e.target.style.transition = "all 0.5s";
            }
            
        }
    }
}

function capitalizeProperties(prop){
    return prop.charAt(0).toUpperCase() + prop.slice(1);
}

function showError(){
    const alertDiv = document.createElement("div");
    alertDiv.className += "container alert alert-danger";
    alertDiv.setAttribute("role","alert");
    alertDiv.textContent = "The book already exits in the library!";
    alertContainer.appendChild(alertDiv);
    setTimeout(function(){
        alertContainer.removeChild(alertDiv);
    },2500)
}