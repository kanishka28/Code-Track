    package com.codetrack.backend.controller;

    import com.codetrack.backend.dto.CategoryCounts;
    import com.codetrack.backend.dto.ProgressSummaryResponse;
    import com.codetrack.backend.entity.Problem;
    import com.codetrack.backend.entity.ProblemType;
    import com.codetrack.backend.entity.User;
    import com.codetrack.backend.entity.UserProgress;
    import com.codetrack.backend.repository.ProblemRepository;
    import com.codetrack.backend.repository.UserProgressRepository;
    import com.codetrack.backend.service.AuthService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Map;
    import java.util.stream.Collectors;

    @RestController
    @RequestMapping("/api/progress")

    public class ProgressSummaryController {

        @Autowired private AuthService authService;
        @Autowired private UserProgressRepository progressRepository;
        @Autowired private ProblemRepository problemRepository;

        // GET /api/progress/summary
        @GetMapping("/summary")
        public ProgressSummaryResponse getSummary(@RequestHeader("X-Session-Token") String token) {

            User user = authService.requireUserByToken(token);

            List<UserProgress> allProgress = progressRepository.findByUserId(user.getId());

            // Pull the actual Problem rows for every NEETCODE-type entry so we can
            // tell NeetCode 150 apart from Blind 75 (they share the same table).
            List<Long> neetcodeProblemIds = allProgress.stream()
                    .filter(p -> p.getProblemType() == ProblemType.NEETCODE)
                    .map(UserProgress::getProblemId)
                    .collect(Collectors.toList());

            Map<Long, Problem> problemsById = problemRepository.findAllById(neetcodeProblemIds)
                    .stream()
                    .collect(Collectors.toMap(Problem::getId, p -> p));

            CategoryCounts completed = buildCounts(allProgress, UserProgress::isSolved, problemsById);
            CategoryCounts revision = buildCounts(allProgress, UserProgress::isMarkedForRevision, problemsById);

            return new ProgressSummaryResponse(completed, revision);
        }

        private CategoryCounts buildCounts(
                List<UserProgress> allProgress,
                java.util.function.Predicate<UserProgress> statusFilter,
                Map<Long, Problem> problemsById) {

            int total = 0;
            int neetcode150 = 0;
            int blind75 = 0;
            int striver = 0;
            int cses = 0;

            for (UserProgress p : allProgress) {

                if (!statusFilter.test(p)) continue;

                total++;

                switch (p.getProblemType()) {

                    case STRIVER:
                        striver++;
                        break;

                    case CSES:
                        cses++;
                        break;

                    case NEETCODE:
                        Problem problem = problemsById.get(p.getProblemId());
                        if (problem != null) {
                            if (Boolean.TRUE.equals(problem.getNeetcode150())) neetcode150++;
                            if (Boolean.TRUE.equals(problem.getBlind75())) blind75++;
                        }
                        break;
                }
            }

            return new CategoryCounts(total, neetcode150, blind75, striver, cses);
        }
    }