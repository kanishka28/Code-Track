package com.codetrack.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cses_problems")
public class CsesProblem {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "title")
    private String title;

    @Column(name = "category")
    private String category;

    @Column(name = "url")
    private String url;

    public CsesProblem() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getRank() {
        return rank;
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

    public void setId(Integer id) {
        this.id = id;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
