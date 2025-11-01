package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.RequestModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepo extends JpaRepository<RequestModel, Integer> {
}
