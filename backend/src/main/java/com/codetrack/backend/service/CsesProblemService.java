package com.codetrack.backend.service;

import com.codetrack.backend.dto.CsesProblemDTO;
import com.codetrack.backend.entity.CsesProblem;
import com.codetrack.backend.repository.CsesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsesProblemService {

    private final CsesRepository repository;

    public CsesProblemService(CsesRepository repository) {
        this.repository = repository;
    }

    public List<CsesProblemDTO> getAllProblems() {

        List<CsesProblem> problems =
                repository.findAllByOrderByRankAsc();

        return problems.stream()
                .map(problem ->
                        new CsesProblemDTO(
                                problem.getRank(),
                                problem.getId(),
                                problem.getTitle(),
                                problem.getCategory(),
                                problem.getUrl()
                        )
                )
                .collect(Collectors.toList());
    }
}