package com.codetrack.backend.controller;

import com.codetrack.backend.dto.ContestDTO;
import com.codetrack.backend.service.ContestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")

public class ContestController {

    private final ContestService contestService;

    public ContestController(
            ContestService contestService
    ) {
        this.contestService = contestService;
    }


    @GetMapping
    public List<ContestDTO> getContests(
            @RequestParam int year,
            @RequestParam int month
    ) {

        return contestService.getContestsForMonth(
                year,
                month
        );
    }
}