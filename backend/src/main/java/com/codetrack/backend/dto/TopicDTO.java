package com.codetrack.backend.dto;

import java.util.List;

public class TopicDTO {

    private String topic;
    private List<ProblemDTO> problems;

    public TopicDTO() {
    }

    public TopicDTO(String topic, List<ProblemDTO> problems) {
        this.topic = topic;
        this.problems = problems;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public List<ProblemDTO> getProblems() {
        return problems;
    }

    public void setProblems(List<ProblemDTO> problems) {
        this.problems = problems;
    }
}