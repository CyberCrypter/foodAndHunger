package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.RequestModel;
import com.foodandhunger.backend.repository.RequestRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService implements ServicesStruct<RequestModel> {
    @Autowired
    RequestRepo requestRepo;

    @Override
    public Optional<RequestModel> getById(int id) {
        return Optional.empty();
    }

    @Override
    public List<RequestModel> getAll() {
        return List.of();
    }

    @Override
    public boolean updateById(int id, RequestModel entity) {
        return false;
    }


    @Override
    public boolean create(RequestModel entity) {
        return false;
    }

    @Override
    public boolean delete(int id) {
        return false;
    }
}
