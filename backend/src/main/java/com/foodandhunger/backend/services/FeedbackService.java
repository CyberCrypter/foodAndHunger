package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.FeedbackModel;
import com.foodandhunger.backend.repository.FeedbackRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService implements ServicesStruct<FeedbackModel> {
    @Autowired
    FeedbackRepo feedbackRepo ;
    @Override
    public Optional<FeedbackModel> getById(int id) {
        return Optional.empty();
    }

    @Override
    public List<FeedbackModel> getAll() {
        return List.of();
    }

    @Override
    public boolean updateById(int id, FeedbackModel entity) {
        return false;
    }



    @Override
    public boolean create(FeedbackModel entity) {
        return false;
    }

    @Override
    public boolean delete(int id) {
        return false;
    }
}
