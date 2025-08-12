package com.himanshu.vyapar.Controller;

import com.himanshu.vyapar.Model.Party;
import com.himanshu.vyapar.Model.Product;
import com.himanshu.vyapar.Repo.PartyRepository;
import com.himanshu.vyapar.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private PartyRepository partyRepository;

    @GetMapping
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product)
    {
        System.out.println("Saved: Party is " + (product.getParty() != null ? product.getParty().getName() : "null"));
        Product saved = productService.addProduct(product);
        System.out.println("Saved: Party is " + (saved.getParty() != null ? saved.getParty().getName() : "null"));
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct){
        return productService.updateProduct(id,updatedProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }

}
