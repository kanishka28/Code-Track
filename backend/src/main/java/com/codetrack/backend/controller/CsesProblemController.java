package com.codetrack.backend.controller;

import com.codetrack.backend.dto.CsesProblemDTO;
import com.codetrack.backend.service.CsesProblemService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cses")

public class CsesProblemController {

    private final CsesProblemService service;

    public CsesProblemController(CsesProblemService service) {
        this.service = service;
    }

    @GetMapping("/problems")
    public List<CsesProblemDTO> getAllProblems() {
        return service.getAllProblems();
    }
}