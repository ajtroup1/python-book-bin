from flask import request, jsonify
from config import app, db
from models import Book, Admin, Checkout

#Return db
@app.route('/getdb', methods=['GET'])
def get_db():
    books = Book.query.all()
    admins = Admin.query.all()
    checkouts = Checkout.query.all()

    json_books = [book.to_json() for book in books]
    json_admins = [admin.to_json() for admin in admins]
    json_checkouts = [checkout.to_json() for checkout in checkouts]

    return jsonify({'books': json_books, 'admins': json_admins, 'checkouts': json_checkouts}), 201

##################################################################################################################

#Book Data Routes
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all() # Get all books from the database
    json_books = [book.to_json() for book in books] # Convert books to JSON using the to_json method in the model
    return jsonify({'books': json_books})
@app.route('/getbook/<int:id>', methods=['GET'])
def get_book_by_id(id):
    book = Book.query.get(id)

    if not book:
        return jsonify({'message': 'book with that id not found'}), 404
    
    json_book = book.to_json()

    return jsonify({'book:': json_book}), 201
@app.route('/addbook', methods=['POST'])
def add_book():
    title = request.json.get('title')
    author = request.json.get('author')
    description = request.json.get('description')
    genre = request.json.get('genre')
    coverURL = request.json.get('coverURL')
    deleted = False
    condition = request.json.get('condition')
    datePublished = request.json.get('datePublished')
    dateAdded = request.json.get('dateAdded')
    salePrice = request.json.get('salePrice')

    if not description:
        description = 'No description entered for this book'
    if not salePrice:
        salePrice = -1
    if not coverURL:
        coverURL = 'none'

    addBook = {
        'title': title,
        'author': author,
        'description': description,
        'coverURL': coverURL,
        'deleted': deleted,
        'condition': condition,
        'datePublished': datePublished,
        'dateAdded': dateAdded,
        'salesPrice': salePrice,
    }


    #if ANY field of book is missing
    if not title or not author or not description or not genre or not coverURL or not condition or not datePublished or not dateAdded or not salePrice:
        return (jsonify({'failed trying to add book:': addBook}), 400,)
    
    newBook = Book(title=title, author=author, description=description, genre=genre, coverURL=coverURL, deleted=deleted, condition=condition, datePublished=datePublished, dateAdded=dateAdded, salePrice=salePrice)

    try:
        db.session.add(newBook)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400 #error committing book to db
    
    return jsonify({'message': 'book added'}), 201 #success message
@app.route('/editbook/<int:id>', methods=['PATCH'])
def edit_book(id):
    book = Book.query.get(id)

    if not book:
        return jsonify({'message': 'book with that id not found'}), 400
    
    data = request.json
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.description = data.get('description', book.description)
    book.genre = data.get('genre', book.genre)
    book.coverURL = data.get('coverURL', book.coverURL)
    book.condition = data.get('condition', book.condition)
    book.datePublished = data.get('datePublished', book.datePublished)
    #date added is not editable
    book.salePrice = data.get('salePrice', book.salePrice)
    #deleted is toggled with delete route

    db.session.commit()

    return jsonify({'message': 'book edited successfully'}), 201
@app.route('/deletebook/<int:id>', methods=['PATCH']) #really just toggled deleted field, not an actual hard delete
def delete_book(id):
    book = Book.query.get(id)

    if not book:
        return jsonify({'message': 'book not found with that id'}), 400
    
    book.deleted = not book.deleted

    db.session.commit()

    return jsonify({'message': 'book deleted toggled successfully'}), 201

###########################################################################################################################

#Admin Data Routes
@app.route('/admins', methods=['GET'])
def get_admins():
    admins = Admin.query.all() # Get all books from the database
    json_admins = [admin.to_json() for admin in admins] # Convert books to JSON using the to_json method in the model
    return jsonify({'admins': json_admins})
@app.route('/addadmin', methods=['POST'])
def add_admin():
    username = request.json.get('username')
    password = request.json.get('password')
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    employeeID = request.json.get('employeeID')

    if not username or not password or not firstname or not lastname or not employeeID:
        return jsonify({'message': 'username, password, firstname, lastname, and employeeID are required to add an admin'}), 400
    
    newAdmin = Admin(username=username, password=password, firstname=firstname, lastname=lastname, employeeID=employeeID)

    try:
        db.session.add(newAdmin)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
    return jsonify({'message': 'admin successfully added'}), 201
@app.route('/editadmin/<int:id>', methods=['PATCH'])
def edit_admin(id):
    admin = Admin.query.get(id)

    if not admin:
        return jsonify({'message': 'admin with that id not found'}), 404
    
    data = request.json
    admin.username = data.get('username', admin.username)
    admin.password = data.get('password', admin.password)
    admin.firstname = data.get('firstname', admin.firstname)
    admin.lastname = data.get('lastname', admin.lastname)
    admin.employeeID = data.get('employeeID', admin.employeeID)

    db.session.commit()

    return jsonify({'message': 'admin successfully edited'})
@app.route('/deleteadmin/<int:id>', methods=['DELETE']) #this is actually a hard delete
def delete_admin(id):
    admin = Admin.query.get(id)

    if not admin:
        return jsonify({'message': 'admin with that id not found'}), 404
    
    try:
        db.session.delete(admin)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)})
    
    return jsonify({'message': 'admin successfully deleted'})

#################################################################################################################################

#Checkout Data Routes
@app.route('/checkouts', methods=['GET'])
def get_checkouts():
    checkouts = Checkout.query.all() # Get all books from the database
    json_checkouts = [checkout.to_json() for checkout in checkouts] # Convert books to JSON using the to_json method in the model
    return jsonify({'checkouts': json_checkouts})
@app.route('/getcheckout/<int:id>', methods=['GET'])
def get_checkout_by_id(id):
    checkout = Checkout.query.get(id)

    if not checkout:
        return jsonify({'message': 'checkout with that id not found'}), 404
    
    json_checkout = checkout.to_json()

    return jsonify({'checkout:': json_checkout}), 201
@app.route('/addcheckout', methods=['POST'])
def add_checkout():
    date = request.json.get('date')
    email = request.json.get('email')
    book_id = request.json.get('bookID')

    if not date or not email or not book_id:
        return jsonify({'message': 'date, email, and bookID are required when creating a checkout object'}), 400
    
    try:
        # Check if the book exists
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'message': 'Book not found'}), 404

        # Create a new Checkout instance
        new_checkout = Checkout(date=date, email=email, bookID=book_id)
        db.session.add(new_checkout)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
    return jsonify({'message': 'checkout successfully added'}), 201
@app.route('/toggleresolved/<int:id>', methods=['PATCH']) #automatically resolves checkout when the endpoint is hit with id
def toggle_resolved(id):
    checkout = Checkout.query.get(id) #query object where object_id == id

    if not checkout: #if the checkout was not found by id
        return jsonify({'message': 'no checkout found with that id'}), 404

    checkout.resolved = not checkout.resolved #toggle resolved, deafult=False

    db.session.commit()

    return jsonify({'message': 'toggled resolved field successfully'}), 200

#######################################################################################################################

#App
if __name__ == '__main__': #only execute if using main.py
    with app.app_context():
        db.create_all() #create db if doesnt exist

    app.run(debug=True)