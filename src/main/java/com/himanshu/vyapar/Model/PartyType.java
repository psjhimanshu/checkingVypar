package com.himanshu.vyapar.Model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PartyType {
    CUSTOMER,
    SUPPLIER,
    BOTH;
    @JsonCreator
    public static PartyType fromString(String value) {
        return PartyType.valueOf(value.toUpperCase());
    }
}
