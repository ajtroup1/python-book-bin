from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__) #initializes flask app
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db' #locate sqlite db file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #dont track all modifications made to the database

db = SQLAlchemy(app) #create db instance for specified location & app