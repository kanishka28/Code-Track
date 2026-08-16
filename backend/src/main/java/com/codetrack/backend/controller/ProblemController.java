package com.codetrack.backend.controller;

import com.codetrack.backend.dto.TopicDTO;
import com.codetrack.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sheets")
@CrossOrigin(origins = "http://localhost:3000")
public class ProblemController {

    private final ProblemService service;

    public ProblemController(ProblemService service) {
        this.service = service;
    }

    @GetMapping("/{sheet}/problems")
    public List<TopicDTO> getSheetProblems(
            @PathVariable String sheet
    ) {

        return service.getProblemsBySheet(sheet);
    }
}