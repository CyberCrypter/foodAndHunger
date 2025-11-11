package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.models.RecipientModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepo extends JpaRepository<DonorModel, Integer> {
    boolean  existsByUserId(int userId);
    Optional<DonorModel> findByUserId(int userId);
    List<DonorModel> findByLocation(String location);
    List<DonorModel> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);

}