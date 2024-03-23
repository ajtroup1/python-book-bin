# python-book-bin

LOG INTO ADMIN WITH:
-Username: admin
-Password: password

Packages:
-flask
-flask sql alchemy
-flask cors
-react

Where I left off last session:
-did filters for admin

Pages:
-Guest:
-Home
-Checkout
-Recipt
-Admin:
-Home
-Add Book (maybe not separate page, but modal)
-Edit Book (same as above, maybe modal same form)

Tables:
-Book:
-id (pk)
-title
-author
-description
-genre
-coverURL
-deleted
-condition
-datePublished
-dateAdded
-salePrice
-Checkout:
-id (pk)
-date
-email
-Admin:
-id (pk)
-username (unique)
-password
-firstname
-lastname
-employeeID (unique)

Endpoints (data):
-Admin:
-Get All Admins '.../admins'
-Add Admin: '.../addadmin'
-Edit Admin: '.../editadmin/<int:id>'
-Delete Admin: '.../deleteadmin/<int:id>'

    -Book:
        -Get All Books: '.../admin/books'
        -Get Book by ID: '.../admin/addbook/<int:id>'
        -Add Book: '.../admin/addbook'
        -Delete Book: '.../admin/deletebook/<int:id>'
        -Edit Book: '.../admin/editbook/<int:id>'

    Checkout:
        -Get All Checkouts: '.../checkouts'
        -Get Checkout by ID: '.../checkouts/<int:id>'

Pages:
-Customer:
-Home
-Checkout
-Recipt
Admin:
-Login
-Home

My navbar needs:
-Admin login button
-Home Link
-Collections Link
