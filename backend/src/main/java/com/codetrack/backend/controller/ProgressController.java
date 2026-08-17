package com.codetrack.backend.controller;

import com.codetrack.backend.dto.ProgressUpdateRequest;
import com.codetrack.backend.entity.ProblemType;
import com.codetrack.backend.entity.User;
import com.codetrack.backend.entity.UserProgress;
import com.codetrack.backend.repository.UserProgressRepository;
import com.codetrack.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")

public class ProgressController {

    @Autowired private AuthService authService;
    @Autowired private UserProgressRepository progressRepository;

    // GET all progress for the logged-in user, optionally filtered by sheet type
    // e.g. GET /api/progress?type=NEETCODE
    @GetMapping
    public List<UserProgress> getProgress(
            @RequestHeader("X-Session-Token") String token,
            @RequestParam(required = false) ProblemType type) {

        User user = authService.requireUserByToken(token);
        return (type != null)
                ? progressRepository.findByUserIdAndProblemType(user.getId(), type)
                : progressRepository.findByUserId(user.getId());
    }

    // POST /api/progress/NEETCODE/42   body: { "solved": true }
    @PostMapping("/{type}/{problemId}")
    public UserProgress updateProgress(
            @RequestHeader("X-Session-Token") String token,
            @PathVariable ProblemType type,
            @PathVariable Long problemId,
            @RequestBody ProgressUpdateRequest body) {

        User user = authService.requireUserByToken(token);

        UserProgress progress = progressRepository
                .findByUserIdAndProblemTypeAndProblemId(user.getId(), type, problemId)
                .orElseGet(() -> {
                    UserProgress p = new UserProgress();
                    p.setUser(user);
                    p.setProblemType(type);
                    p.setProblemId(problemId);
                    return p;
                });

        if (body.getSolved() != null) progress.setSolved(body.getSolved());
        if (body.getMarkedForRevision() != null) progress.setMarkedForRevision(body.getMarkedForRevision());

        return progressRepository.save(progress);
    }
}