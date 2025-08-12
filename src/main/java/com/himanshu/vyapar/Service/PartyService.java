package com.himanshu.vyapar.Service;

import com.himanshu.vyapar.Model.Party;
import com.himanshu.vyapar.Repo.PartyRepository;
import jakarta.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.OpAnd;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class PartyService {
    @Autowired
    private PartyRepository partyRepository;

    public List<Party> getAllParties(){
        return partyRepository.findAll();
    }
    public Party addParty(Party party){
        return partyRepository.save(party);
    }
    public void deleteParty(Long id){
        partyRepository.deleteById(id);
    }

    public Party updateParty(Long id, Party party) {
        Optional<Party> existingParty=partyRepository.findById(id);
        if(existingParty.isPresent()){
            Party updatedParty=existingParty.get();
            updatedParty.setName(party.getName());
            updatedParty.setType(party.getType());
            updatedParty.setPhone(party.getPhone());
            updatedParty.setEmail(party.getEmail());
            updatedParty.setAddress(party.getAddress());
            updatedParty.setBlockedStatus(party.getBlockedStatus());
            return partyRepository.save(updatedParty);
        }else {
            throw new RuntimeException("Party not found with id " + id);
        }
    }

    public Party toggleBlockParty(Long id) {
        Optional<Party> existingParty=partyRepository.findById(id);
        if(existingParty.isPresent()){
            Party party=existingParty.get();
            party.setBlockedStatus(party.getBlockedStatus());
            return partyRepository.save(party);
        } else {
            throw new RuntimeException("Party not found with id " + id);
        }
    }
}
