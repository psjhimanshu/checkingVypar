package com.himanshu.vyapar.Controller;

import com.himanshu.vyapar.Model.Payment;
import com.himanshu.vyapar.Repo.PaymentRepository;
import com.himanshu.vyapar.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {
@Autowired
private PaymentService paymentService;
@Autowired
private PaymentRepository paymentRepository;
@PostMapping
public Payment createPaymentReceipt(@RequestBody Payment payment){
    return paymentService.createPaymentReceipt(payment);
}
@GetMapping
public List<Payment> getAllPaymentReceipt(){
    return paymentService.getAllPaymentReceipt();
}

@GetMapping("/next-number")
public ResponseEntity<String> getNextPaymentNumber(){
    long count=paymentRepository.count()+1;
    String nextNumber="PMT-"+String.format("%05d",count);
    return ResponseEntity.ok(nextNumber);
}
    @GetMapping("/by-party/{partyId}")
    public List<Payment> getPaymentsByParty(@PathVariable Long partyId) {
        return paymentRepository.findByPartyId(partyId);
    }


}
