import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "axios"; // Import axios
import "./Product.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    imageUrl: "",
  });

  // Fetch products from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle the form submission (POST new product)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send new product data to backend
    axios
      .post("http://localhost:8080/api/products", formData)
      .then((response) => {
        // Update products list by fetching updated data from the backend
        setProducts((prevProducts) => [...prevProducts, response.data]);
        setIsPopupOpen(false); // Close popup after submission
      })
      .catch((error) => {
        console.error("There was an error adding the product!", error);
      });
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    setIsPopupOpen(false); // Close popup without submitting
  };

  // Function to handle updating product
  const handleUpdateProduct = (updatedProduct) => {
    // Send updated data to backend
    axios
      .put(
        `http://localhost:8080/api/products/${updatedProduct.id}`,
        updatedProduct
      )
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the product:", error);
      });
  };

  // Function to handle deleting a product
  const handleDeleteProduct = (productId) => {
    // Send delete request to backend
    axios
      .delete(`http://localhost:8080/api/products/${productId}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the product:", error);
      });
  };

  return (
    <div className="productPage">
      <div>
        <main className="mainContent">
          <section
            aria-labelledby="products-heading"
            className="productSection"
          >
            <div className="gridContainer">
              <div className="productListContainer">
                <div>
                  <div className="headerSection">
                    <h1 className="pageTitle">Products</h1>
                  </div>
                  <button
                    className="addToCartBtnTop"
                    onClick={() => setIsPopupOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="plusIcon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16M4 12h16"
                      />
                    </svg>
                    Add New Product
                  </button>
                </div>

                <div className="productGrid">
                  {products.length > 0 ? (
                    products.map((item) => {
                      return (
                        <ProductCard
                          key={item.id}
                          product={item}
                          onUpdate={handleUpdateProduct} // Pass onUpdate handler
                          onDelete={handleDeleteProduct} // Pass onDelete handler
                        />
                      );
                    })
                  ) : (
                    <p className="noProductsMessage">No products available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {isPopupOpen && (
        <div className="popupOverlay">
          <div className="popupForm">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Brand:</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Discounted Price:</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Discount Percentage:</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="popupActions">
                <button type="submit" className="submitBtn">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancelBtn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
