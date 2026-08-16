package com.codetrack.backend.repository;

import com.codetrack.backend.entity.StriverProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StriverRepository extends JpaRepository<StriverProblem, Long> {

    List<StriverProblem> findAllByOrderByIdAsc();

    List<StriverProblem> findByTopicIgnoreCase(String topic);

    List<StriverProblem> findByDifficultyIgnoreCase(String difficulty);

    List<StriverProblem> findByTitleContainingIgnoreCase(String keyword);
}