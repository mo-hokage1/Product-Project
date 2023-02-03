import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  isDeleted: boolean;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<keyof Product>("title");
  const [category, setCategory] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [searchSubmit, setSearchSubmit] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [deleteValue, setDeleteValue] = useState<string>("");

  // Fetch and sort products data when searchSubmit or sortBy changes
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) =>
        setProducts(
          data.products.sort((a: Product, b: Product) => {
            let comparisonResult: number;
            if (sortBy === "price" || sortBy === "stock") {
              comparisonResult = a[sortBy] - b[sortBy];
            } else {
              comparisonResult = a[sortBy]
                .toString()
                .localeCompare(b[sortBy].toString());
            }
            return sortAscending ? comparisonResult : -comparisonResult;
          })
        )
      );
  }, [searchSubmit, sortBy, sortAscending]);

  // Fetch and sort searched products data when toggle or sortBy changes
  useEffect(() => {
    search &&
      fetch(`https://dummyjson.com/products/search?q=${search}`)
        .then((res) => res.json())
        .then((data) =>
          setSearchedProducts(
            data.products.sort((a: Product, b: Product) => {
              let comparisonResult: number;
              if (sortBy === "price" || sortBy === "stock") {
                comparisonResult = a[sortBy] - b[sortBy];
              } else {
                comparisonResult = a[sortBy]
                  .toString()
                  .localeCompare(b[sortBy].toString());
              }
              return sortAscending ? comparisonResult : -comparisonResult;
            })
          )
        );
  }, [toggle, sortBy, sortAscending]);

  // useEffect for deleting a product
  useEffect(() => {
    deleteValue &&
      fetch(`https://dummyjson.com/products/${deleteValue}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() =>
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== deleteValue)
          )
        )
        .then(() =>
          setSearchedProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== deleteValue)
          )
        );
  }, [deleteValue, sortBy, sortAscending]);

  // useEffect for filtering by category
  useEffect(() => {
    category !== ""
      ? fetch(`https://dummyjson.com/products/category/${category}`)
          .then((res) => res.json())
          .then((data) =>
            setProducts(
              data.products.sort((a: Product, b: Product) => {
                let comparisonResult: number;
                if (sortBy === "price" || sortBy === "stock") {
                  comparisonResult = a[sortBy] - b[sortBy];
                } else {
                  comparisonResult = a[sortBy]
                    .toString()
                    .localeCompare(b[sortBy].toString());
                }
                return sortAscending ? comparisonResult : -comparisonResult;
              })
            )
          )
      : fetch("https://dummyjson.com/products")
          .then((res) => res.json())
          .then((data) =>
            setProducts(
              data.products.sort((a: Product, b: Product) => {
                let comparisonResult: number;
                if (sortBy === "price" || sortBy === "stock") {
                  comparisonResult = a[sortBy] - b[sortBy];
                } else {
                  comparisonResult = a[sortBy]
                    .toString()
                    .localeCompare(b[sortBy].toString());
                }
                return sortAscending ? comparisonResult : -comparisonResult;
              })
            )
          );
  }, [category, sortBy, sortAscending]);

  // function to handle sorting based on selected value
  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as keyof Product);
    setSortAscending(true);
  };

  // function to handle filtering based on selected value
  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
    console.log(category);
  };

  // function to toggle the sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortAscending((prevSortAscending) => !prevSortAscending);
  };

  // function to handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      {/* main container for the Product List component */}
      <div className="title">Product List</div>
      <div className="hero">
        <div className="search">
          {/* search form */}
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              // if there is a value in search, setSearchSubmit to true and toggle the dropdown
              search && setSearchSubmit(true);
              search && toggle === false ? setToggle(true) : setToggle(false);
            }}
          >
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title.."
              onChange={handleSearch}
              value={search}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        <div className="sort">
          <div>
            <label htmlFor="sort-by">Sort By:</label>
          </div>
          {/* select element for sorting options */}
          <div>
            <select id="sort-by" value={sortBy} onChange={handleSort}>
              <option value="category">Category</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          <div>
            <button onClick={toggleSortOrder} className="toggleBtn">
              <i className="fa-solid fa-sort"></i>
            </button>
          </div>
        </div>
        <div className="sort">
          <div>
            <label htmlFor="sort-by">Filter By:</label>
          </div>
          {/* select element for filtering options */}
          <div>
            <select onChange={handleFilter} value={category}>
              <option value="" onClick={() => setSearchSubmit(false)}>
                All
              </option>
              {/* product categories */}
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="fragrances">Fragrances</option>
              <option value="skincare">Skincare</option>
              <option value="groceries">Groceries</option>
              <option value="home-decoration">Home Decoration</option>
              <option value="furniture">Furniture</option>
              <option value="tops">Tops</option>
              <option value="womens-dresses">Women's Dresses</option>
              <option value="womens-shoes">Women's Shoes</option>
              <option value="mens-shirts">Men's Shirts</option>
              <option value="mens-shoes">Men's Shoes</option>
              <option value="mens-watches">Men's Watches</option>
              <option value="womens-watches">Women's Watches</option>
              <option value="womens-bags">Women's Bags</option>
              <option value="womens-jewellery">Women's Jewellery</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="automotive">Automotive</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="lighting">Lighting</option>
            </select>

            {/* // clear button click event handler */}
            <button
              onClick={() => {
                // get the input element by its id
                const inputElement = document.getElementById(
                  "search"
                ) as HTMLInputElement;
                // clear the input value
                inputElement.value = "";
                setSearchSubmit(false);
                setCategory("");
                setSortBy("title");
              }}
              className="clearBtn"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      {/* // main component that displays the table */}
      <main>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {searchSubmit === true
              ? // map the searchedProducts and display each product in a table row
                searchedProducts.map((product) => {
                  // shortening the description if it's longer than 25 characters
                  const description =
                    product.description?.length > 25
                      ? `${product.description?.substring(0, 25)}...`
                      : product.description;
                  return (
                    <tr key={product.id}>
                      <td>{product.category}</td>
                      <td>{product.title}</td>
                      <td>{description}</td>
                      <td>{product.price}</td>
                      <td>{product.stock}</td>
                      <td
                        className="delete"
                        onClick={(p) => setDeleteValue(product.id)}
                      >
                        Delete
                      </td>
                    </tr>
                  );
                })
              : // map the products and display each product in a table row
                products.map((product) => {
                  // shortening the description if it's longer than 55 characters
                  const description =
                    product.description?.length > 55
                      ? `${product.description?.substring(0, 55)}...`
                      : product.description;
                  return (
                    // only display the product if it's not deleted
                    !product.isDeleted && (
                      <tr key={product.id}>
                        <td>{product.category}</td>
                        <td>{product.title}</td>
                        <td>{description}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td
                          className="delete"
                          onClick={(p) => setDeleteValue(product.id)}
                        >
                          Delete
                        </td>
                      </tr>
                    )
                  );
                })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ProductsPage;
