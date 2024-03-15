# Endpoints (data):
#     -Admin:
#         -Add Admin: '.../addadmin'
#         -Edit Admin: '.../editadmin'
#         -Delete Admin: '.../deleteadmin'

#     -Book:
#         -Get All Books: '.../admin/books'
#         -Get Book by ID: '.../admin/addbook/<int:id>'
#         -Add Book: '.../admin/addbook'
#         -Delete Book: '.../admin/deletebook'
#         -Edit Book: '.../admin/editbook'
        
#     Checkout:
#         -Get All Checkouts: '.../checkouts'
#         -Get Checkout by ID: '.../checkouts/<int:id>'

from flask import request, jsonify
from config import app, db
from models import Book, Admin, Checkout

#Book Data Routes
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all() # Get all books from the database
    json_books = [book.to_json() for book in books] # Convert books to JSON using the to_json method in the model
    return jsonify({'books': json_books})
@app.route('/addbook', methods=['POST'])
def add_book():
    title = request.json.get('title')
    author = request.json.get('author')
    description = request.json.get('description')
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
    if not title or not author or not description or not coverURL or not condition or not datePublished or not dateAdded or not salePrice:
        return (jsonify({'failed trying to add book:': addBook}), 400,)
    
    newBook = Book(title=title, author=author, description=description, coverURL=coverURL, deleted=deleted, condition=condition, datePublished=datePublished, dateAdded=dateAdded, salePrice=salePrice)

    try:
        db.session.add(newBook)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400 #error committing book to db
    
    return jsonify({'message': 'book added'}), 201 #success message

#Admin Data Routes
@app.route('/admins', methods=['GET'])
def get_admins():
    admins = Admin.query.all() # Get all books from the database
    json_admins = [admin.to_json() for admin in admins] # Convert books to JSON using the to_json method in the model
    return jsonify({'admins': json_admins})

#Checkout Data Routes
@app.route('/checkouts', methods=['GET'])
def get_checkouts():
    checkouts = Checkout.query.all() # Get all books from the database
    json_checkouts = [checkout.to_json() for checkout in checkouts] # Convert books to JSON using the to_json method in the model
    return jsonify({'checkouts': json_checkouts})

if __name__ == '__main__': #only execute if using main.py
    with app.app_context():
        db.create_all() #create db if doesnt exist

    app.run(debug=True)