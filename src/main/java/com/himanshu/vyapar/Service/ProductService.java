package com.himanshu.vyapar.Service;

import com.himanshu.vyapar.Model.Product;
import com.himanshu.vyapar.Repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;


    public List<Product> getAllProduct(){
        return productRepository.findAll();
    }

    public Product addProduct(Product product){
        return productRepository.save(product);
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product updateProduct){
        Product product=productRepository.findById(id).orElseThrow();
        product.setName(updateProduct.getName());
        product.setDescription(updateProduct.getDescription());
        product.setPrice(updateProduct.getPrice());

        product.setParty(updateProduct.getParty());
        return productRepository.save(product);
    }

}
