package com.himanshu.vyapar.Controller;

import com.himanshu.vyapar.Model.Invoice;
import com.himanshu.vyapar.Repo.InvoiceRepository;
import com.himanshu.vyapar.Service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin("*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InvoiceRepository invoiceRepository;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice){
        Invoice saved = invoiceRepository.save(invoice);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Invoice> getInvoice(){
        return invoiceService.getAllInvoice();
    }
    @GetMapping("/next-number")
    public ResponseEntity<String> getNextInvoiceNumber(){
        Integer max = invoiceRepository.findMaxInvoiceNumber();
        int next = (max != null ? max : 1000) + 1;
        String nextNumber = "INV-" + String.format("%05d", next);
        return ResponseEntity.ok(nextNumber);
    }

//    @GetMapping("/invoices/by-party/{partyId}")
//    public List<Invoice> getInvoicesByParty(@PathVariable Long partyId) {
//        return invoiceService.getInvoicesByParty(partyId);
//    }
@GetMapping("/by-party/{partyId}")
public List<Invoice> getInvoicesByParty(@PathVariable Long partyId) {
    return invoiceService.getInvoicesByParty(partyId);
}

    @GetMapping("/last-price/{partyId}/{productId}")
    public ResponseEntity<Double> getLastSalePrice(@PathVariable Long partyId, @PathVariable Long productId) {
        Double lastPrice = invoiceService.getLastSalePrice(partyId, productId);
        if (lastPrice != null) {
            return ResponseEntity.ok(lastPrice);
        }
        else {
            return ResponseEntity.ok(0.0); // Return 0 if no previous sale
        }
    }

    //ye api hum print ke liye bna rhe h
    @GetMapping("/{invoiceId}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/filter")
    public List<Invoice> getInvoicesByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        return invoiceRepository.findByDateBetween(startDateTime, endDateTime);
    }


//    @DeleteMapping("/{id}")
//    public void deleteParty(@PathVariable Long id){
//        partyService.deleteParty(id);
//    }
    @DeleteMapping("/{id}")
    public void deleteInvoice(@PathVariable Long id){
        invoiceService.deleteInvoice(id);
    }
}
