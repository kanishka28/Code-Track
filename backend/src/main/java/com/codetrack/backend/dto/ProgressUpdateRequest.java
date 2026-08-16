package com.codetrack.backend.dto;

public class ProgressUpdateRequest {
    private Boolean solved;
    private Boolean markedForRevision;

    public Boolean getSolved() { return solved; }
    public void setSolved(Boolean solved) { this.solved = solved; }
    public Boolean getMarkedForRevision() { return markedForRevision; }
    public void setMarkedForRevision(Boolean markedForRevision) { this.markedForRevision = markedForRevision; }
}