package com.himanshu.vyapar.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
//@RequestMapping("")
public class pageController {

    @GetMapping("/")
    public String homePage(){
        System.out.println("Home page called");
        return "homePage";
    }
    @GetMapping("/addParty")
    public String addPartyPage(){
        System.out.println("party page called");
        return "addParty";
    }
    @GetMapping("/addProduct")
    public String addProductPage(){
        System.out.println("product page called");
        return "addProduct";
    }
    @GetMapping("/invoice")
    public String InvoicePage(){
        System.out.println("Invoice page called");
        return "invoice";
    }
    @GetMapping("/invoiceList")
    public String InvoiceListPage(){
        System.out.println("Invoice List page called");
        return "invoiceList";
    }
    @GetMapping("/invoicePrint")
    public String InvoicePrintPage(){
        System.out.println("InvoicePrint List page called");
        return "invoicePrint";
    }
    @GetMapping("/partyLedger")
    public String PartyLedgerPage(){
        System.out.println("PartyLedger page called");
        return "partyLedger";
    }

    @GetMapping("/payment")
    public String PaymentSectionPage(){
        System.out.println("Payment Page called");
        return "payment";
    }
    @GetMapping("/viewParty")
    public String ViewPartyPage(){
        System.out.println("viewParty Page called");
        return "viewParty";
    }
    @GetMapping("/viewProducts")
    public String ViewProductsPage(){
        System.out.println("viewProducts Page called");
        return "viewProducts";
    }

    @GetMapping("/homePage")
    public String HomePage(){
        System.out.println("viewProducts Page called");
        return "homePage";
    }
}
