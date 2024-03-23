import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "../css/BooksList.css";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterVal, setFilterVal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [filterType, filterVal]);

  const fetchBooks = async () => {
    const response = await fetch("http://127.0.0.1:5000/books");
    const data = await response.json();
    const filteredBooks = filterBooks(data.books);
    setBooks(filteredBooks);
    console.log("books received: ", data.books);
    console.log("filtered books: ", filteredBooks);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = () => {
    const options = JSON.parse(localStorage.getItem("filterOptions")); //make sure to json parse the local storage items
    if (options) {
      const { type, searchID } = options;
      setFilterType(type);
      setFilterVal(searchID);
    }
  };

  const filterBooks = (passedBooks) => {
    if (filterType === "genre") {
      return passedBooks.filter((book) => book.genre === filterVal);
    } else if (filterType === "search") {
      return passedBooks.filter((book) =>
        book.title.toLowerCase().includes(filterVal.toLowerCase())
      );
    } else {
      return passedBooks;
    }
  };

  return (
    <>
      <div className="home-link">
        <Link to="/home"> Go Back </Link> {/* Link to the '/home' route */}
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="d-flex justify-content-center">
              <div className="table-container">
                <table className="table" id="books-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Author</th>
                      <th>Genre</th>
                      <th>Cover</th>
                      <th>Checkout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={index}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>
                          <img
                            src={book.coverURL}
                            className="cover-img"
                            alt={`Cover of ${book.title}`}
                          />
                        </td>
                        <td>
                          <button type="button" className="btn btn-primary">
                            Checkout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksList;
