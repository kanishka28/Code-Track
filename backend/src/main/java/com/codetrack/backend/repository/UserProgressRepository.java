package com.codetrack.backend.repository;

import com.codetrack.backend.entity.ProblemType;
import com.codetrack.backend.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);

    List<UserProgress> findByUserIdAndProblemType(Long userId, ProblemType problemType);

    Optional<UserProgress> findByUserIdAndProblemTypeAndProblemId(
        Long userId, ProblemType problemType, Long problemId
    );
}