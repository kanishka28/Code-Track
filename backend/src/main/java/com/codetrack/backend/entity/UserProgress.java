package com.codetrack.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "user_progress",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "problem_type", "problem_id"})
)
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "problem_type", nullable = false)
    private ProblemType problemType;

    // Not a JPA @ManyToOne FK on purpose — this id can point into
    // Problem, CsesProblem, or StriverProblem depending on problemType.
    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    private boolean solved = false;
    private boolean markedForRevision = false;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ProblemType getProblemType() { return problemType; }
    public void setProblemType(ProblemType problemType) { this.problemType = problemType; }
    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }
    public boolean isSolved() { return solved; }
    public void setSolved(boolean solved) { this.solved = solved; }
    public boolean isMarkedForRevision() { return markedForRevision; }
    public void setMarkedForRevision(boolean markedForRevision) { this.markedForRevision = markedForRevision; }
}