package com.codetrack.backend.repository;

import com.codetrack.backend.entity.CsesProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CsesRepository extends JpaRepository<CsesProblem, Integer> {

    List<CsesProblem> findAllByOrderByRankAsc();
}