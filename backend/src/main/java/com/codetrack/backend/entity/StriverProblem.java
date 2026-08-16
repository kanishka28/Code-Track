package com.codetrack.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "striver_a2z")
public class StriverProblem {

    @Id
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "topic")
    private String topic;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "slug")
    private String slug;

    @Column(name = "article_url")
    private String articleUrl;

    @Column(name = "youtube_url")
    private String youtubeUrl;

    @Column(name = "leetcode_url")
    private String leetcodeUrl;

    public StriverProblem() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getTopic() {
        return topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getSlug() {
        return slug;
    }

    public String getArticleUrl() {
        return articleUrl;
    }

    public String getYoutubeUrl() {
        return youtubeUrl;
    }

    public String getLeetcodeUrl() {
        return leetcodeUrl;
    }
}