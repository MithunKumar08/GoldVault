package com.invest.gold.vault.entity;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse {

    private List<?> content;
    private String page;
    private String size;
    private String totalElements;
    private String totalPages;
    private boolean last;
}
