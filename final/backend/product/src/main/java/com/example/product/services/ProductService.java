package com.example.product.services;


import com.example.product.dto.ProductRequestDTO;
import com.example.product.dto.ProductResponseDTO;
import com.example.product.entity.Product;
import com.example.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        return convertToResponseDTO(product);
    }

    public ProductResponseDTO addProduct(ProductRequestDTO productRequestDTO) {
        Product product = new Product();
        product.setTitle(productRequestDTO.getTitle());
        product.setBrand(productRequestDTO.getBrand());
        product.setPrice(productRequestDTO.getPrice());
        product.setDiscountedPrice(productRequestDTO.getDiscountedPrice());
        product.setDiscountPercent(productRequestDTO.getDiscountPercent());
        product.setImageUrl(productRequestDTO.getImageUrl());

        productRepository.save(product);
        return convertToResponseDTO(product);
    }

    public ProductResponseDTO updateProduct(ProductRequestDTO productRequestDTO, Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with id " + id);
        }

        Product existingProduct = optionalProduct.get();
        existingProduct.setTitle(productRequestDTO.getTitle());
        existingProduct.setBrand(productRequestDTO.getBrand());
        existingProduct.setPrice(productRequestDTO.getPrice());
        existingProduct.setDiscountedPrice(productRequestDTO.getDiscountedPrice());
        existingProduct.setDiscountPercent(productRequestDTO.getDiscountPercent());
        existingProduct.setImageUrl(productRequestDTO.getImageUrl());

        productRepository.save(existingProduct);
        return convertToResponseDTO(existingProduct);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductResponseDTO convertToResponseDTO(Product product) {
        ProductResponseDTO responseDTO = new ProductResponseDTO();
        responseDTO.setId(product.getId());
        responseDTO.setTitle(product.getTitle());
        responseDTO.setBrand(product.getBrand());
        responseDTO.setPrice(product.getPrice());
        responseDTO.setDiscountedPrice(product.getDiscountedPrice());
        responseDTO.setDiscountPercent(product.getDiscountPercent());
        responseDTO.setImageUrl(product.getImageUrl());
        return responseDTO;
    }
}