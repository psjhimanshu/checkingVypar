package com.himanshu.vyapar.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    @ManyToOne
    @JsonBackReference
    private Invoice invoice;
    @ManyToOne
    private Product product;

    private int quantity;
    private double rate;
    private double taxRate;
    private double total;

    @Override
    public String toString() {
        return "InvoiceItem{" +
                "id=" + id +
                ", date=" + date +
                ", invoice=" + invoice +
                ", product=" + product +
                ", quantity=" + quantity +
                ", rate=" + rate +
                ", taxRate=" + taxRate +
                ", total=" + total +
                '}';
    }

    public InvoiceItem(Long id, LocalDateTime date, Invoice invoice, Product product, int quantity, double rate, double taxRate, double total) {
        this.id = id;
        this.date = date;
        this.invoice = invoice;
        this.product = product;
        this.quantity = quantity;
        this.rate = rate;
        this.taxRate = taxRate;
        this.total = total;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public double getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(double taxRate) {
        this.taxRate = taxRate;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
