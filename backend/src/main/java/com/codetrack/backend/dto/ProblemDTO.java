package com.codetrack.backend.dto;

import java.util.List;

public class ProblemDTO {

    private Long id;

    private String problem;

    private List<String> companies;

    private String difficulty;

    private String videoUrl;

    private String solveUrl;

    private boolean solved;

    private boolean revision;


    public ProblemDTO() {
    }


    public ProblemDTO(
            Long id,
            String problem,
            List<String> companies,
            String difficulty,
            String videoUrl,
            String solveUrl,
            boolean solved,
            boolean revision
    ) {

        this.id = id;
        this.problem = problem;
        this.companies = companies;
        this.difficulty = difficulty;
        this.videoUrl = videoUrl;
        this.solveUrl = solveUrl;
        this.solved = solved;
        this.revision = revision;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }


    public List<String> getCompanies() {
        return companies;
    }

    public void setCompanies(List<String> companies) {
        this.companies = companies;
    }


    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }


    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }


    public String getSolveUrl() {
        return solveUrl;
    }

    public void setSolveUrl(String solveUrl) {
        this.solveUrl = solveUrl;
    }


    public boolean isSolved() {
        return solved;
    }

    public void setSolved(boolean solved) {
        this.solved = solved;
    }


    public boolean isRevision() {
        return revision;
    }

    public void setRevision(boolean revision) {
        this.revision = revision;
    }
}