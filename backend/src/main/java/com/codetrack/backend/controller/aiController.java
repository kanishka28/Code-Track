package com.codetrack.backend.controller;

import com.codetrack.backend.dto.aiRequest;
import com.codetrack.backend.dto.aiResponse;
import com.codetrack.backend.service.aiService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class aiController {

    private final aiService aiService;

    public aiController(aiService aiService) {
        this.aiService = aiService;
    }


    /*
     * =========================================================
     * BASIC BACKEND TEST
     * =========================================================
     *
     * Open:
     *
     * http://localhost:8080/api/ai/test
     *
     * Expected:
     *
     * AI backend is working
     */

    @GetMapping("/test")
    public String test() {

        return "AI backend is working";
    }


    /*
     * =========================================================
     * TEST REQUEST DATA FROM FRONTEND
     * =========================================================
     *
     * This is useful for checking whether the frontend is
     * actually sending the problem URL.
     */

    @PostMapping("/test-request")
    public ResponseEntity<String> testRequest(
            @RequestBody aiRequest request
    ) {

        String result =
                "Problem: " + request.getProblem()
                + "\nDifficulty: " + request.getDifficulty()
                + "\nPlatform: " + request.getPlatform()
                + "\nProblem URL: " + request.getProblemUrl()
                + "\nAction: " + request.getAction()
                + "\nQuestion: " + request.getQuestion()
                + "\nCode: " + request.getCode();


        System.out.println(
                "========== AI REQUEST =========="
        );

        System.out.println(result);

        System.out.println(
                "================================"
        );


        return ResponseEntity.ok(result);
    }


    /*
     * =========================================================
     * TEST PROBLEM STATEMENT FETCHING
     * =========================================================
     *
     * Open this URL in your browser:
     *
     * http://localhost:8080/api/ai/fetch-problem?url=https://leetcode.com/problems/valid-anagram/
     *
     * This directly tests whether the BACKEND can open the
     * LeetCode URL and retrieve the problem statement.
     */

    @GetMapping("/fetch-problem")
    public ResponseEntity<String> fetchProblem(
            @RequestParam String url
    ) {

        System.out.println(
                "========== PROBLEM FETCH TEST =========="
        );

        System.out.println(
                "URL received: " + url
        );


        String problemStatement =
                aiService.fetchProblemStatementForTest(url);


        System.out.println(
                "========== FETCHED STATEMENT =========="
        );

        System.out.println(
                problemStatement
        );

        System.out.println(
                "========================================"
        );


        if (problemStatement == null
                || problemStatement.isBlank()) {

            return ResponseEntity.ok(
                    "PROBLEM STATEMENT COULD NOT BE FETCHED.\n\n"
                    + "URL: "
                    + url
            );
        }


        return ResponseEntity.ok(
                problemStatement
        );
    }


    /*
     * =========================================================
     * MAIN AI ENDPOINT
     * =========================================================
     */

    @PostMapping("/assist")
    public ResponseEntity<aiResponse> assist(
            @RequestBody aiRequest request
    ) {

        aiResponse response =
                aiService.generateResponse(request);


        return ResponseEntity.ok(response);
    }
}