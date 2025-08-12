package com.himanshu.vyapar.Controller;

import com.himanshu.vyapar.Model.Party;
import com.himanshu.vyapar.Service.PartyService;
import jakarta.servlet.http.Part;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.query.PartTreeJpaQuery;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
@CrossOrigin(origins = "*")
public class PartyController {

    @Autowired
    private PartyService partyService;

    @GetMapping
    public List<Party> getAllParties(){
        return partyService.getAllParties();
    }
    @PostMapping
    public Party addParty(@RequestBody Party party){
        return partyService.addParty(party);
    }

    @DeleteMapping("/{id}")
    public void deleteParty(@PathVariable Long id){
        partyService.deleteParty(id);
    }
    @PutMapping("/{id}")
    public Party updateParty(@PathVariable Long id, @RequestBody Party party){
        return partyService.updateParty(id,party);
    }
    @PatchMapping("/{id}/block")
    public Party toggleBlockParty(@PathVariable Long id){
        return partyService.toggleBlockParty(id);
    }
}
