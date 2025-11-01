package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.DonorModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepo extends JpaRepository<DonorModel, Integer> {
}