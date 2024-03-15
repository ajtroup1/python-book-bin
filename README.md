# python-book-bin

Where I left off last session:
    -Made working POST for Books API
    -Made GET request for Books API

Pages:
    -Guest:
        -Home
        -Cart
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
        -Add Admin: '.../addadmin'
        -Edit Admin: '.../editadmin'
        -Delete Admin: '.../deleteadmin'

    -Book:
        -Get All Books: '.../admin/books'
        -Get Book by ID: '.../admin/addbook/<int:id>'
        -Add Book: '.../admin/addbook'
        -Delete Book: '.../admin/deletebook'
        -Edit Book: '.../admin/editbook'
        
    Checkout:
        -Get All Checkouts: '.../checkouts'
        -Get Checkout by ID: '.../checkouts/<int:id>'