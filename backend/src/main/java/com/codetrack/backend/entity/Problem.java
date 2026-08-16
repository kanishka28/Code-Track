package com.codetrack.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "neetcode150")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean neetcode150;

    private Boolean blind75;

    private String problem;

    private String pattern;

    private String link;

    private String video;

    private String difficulty;

    private Boolean python;

    private Boolean java;

    private Boolean cpp;

    private Boolean javascript;

    private String code;

    @Column(name = "c")
    private Boolean c;

    private Boolean csharp;

    private Boolean typescript;

    private Boolean go;

    private Boolean ruby;

    private Boolean swift;

    private Boolean kotlin;

    private Boolean rust;

    private Boolean scala;

    private Boolean dart;

    private String premium;

    @Column(name = "freelink")
    private String freeLink;

    public Problem() {
    }

    public Long getId() {
        return id;
    }

    public Boolean getNeetcode150() {
        return neetcode150;
    }

    public Boolean getBlind75() {
        return blind75;
    }

    public String getProblem() {
        return problem;
    }

    public String getPattern() {
        return pattern;
    }

    public String getLink() {
        return link;
    }

    public String getVideo() {
        return video;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public Boolean getPython() {
        return python;
    }

    public Boolean getJava() {
        return java;
    }

    public Boolean getCpp() {
        return cpp;
    }

    public Boolean getJavascript() {
        return javascript;
    }

    public String getCode() {
        return code;
    }

    public Boolean getC() {
        return c;
    }

    public Boolean getCsharp() {
        return csharp;
    }

    public Boolean getTypescript() {
        return typescript;
    }

    public Boolean getGo() {
        return go;
    }

    public Boolean getRuby() {
        return ruby;
    }

    public Boolean getSwift() {
        return swift;
    }

    public Boolean getKotlin() {
        return kotlin;
    }

    public Boolean getRust() {
        return rust;
    }

    public Boolean getScala() {
        return scala;
    }

    public Boolean getDart() {
        return dart;
    }

    public String getPremium() {
        return premium;
    }

    public String getFreeLink() {
        return freeLink;
    }
}