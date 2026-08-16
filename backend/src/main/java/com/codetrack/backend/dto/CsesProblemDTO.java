package com.codetrack.backend.dto;

public class CsesProblemDTO {

    private Integer rank;
    private Integer id;
    private String title;
    private String category;
    private String url;

    public CsesProblemDTO(
            Integer rank,
            Integer id,
            String title,
            String category,
            String url
    ) {
        this.rank = rank;
        this.id = id;
        this.title = title;
        this.category = category;
        this.url = url;
    }

    public Integer getRank() {
        return rank;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public String getUrl() {
        return url;
    }
}