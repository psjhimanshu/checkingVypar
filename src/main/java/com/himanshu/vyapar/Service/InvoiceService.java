package com.himanshu.vyapar.Service;

import com.himanshu.vyapar.Model.Invoice;
import com.himanshu.vyapar.Model.InvoiceItem;
import com.himanshu.vyapar.Repo.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;


    public Invoice createInvoice(Invoice invoice){


        invoice.setDate(LocalDateTime.now());

        Invoice invoice1=new Invoice();
        invoice1.setDate(LocalDateTime.now());
        invoice1.setParty(invoice.getParty());
        invoice1.setInvoiceNumber(invoice.getInvoiceNumber());
        invoice1.setTotalAmount(invoice.getTotalAmount());
        invoice1.setItems(invoice.getItems());
        System.out.println(invoice1.getDate());

        double total=0.0;
        for(InvoiceItem item: invoice1.getItems()){
            item.setDate(LocalDateTime.now());
            double itemTotal=item.getRate()*item.getQuantity();
            double tax=itemTotal*(item.getTaxRate()/100);
            item.setTotal(itemTotal+tax);
            item.setInvoice(invoice1);
            total += item.getTotal();
        }
        invoice1.setTotalAmount(total);
        return  invoiceRepository.save(invoice1);

    }

    public List<Invoice> getAllInvoice(){
        return invoiceRepository.findAll();
    }


    public List<Invoice> getInvoicesByParty(Long partyId) {
        return invoiceRepository.findByPartyId(partyId);
    }

    public Double getLastSalePrice(Long partyId, Long productId) {

        List<Invoice> invoices = invoiceRepository.findByPartyIdOrderByDateDesc(partyId);
        for (Invoice invoice : invoices) {
            for (InvoiceItem item : invoice.getItems()) {
                if (item.getProduct().getId().equals(productId)) {
                    return item.getRate();
                }
            }
        }
        return null; // No previous sale found
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
