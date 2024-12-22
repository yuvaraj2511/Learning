import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios"; // Import axios for making API requests
import "./ProductCard.css";

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: product.title,
    brand: product.brand,
    price: product.price,
    discountedPrice: product.discountedPrice,
    discountPercent: product.discountPercent,
    imageUrl: product.imageUrl,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle product update (PUT request)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Make PUT request to update the product
    axios
      .put(`http://localhost:8080/api/products/${product.id}`, formData)
      .then((response) => {
        if (onUpdate && typeof onUpdate === "function") {
          onUpdate(response.data); // Call parent method to update product list
        }
        setIsEditPopupOpen(false); // Close the popup
      })
      .catch((error) => {
        console.error("There was an error updating the product:", error);
      });
  };

  // Handle cancel action in edit popup
  const handleCancel = () => {
    setIsEditPopupOpen(false); // Close the popup without saving changes
  };

  // Handle delete confirmation (DELETE request)
  const handleDeleteConfirm = () => {
    // Make DELETE request to delete the product
    axios
      .delete(`http://localhost:8080/api/products/${product.id}`)
      .then(() => {
        if (onDelete && typeof onDelete === "function") {
          onDelete(product.id); // Call parent method to remove product from list
        }
        setIsDeletePopupOpen(false); // Close delete confirmation popup
      })
      .catch((error) => {
        console.error("There was an error deleting the product:", error);
      });
  };

  // Handle cancel action in delete confirmation popup
  const handleDeleteCancel = () => {
    setIsDeletePopupOpen(false); // Close delete confirmation popup
  };

  return (
    <div className="productCard">
      <div className="imageContainer">
        <img className="productImage" src={product.imageUrl} alt={product.title} />
      </div>
      <div className="textPart">
        <div>
          <p className="brandName">{product.brand}</p>
          <p className="productTitle">{product.title}</p>
        </div>
        <div className="priceSection">
          <p className="discountedPrice">₹{product.discountedPrice}</p>
          <p className="originalPrice">₹{product.price}</p>
          <p className="discountPercent">{product.discountPercent}% off</p>
        </div>
      </div>

      <div className="actionButtons">
        <button className="editButton" onClick={() => setIsEditPopupOpen(true)}>
          <FaEdit />
        </button>
        <button className="deleteButton" onClick={() => setIsDeletePopupOpen(true)}>
          <FaTrash />
        </button>
      </div>

      {/* Edit Popup */}
      {isEditPopupOpen && (
        <div className="popupOverlay">
          <div className="popupForm">
            <h2>Edit Product</h2>
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
                <button type="submit" className="submitBtn">Save</button>
                <button type="button" onClick={handleCancel} className="cancelBtn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="popupOverlay">
          <div className="popupForm">
            <h2>Are you sure you want to delete this product?</h2>
            <div className="popupActions">
              <button type="button" onClick={handleDeleteConfirm} className="submitBtn">
                Yes, Delete
              </button>
              <button type="button" onClick={handleDeleteCancel} className="cancelBtn">
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
