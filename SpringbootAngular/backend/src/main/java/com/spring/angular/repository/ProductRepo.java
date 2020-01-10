package com.spring.angular.repository;

import com.spring.angular.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long>, ProductCustomRepo {
}
