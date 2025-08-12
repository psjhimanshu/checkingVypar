package com.himanshu.vyapar.Service;

import com.himanshu.vyapar.Model.Payment;
import com.himanshu.vyapar.Repo.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPaymentReceipt(Payment payment){
        payment.setDateTime(LocalDateTime.now());

        Payment payment1=new Payment();
        payment1.setDateTime(LocalDateTime.now());
        payment1.setPaymentNumber(payment.getPaymentNumber());
        payment1.setParty(payment.getParty());
        payment1.setAmount(payment.getAmount());

        return paymentRepository.save(payment1);
    }

    public List<Payment> getAllPaymentReceipt(){
        return paymentRepository.findAll();
    }
}
