package com.codetrack.backend.controller;

import com.codetrack.backend.dto.TopicDTO;
import com.codetrack.backend.service.StriverProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sheets")

public class StriverProblemController {

    private final StriverProblemService service;

    public StriverProblemController(StriverProblemService service) {
        this.service = service;
    }

    @GetMapping("/striver-a2z/problems")
    public List<TopicDTO> getStriverProblems() {
        return service.getAllProblems();
    }
}