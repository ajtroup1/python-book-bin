import { useState, useEffect } from "react";
import "../css/AdminHome.css";

function AdminHome() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/books");
      const data = await response.json();
      setBooks(data.books);
      console.log("Books received:", data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <>
      <div>
        <table className="table" id="books-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Cover</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>
                  <img src={book.coverURL} className="cover-img"></img>
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
    </>
  );
}

export default AdminHome;
