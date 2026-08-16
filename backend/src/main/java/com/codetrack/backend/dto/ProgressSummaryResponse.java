package com.codetrack.backend.dto;

public class ProgressSummaryResponse {

    private CategoryCounts questionsCompleted;
    private CategoryCounts markedForRevision;

    public ProgressSummaryResponse(CategoryCounts questionsCompleted, CategoryCounts markedForRevision) {
        this.questionsCompleted = questionsCompleted;
        this.markedForRevision = markedForRevision;
    }

    public CategoryCounts getQuestionsCompleted() { return questionsCompleted; }
    public CategoryCounts getMarkedForRevision() { return markedForRevision; }
}