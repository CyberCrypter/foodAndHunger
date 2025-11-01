package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.RecipientModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepo extends JpaRepository<RecipientModel, Integer> {
}
