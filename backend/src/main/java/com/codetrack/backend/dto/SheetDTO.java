package com.codetrack.backend.dto;

public class SheetDTO {

    private String id;
    private String name;
    private String description;
    private String category;
    private String level;
    private int problemCount;

    public SheetDTO() {
    }

    public SheetDTO(
            String id,
            String name,
            String description,
            String category,
            String level,
            int problemCount
    ) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.level = level;
        this.problemCount = problemCount;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public int getProblemCount() {
        return problemCount;
    }

    public void setProblemCount(int problemCount) {
        this.problemCount = problemCount;
    }
}