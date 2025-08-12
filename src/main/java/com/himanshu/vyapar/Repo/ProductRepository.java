package com.himanshu.vyapar.Repo;


import com.himanshu.vyapar.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
