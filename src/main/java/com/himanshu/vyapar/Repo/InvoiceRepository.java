package com.himanshu.vyapar.Repo;

import com.himanshu.vyapar.Model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    @Query("SELECT MAX(CAST(SUBSTRING(i.invoiceNumber, 5) AS int)) FROM Invoice i")
    Integer findMaxInvoiceNumber();
    List<Invoice> findByPartyId(Long partyId);

    List<Invoice> findByPartyIdOrderByDateDesc(Long partyId);

    List<Invoice> findByDate(LocalDate date);
    List<Invoice> findByDateBetween(LocalDateTime start, LocalDateTime end);
}
