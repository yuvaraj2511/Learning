package com.example.product.repository;

import com.example.product.entity.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Product> productRowMapper = (rs, rowNum) -> {
        Product product = new Product();
        product.setId(rs.getLong("product_id"));
        product.setTitle(rs.getString("title"));
        product.setBrand(rs.getString("brand"));
        product.setPrice(rs.getDouble("price"));
        product.setDiscountedPrice(rs.getDouble("discounted_price"));
        product.setDiscountPercent(rs.getDouble("discount_percent"));
        product.setImageUrl(rs.getString("image_url"));
        return product;
    };

    public List<Product> findAll() {
        String sql = "SELECT * FROM product";
        return jdbcTemplate.query(sql, productRowMapper);
    }

    public Optional<Product> findById(Long id) {
        String sql = "SELECT * FROM product WHERE product_id = ?";
        List<Product> products = jdbcTemplate.query(sql, productRowMapper, id);
        return products.isEmpty() ? Optional.empty() : Optional.of(products.get(0));
    }

    public int save(Product product) {
        String sql;
        if (product.getId() == null) {
            sql = "INSERT INTO product (title, brand, price, discounted_price, discount_percent, image_url) VALUES (?, ?, ?, ?, ?, ?)";
            return jdbcTemplate.update(sql, product.getTitle(), product.getBrand(), product.getPrice(),
                    product.getDiscountedPrice(), product.getDiscountPercent(), product.getImageUrl());
        } else {
            sql = "UPDATE product SET title = ?, brand = ?, price = ?, discounted_price = ?, discount_percent = ?, image_url = ? WHERE product_id = ?";
            return jdbcTemplate.update(sql, product.getTitle(), product.getBrand(), product.getPrice(),
                    product.getDiscountedPrice(), product.getDiscountPercent(), product.getImageUrl(), product.getId());
        }
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM product WHERE product_id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
