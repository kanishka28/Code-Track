package com.codetrack.backend.service;

import com.codetrack.backend.dto.ProblemDTO;
import com.codetrack.backend.dto.TopicDTO;
import com.codetrack.backend.entity.Problem;
import com.codetrack.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProblemService {

    private final ProblemRepository repository;

    public ProblemService(ProblemRepository repository) {
        this.repository = repository;
    }

    public List<TopicDTO> getProblemsBySheet(String sheetName) {

        List<Problem> problems;

        switch (sheetName.toLowerCase()) {

            case "blind75":

                problems = repository.findByBlind75True();
                break;

            case "neetcode150":

            default:

                problems = repository.findByNeetcode150True();

        }

        return groupProblems(problems);

    }

    private List<TopicDTO> groupProblems(List<Problem> problems) {

        Map<String,List<ProblemDTO>> grouped = new LinkedHashMap<>();

        for(Problem p : problems){

            ProblemDTO dto = new ProblemDTO(

                    p.getId(),

                    p.getProblem(),

                    getCompanies(p.getDifficulty()),

                    p.getDifficulty(),

                    "https://www.youtube.com/watch?v="+p.getVideo(),

                    "https://leetcode.com/problems/"+p.getLink(),

                    false,

                    false

            );

            grouped
                    .computeIfAbsent(
                            p.getPattern(),
                            k->new ArrayList<>())
                    .add(dto);

        }

        List<TopicDTO> response = new ArrayList<>();

        for(Map.Entry<String,List<ProblemDTO>> entry
                : grouped.entrySet()){

            response.add(
                    new TopicDTO(
                            entry.getKey(),
                            entry.getValue()
                    )
            );

        }

        return response;

    }

    private List<String> getCompanies(String difficulty){

        if("Easy".equalsIgnoreCase(difficulty)){

            return List.of(
                    "Amazon",
                    "Google",
                    "Microsoft"
            );

        }

        if("Medium".equalsIgnoreCase(difficulty)){

            return List.of(
                    "Amazon",
                    "Adobe",
                    "Meta"
            );

        }

        return List.of(
                "Google",
                "Apple",
                "Netflix"
        );

    }

}