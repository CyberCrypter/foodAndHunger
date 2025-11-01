package com.foodandhunger.backend.repository;

import com.foodandhunger.backend.models.DonationModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepo extends JpaRepository<DonationModel, Integer> {

}
