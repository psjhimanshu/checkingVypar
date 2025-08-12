package com.himanshu.vyapar.Controller;

import com.himanshu.vyapar.Model.Invoice;
import com.himanshu.vyapar.Repo.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/partyLedger")
@CrossOrigin
public class LedgerController {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping("/partyLedger/filter")
    public List<Invoice> filterLedger(
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(required = false) Double minDebit,
            @RequestParam(required = false) Double maxDebit,
            @RequestParam(required = false) Double minCredit,
            @RequestParam(required = false) Double maxCredit
    ) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        List<Invoice> invoices = invoiceRepository.findByDateBetween(startDate.atStartOfDay(), endDate.atStartOfDay());

        return invoices.stream()
                .filter(inv -> {
                    double debit = inv.getItems().stream().mapToDouble(i -> i.getRate() * i.getQuantity()).sum();
                    double credit = inv.getItems().stream().mapToDouble(i -> i.getRate() * i.getQuantity() * (1 + i.getTaxRate() / 100)).sum();

                    boolean debitOk = (minDebit == null || debit >= minDebit) &&
                            (maxDebit == null || debit <= maxDebit);
                    boolean creditOk = (minCredit == null || credit >= minCredit) &&
                            (maxCredit == null || credit <= maxCredit);

                    return debitOk && creditOk;
                })
                .collect(Collectors.toList());
    }

}
