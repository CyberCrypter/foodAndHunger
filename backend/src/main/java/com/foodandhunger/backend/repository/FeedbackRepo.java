package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.FeedbackModel;
import com.foodandhunger.backend.models.RecipientModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepo extends JpaRepository<FeedbackModel, Integer> {
    List<FeedbackModel> findByMessageContainingIgnoreCase(String message);

}
