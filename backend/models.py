# Tables:
#     -Book:
#         -id (pk)
#         -title
#         -author
#         -description
#         -coverURL
#         -deleted
#         -condition
#         -datePublished
#         -dateAdded
#         -salePrice
#     -Checkout:
#         -id (pk)
#         -date
#         -email
#     -Admin:
#         -id (pk)
#         -username (unique)
#         -password
#         -firstname
#         -lastname
#         -employeeID (unique)

from config import db
from sqlalchemy.orm import relationship

#Book Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    coverURL = db.Column(db.Text, nullable=False) #on the fontend, pass a sentinel value to indicate if there is no cover: 'none'
    deleted = db.Column(db.Boolean, default=False)
    condition = db.Column(db.String(255), nullable=False)
    datePublished = db.Column(db.String(255), nullable=False) #even if date is unknown, have to put something like n/a
    dateAdded = db.Column(db.String(255), nullable=False) #current DateTime
    salePrice = db.Column(db.Float, nullable=False)

    # Define relationship to Checkout
    checkouts = relationship("Checkout", back_populates="book")

    def to_json(self): #jsonify the python object for api
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "coverURL": self.coverURL,
            "deleted": self.deleted,
            "condition": self.condition,
            "datePublished": self.datePublished,
            "dateAdded": self.dateAdded,
            "salePrice": self.salePrice,
        }

#Admin Model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    employeeID = db.Column(db.String(4), nullable=False)

    def to_json(self): #jsonify the python object for api
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "employeeID": self.employeeID,
        }

#Checkout Model
class Checkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(255), nullable=False) #current DateTime
    email = db.Column(db.String(255), nullable=False)

    # Define relationship to Book
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    book = relationship("Book", back_populates="checkouts")

    def to_json(self): #jsonify the python object for api
        return {
            "id": self.id,
            "date": self.date,
            "email": self.email,
        }