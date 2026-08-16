package com.codetrack.backend.service;

import com.codetrack.backend.dto.ProblemDTO;
import com.codetrack.backend.dto.TopicDTO;
import com.codetrack.backend.entity.StriverProblem;
import com.codetrack.backend.repository.StriverRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class StriverProblemService {

    private final StriverRepository repository;

    public StriverProblemService(StriverRepository repository) {
        this.repository = repository;
    }

    public List<TopicDTO> getAllProblems() {

        List<StriverProblem> problems =
                repository.findAllByOrderByIdAsc();

        return groupProblems(problems);
    }

    private List<TopicDTO> groupProblems(
            List<StriverProblem> problems
    ) {

        Map<String, List<ProblemDTO>> grouped =
                new LinkedHashMap<>();

        for (StriverProblem p : problems) {

            /*
             * IMPORTANT:
             *
             * Do NOT pass topic into ProblemDTO.
             *
             * Topic is stored in TopicDTO below.
             */

            ProblemDTO dto = new ProblemDTO(

                    p.getId(),

                    p.getTitle(),

                    getCompanies(p.getDifficulty()),

                    p.getDifficulty(),

                    p.getYoutubeUrl(),

                    getSolveUrl(p),

                    false,

                    false
            );

            grouped
                    .computeIfAbsent(
                            p.getTopic(),
                            key -> new ArrayList<>()
                    )
                    .add(dto);
        }

        List<TopicDTO> response = new ArrayList<>();

        for (Map.Entry<String, List<ProblemDTO>> entry
                : grouped.entrySet()) {

            response.add(
                    new TopicDTO(
                            entry.getKey(),
                            entry.getValue()
                    )
            );
        }

        return response;
    }

    private String getSolveUrl(StriverProblem problem) {

        if (problem.getLeetcodeUrl() != null
                && !problem.getLeetcodeUrl().isBlank()) {

            return problem.getLeetcodeUrl();
        }

        return problem.getArticleUrl();
    }

    private List<String> getCompanies(String difficulty) {

        if ("Easy".equalsIgnoreCase(difficulty)) {

            return List.of(
                    "Amazon",
                    "Google",
                    "Microsoft"
            );
        }

        if ("Medium".equalsIgnoreCase(difficulty)) {

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