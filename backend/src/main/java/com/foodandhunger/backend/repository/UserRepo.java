package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// 2. repository
@Repository
public interface UserRepo extends JpaRepository<UserModel, Integer> {
    // Spring Data JPA automatically provides: save, findAll, findById, deleteById, etc.
    boolean existsByEmail(String email);
    boolean existsByUsername(String email);
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findByEmail(String email);
}

