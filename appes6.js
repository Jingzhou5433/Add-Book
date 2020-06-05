class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBook(book){
        //get table element
        const table = document.getElementById('book-list');

        // create tr element
        const row = document.createElement('tr');

        //insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a herf="#" class = "delete">X<a></td>`

        table.appendChild(row);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    showAlter(message, className){
        //create div element
        const alterDiv = document.createElement('div');

        alterDiv.className = `alter ${className}`;

        alterDiv.id = 'alertDiv';

        alterDiv.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');

        const form = document.getElementById('book-form');

        container.insertBefore(alterDiv, form);

        //ser alert disappera after 2 secs
        setTimeout(function(){
            document.getElementById('alertDiv').remove();
        }, 2000);
    }
}


class Store{
    static getBook(){
        let books;
        if (localStorage.getItem('books') === null){
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books')); 
        }

        return books;
    }

    static displayBook(){
        const books = Store.getBook()

        books.forEach(function(book){
            const ui = new UI();
            ui.addBook(book)
            }
        );
    }

    static addBook(book){
        const books = Store.getBook()
        books.push(book)

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBook()
        books.forEach(function(book, index){
            if(isbn === book.isbn){
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Add Event listener for DOM Load event
document.addEventListener('DOMContentLoaded', Store.displayBook);


//Add Event Listener for addBook
document.getElementById('book-form').addEventListener('submit', function(e){
    
    //Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    
    //Instantiate book
    const book = new Book(title, author, isbn);


    //Instantiate UI obj
    const ui = new UI();

    //Check Validate
    if(title === '' || author === '' || isbn === ''){
        // if not, show error alter
        ui.showAlter('Please fill in all entries', 'error');
    }else{
        //Add book to UI obj
        ui.addBook(book);

        //Add book to local storage
        Store.addBook(book);

        //UI clear fields
        ui.clearFields();

        //show success alert
        ui.showAlter('Insert succeed!', 'success');

        
    }
    e.preventDefault();
})
    

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI();
    ui.deleteBook(e.target);

    //Delete book from LS
    //console.log(e.target.parentElement.previousElementSibling.textContent);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    ui.showAlter("Book delete!", 'success');

    e.preventDefault();
})