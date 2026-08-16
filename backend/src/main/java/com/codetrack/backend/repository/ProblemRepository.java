package com.codetrack.backend.repository;

import com.codetrack.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByNeetcode150True();

    List<Problem> findByBlind75True();

    List<Problem> findByPatternIgnoreCase(String pattern);

    List<Problem> findByDifficultyIgnoreCase(String difficulty);

    List<Problem> findByProblemContainingIgnoreCase(String keyword);

}