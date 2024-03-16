import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Collections from "./Collections.jsx";
import AdminLogin from "./AdminLogin.jsx";
import "../css/Home.css";

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("http://127.0.0.1:5000/books");
    const data = await response.json();
    setBooks(data.books);
    console.log("books received: ", data.books);
  };

  return (
    <>
      
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

export default Home;
