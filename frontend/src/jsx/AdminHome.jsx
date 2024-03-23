import { useState, useEffect } from "react";
import "../css/AdminHome.css";

function AdminHome() {
  //Arrays
  const [books, setBooks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  //When editing book
  const [editBook, setEditBook] = useState({});
  //Modal stuff
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("");
  //Book fields for POST / PATCH
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [condition, setCondition] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [salePrice, setSalePrice] = useState("");
  //Admin fields for POST (no PATCH)
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [employeeID, setEmployeeID] = useState(-1);

  useEffect(() => {
    fetchBooks();
    fetchAdmins();
  }, []);
  useEffect(() => {
    console.log("current mode: ", mode);
    if (
      mode === "addbook" ||
      mode === "editbook" ||
      mode === "deletedbooks" ||
      mode === "booklookup" ||
      mode === "adminmanager" ||
      mode === "addadmin" ||
      mode === "showmore"
    ) {
      setIsModalOpen(true);
    }
  }, [mode]);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/books");
      const data = await response.json();
      setBooks(data.books);
      const genres = [...new Set(data.books.map((book) => book.genre))];
      setUniqueGenres(genres);
      console.log("Books received:", data.books);
      console.log("Unique genres: ", uniqueGenres);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/admins");
      const data = await response.json();
      setAdmins(data.admins);
      console.log("Admins received:", data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const onSubmitAdd = async (e) => {
    let conditionToSend = condition;
    if (!condition || condition.trim() === "") {
      conditionToSend = "New";
    }
    const data = {
      title,
      author,
      description,
      genre,
      coverURL,
      condition: conditionToSend,
      datePublished,
      salePrice,
    };
    console.log("posting book: ", data);
    const url = "http://127.0.0.1:5000/addbook";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert("Book added successfully!");
    }
  };

  const onSubmitAddAdmin = async (e) => {
    e.preventDefault();
    if (password != confPassword) {
      alert("Passwords must match");
      document.getElementById("password").value = "";
      document.getElementById("confpassword").value = "";
      return 0;
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters");
      document.getElementById("password").value = "";
      document.getElementById("confpassword").value = "";
      return 0;
    } else if (username.length < 4) {
      alert("Username must be at least 4 characters");
      document.getElementById("username").value = "";
      return 0;
    } else if (employeeID.length != 4) {
      alert("Employee ID is a 4 unique character string");
      document.getElementById("empid").value = "";
      return 0;
    }
    const data = {
      username,
      password,
      firstname,
      lastname,
      role,
      employeeID,
    };
    if (
      username == null ||
      password == null ||
      firstname == null ||
      lastname == null ||
      role == null ||
      employeeID == null
    ) {
      alert("All fields are required to add an admin");
      return 0;
    }
    console.log("posting admin: ", data);
    const url = "http://127.0.0.1:5000/addadmin";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert("Admin added successfully!");
      closeModal();
    }
  };

  const onSubmitEdit = async (e) => {
    const data = editBook;
    console.log("editing id: ", editBook.id);
    console.log("editing book: ", data);
    const url = "http://127.0.0.1:5000/editbook/" + editBook.id;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert("Book edited successfully!");
    }
  };

  const handleDelete = async (deleteid, delorrest) => {
    const url = "http://127.0.0.1:5000/deletebook/" + deleteid;

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      if (delorrest == "del") {
        alert("Book deleted successfully!");
      }
      if (delorrest == "rest") {
        alert("Book restored successfully!");
      }
      fetchBooks();
    }
  };

  const handleEdit = (passedBook) => {
    setEditBook(passedBook);
    handlePopulateModal("editbook");
  };

  const handleFilter = async (passedFilter, search) => {
    await fetchBooks();
    console.log("filtering by ", passedFilter, ", searchVal = ", search);
    if (passedFilter === "checkedout") {
      document.getElementById("notcheckedout").checked = false;
      if (!document.getElementById("checkedout").checked) {
        return 0;
      } else {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.isCheckedOut === true)
        );
      }
    } else if (passedFilter === "notcheckedout") {
      document.getElementById("checkedout").checked = false;
      if (!document.getElementById("notcheckedout").checked) {
        return 0;
      } else {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.isCheckedOut === false)
        );
      }
    } else if (passedFilter === "genre") {
      const selectedGenre = document.getElementById("genres-filter").value;
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.genre === selectedGenre)
      );
    } else if (passedFilter === "title") {
      setBooks((prevBooks) =>
        prevBooks.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else if (passedFilter === "author") {
      setBooks((prevBooks) =>
        prevBooks.filter((book) =>
          book.author.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else if (passedFilter === "price") {
      if (search === "ascending") {
        document.getElementById("descending").checked = false;
        setBooks((prevBooks) =>
          prevBooks.slice().sort((a, b) => a.salePrice - b.salePrice)
        );
      } else if (search === "descending") {
        document.getElementById("ascending").checked = false;
        setBooks((prevBooks) =>
          prevBooks.slice().sort((a, b) => b.salePrice - a.salePrice)
        );
      }
    }
  };

  const resetFilters = () => {
    // Uncheck all checkboxes
    document.getElementById("checkedout").checked = false;
    document.getElementById("notcheckedout").checked = false;
    document
      .querySelectorAll('.form-check-input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Reset genre filter to default option
    const genresFilter = document.getElementById("genres-filter");
    genresFilter.selectedIndex = 0;

    // Clear search inputs
    document.getElementById("name-search-book").value = "";
    document.getElementById("author-search-book").value = "";

    // Reset price sorting checkboxes
    document.getElementById("ascending").checked = false;
    document.getElementById("descending").checked = false;

    // Call handleFilter with empty values to reset books to default state
    handleFilter("", "");

    fetchBooks();
  };

  const handleDeleteAdmin = async (deleteid) => {
    // Ask for confirmation
    const confirmed = confirm(
      "Are you sure you want to delete this admin? Deletion is permanent!"
    );

    // If user confirms, proceed with deletion
    if (confirmed) {
      const url = "http://127.0.0.1:5000/deleteadmin/" + deleteid;

      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert("Admin deleted successfully!");
        fetchAdmins();
      }
    }
  };

  const handlePopulateModal = (populatewith) => {
    setMode(populatewith);
    console.log("current mode: ", mode);

    if (
      populatewith === "addbook" ||
      populatewith === "editbook" ||
      populatewith === "deletedbooks" ||
      populatewith === "adminmanager" ||
      populatewith === "addadmin" ||
      populatewith === "showmore"
    ) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ADMIN FUNCTION TASKBAR */}
      <div className="admin-taskbar">
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
                  onClick={() => handlePopulateModal("addbook")}
                >
                  Add A Book
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => handlePopulateModal("deletedbooks")}
                >
                  Deleted Books
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={() => handlePopulateModal("adminmanager")}
                >
                  Admin Manager
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div id="modal">
          <div id="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <br />
            <br />
            {/* ADD MODAL */}
            {mode === "addbook" && (
              <form onSubmit={onSubmitAdd}>
                <h4 className="create-title">Add New Book</h4>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    placeholder="Enter author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoComplete="off"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="genre"
                      list="genreOptions"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                    <datalist id="genreOptions">
                      {uniqueGenres.map((uniqueGenre, index) => (
                        <option key={index} value={uniqueGenre} />
                      ))}
                    </datalist>
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setGenre("")}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="coverURL">Cover URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="coverURL"
                    placeholder="Enter cover URL"
                    value={coverURL}
                    onChange={(e) => setCoverURL(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    className="form-control"
                    id="condition"
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Worn">Worn</option>
                    <option value="Poor">Poor</option>
                    <option value="Atrocious">Atrocious</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="datePublished">Date Published</label>
                  <input
                    type="text"
                    className="form-control"
                    id="datePublished"
                    placeholder="Enter date published"
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salesPrice">Sales Price</label>
                  <input
                    type="text"
                    className="form-control"
                    id="salesPrice"
                    placeholder="Enter sales price"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            {/* EDIT MODAL */}
            {mode === "editbook" && (
              <form onSubmit={onSubmitEdit}>
                <span className="create-title">Edit Book</span>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter title"
                    value={editBook.title}
                    onChange={(e) =>
                      setEditBook({ ...editBook, title: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    placeholder="Enter author"
                    value={editBook.author}
                    onChange={(e) =>
                      setEditBook({ ...editBook, author: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    placeholder="Enter description"
                    value={editBook.description}
                    onChange={(e) =>
                      setEditBook({ ...editBook, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="genre"
                    placeholder="Enter genre"
                    value={editBook.genre}
                    onChange={(e) =>
                      setEditBook({ ...editBook, genre: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="coverURL">Cover URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="coverURL"
                    placeholder="Enter cover URL"
                    value={editBook.coverURL}
                    onChange={(e) =>
                      setEditBook({ ...editBook, coverURL: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    className="form-control"
                    id="condition"
                    value={editBook.condition}
                    onChange={(e) =>
                      setEditBook({ ...editBook, condition: e.target.value })
                    }
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Worn">Worn</option>
                    <option value="Poor">Poor</option>
                    <option value="Atrocious">Atrocious</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="datePublished">Date Published</label>
                  <input
                    type="text"
                    className="form-control"
                    id="datePublished"
                    placeholder="Enter date published"
                    value={editBook.datePublished}
                    onChange={(e) =>
                      setEditBook({
                        ...editBook,
                        datePublished: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salesPrice">Sales Price</label>
                  <input
                    type="text"
                    className="form-control"
                    id="salesPrice"
                    placeholder="Enter sales price"
                    value={editBook.salePrice}
                    onChange={(e) =>
                      setEditBook({ ...editBook, salePrice: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            {/* ADMIN MANAGER MODAL */}
            {mode === "adminmanager" && (
              <>
                <h4 className="create-title">Admin Manager</h4>
                <div className="adminmanager-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Employee ID</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin, index) => (
                        <tr key={index}>
                          <td>{admin.username}</td>
                          <td>
                            {admin.firstname} {admin.lastname}
                          </td>
                          <td>{admin.role}</td>
                          <td>{admin.employeeID}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  className="btn btn-primary"
                  id="add-new-admin-btn"
                  onClick={() => handlePopulateModal("addadmin")}
                >
                  Add New Admin
                </button>
              </>
            )}
            {/* ADD ADMIN MODAL */}
            {mode === "addadmin" && (
              <form onSubmit={onSubmitAddAdmin}>
                <h4 className="create-title">Add New Admin</h4>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    onChange={(e) => setUserName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    placeholder="Enter first name"
                    onChange={(e) => setFirstname(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    placeholder="Enter last name"
                    onChange={(e) => setLastname(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    placeholder="Enter role"
                    onChange={(e) => setRole(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="empid">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="empid"
                    placeholder="Enter employee ID"
                    onChange={(e) => setEmployeeID(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confpassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confpassword"
                    placeholder="Confirm password"
                    onChange={(e) => setConfPassword(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            {/* DELETED BOOKS MODAL */}
            {mode === "deletedbooks" && (
              <>
                <h4 className="create-title">Deleted Books</h4>
                {/* admin manager container already has non-unique formatting */}
                <div className="adminmanager-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Genre</th>
                        <th>Cover</th>
                        <th>Restore</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books
                        .filter((book) => book.deleted)
                        .sort(
                          (a, b) =>
                            new Date(b.dateAdded) - new Date(a.dateAdded)
                        )
                        .map((book, index) => (
                          <tr key={index}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>
                              <img
                                src={book.coverURL}
                                className="deleted-cover-img"
                              />
                            </td>
                            <td>
                              {/* Call handle delete since it just toggles the deleted field */}
                              <button
                                className="btn btn-success"
                                onClick={() => handleDelete(book.id, "rest")}
                              >
                                Restore
                              </button>
                            </td>
                          </tr>
                        ))}
                      {/* SHOW MORE MODAL */}
                      {mode === "showmore" && (
                        <div>
                          <h4>Show More</h4>
                          <img src={editBook.coverURL} alt="Book cover" />
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FILTERS / SEARCH FOR TABLE */}
      <div className="filter-container">
        <h4 style={{ marginTop: "30px" }}>Filters</h4>
        <div className="filter-content">
          <form className="filter-form">
            <div className="checkbox-container">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkedout"
                  onChange={() => handleFilter("checkedout", "")}
                />
                <label className="form-check-label" htmlFor="checkedout">
                  Checked Out
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="notcheckedout"
                  onChange={() => handleFilter("notcheckedout", "")}
                />
                <label className="form-check-label" htmlFor="notcheckedout">
                  Not checked Out
                </label>
              </div>
            </div>
            <div className="form-group genres-group">
              <label htmlFor="genres-filter">Genres:</label>
              <select
                className="form-control"
                id="genres-filter"
                onChange={() => handleFilter("genre", "")}
              >
                {uniqueGenres.map((genre, index) => (
                  <option key={index}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="name-search-container">
              <input
                className="form-control name-search-input"
                type="search"
                id="name-search-book"
                placeholder="Search by book name"
                aria-label="Name Search"
                autoComplete="off"
              />
              <button
                className="btn btn-outline-success search-button"
                type="button"
                onClick={() =>
                  handleFilter(
                    "title",
                    document.getElementById("name-search-book").value
                  )
                }
              >
                Search
              </button>
            </div>
            <div className="author-search-container">
              <input
                className="form-control author-search-input"
                type="search"
                id="author-search-book"
                placeholder="Search by author name"
                aria-label="Author Search"
                autoComplete="off"
              />
              <button
                className="btn btn-outline-success search-button"
                type="button"
                onClick={() =>
                  handleFilter(
                    "author",
                    document.getElementById("author-search-book").value
                  )
                }
              >
                Search
              </button>
            </div>
            <div className="price-checkbox-container">
              <p className="text-center">Sort by Price:</p>
              <div className="form-check float-left">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="ascending"
                  onChange={() => handleFilter("price", "ascending")}
                />
                <label className="form-check-label" htmlFor="ascending">
                  Ascending
                </label>
              </div>
              <div className="form-check float-right">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="descending"
                  onChange={() => handleFilter("price", "descending")}
                />
                <label className="form-check-label" htmlFor="descending">
                  Descending
                </label>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger reset-filters"
              onClick={() => resetFilters()}
            >
              Reset Filters
            </button>
          </form>
        </div>
      </div>

      {/* BOOKS TABLE */}
      <div className="table-container">
        <table className="table" id="books-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Cover / Show More</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books
              .filter((book) => !book.deleted)
              .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
              .map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>
                    <img
                      src={book.coverURL}
                      className="cover-img"
                      onClick={() => {
                        setEditBook(book); //using edit book to pass one object only to show more
                        handlePopulateModal("showmore");
                      }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(book)}
                      type="button"
                      className="btn btn-primary"
                    >
                      Edit
                    </button>
                    <br />
                    <br />
                    <button
                      onClick={() => handleDelete(book.id, "del")}
                      type="button"
                      className="btn btn-danger"
                    >
                      Delete
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
