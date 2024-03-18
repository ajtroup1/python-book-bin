import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const [newAdditions, setNewAdditions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/books");
      const data = await response.json();
      setBooks(data.books);
      console.log("Books received:", data.books);
      handleNewAdditions(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleNewAdditions = (books) => {
    const sortedBooks = books.slice().sort((a, b) => {
      return b.id - a.id; //realistically, use dateAdded here, but this isnt real
    }); 
    const recentBooks = sortedBooks.slice(0, 6);
    setNewAdditions(recentBooks);
  };

  const handleGenreFilter = (genre) => {
    const filterOptions = {
      type: "genre",
      searchID: genre,
    };
    localStorage.setItem("filterOptions", JSON.stringify(filterOptions));
    navigate("/books-list");
  };

  const handleSearch = () => {
    const searchID = document.getElementById("search-book").value;
    const filterOptions = {
      type: "search",
      searchID: searchID,
    };
    localStorage.setItem("filterOptions", JSON.stringify(filterOptions));
    navigate("/books-list");
  };

  const handleCheckout = (id) => {
    //
  };
  return (
    <>
      {/* NAVBAR FOR GENRES AND SEARCH BAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="navbar-nav mr-auto d-flex justify-content-between"
            id="filter-items"
          >
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("Nonfiction")}
              >
                Nonfiction
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("Action")}
              >
                Action
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("Sci-Fi")}
              >
                Sci-Fi
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("Fantasy")}
              >
                Fantasy
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("History")}
              >
                History
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("True Crime")}
              >
                True Crime
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => handleGenreFilter("Business")}
              >
                Business
              </a>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              id="search-book"
              placeholder="Search"
              aria-label="Search"
              autoComplete="off"
            ></input>
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      {/* WELCOME BANNER */}
      <div className="banner-container">
        <div className="background-img">
          <div className="text-overlay">
            <h1>The Book Bin</h1>
            <p>We rent books!</p>
            <p>Tuscaloosa, AL</p>
          </div>
        </div>
      </div>

      {/* NEW ADDITIONS ROW */}
      <div className="new-additions-container">
        <h2>
          New Additions
          <img
            src="./src/images/new-icon.png"
            style={{ height: "40px", width: "auto", marginLeft: "10px" }}
          ></img>
        </h2>

        {newAdditions.map((book, index) => (
          <div key={index} className="book-card">
            <img
              src={book.coverURL}
              alt={book.title}
              className="book-cover"
              onClick={handleCheckout(book.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
