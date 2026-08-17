package com.codetrack.backend.controller;

import com.codetrack.backend.dto.SheetDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sheets")

public class SheetController {

    @GetMapping
    public List<SheetDTO> getSheets() {

        return List.of(

                new SheetDTO(
                        "neetcode150",
                        "NeetCode 150",
                        "Complete roadmap covering all important interview topics.",
                        "Interview",
                        "Advanced",
                        150
                ),

                new SheetDTO(
                        "blind75",
                        "Blind 75",
                        "Most frequently asked interview questions.",
                        "Interview",
                        "Intermediate",
                        75
                ),

                new SheetDTO(
                        "striver-a2z",
                        "Striver's A2Z DSA Sheet",
                        "Complete DSA roadmap covering Data Structures, Algorithms, problem solving and competitive programming.",
                        "Interview",
                        "Advanced",
                        472
                )

        );
    }
}