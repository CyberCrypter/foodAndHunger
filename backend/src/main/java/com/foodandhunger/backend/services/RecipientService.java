package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.RecipientModel;
import com.foodandhunger.backend.repository.RecipientRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipientService implements ServicesStruct<RecipientModel> {
    @Autowired
    RecipientRepo recipientRepo ;
    @Override
    public Optional<RecipientModel> getById(int id) {
        return Optional.empty();
    }

    @Override
    public List<RecipientModel> getAll() {
        return List.of();
    }

    @Override
    public boolean updateById(int id, RecipientModel entity) {
        return false;
    }


    @Override
    public boolean create(RecipientModel entity) {
        return false;
    }

    @Override
    public boolean delete(int id) {
        return false;
    }
}
