package com.himanshu.vyapar.Repo;

import com.himanshu.vyapar.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    @Query("SELECT p FROM Payment p WHERE p.party.id = ?1")
    List<Payment> findByPartyId(Long partyId);
}
