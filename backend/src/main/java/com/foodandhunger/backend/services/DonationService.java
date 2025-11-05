package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.DonationModel;
import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.repository.DonationRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.LLogging;
import com.sun.security.auth.module.LdapLoginModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class DonationService implements ServicesStruct<DonationModel> {
    @Autowired
    DonationRepo donationRepo ;

    @Override
    public Optional<DonationModel> getById(int id) {
        LLogging.info("getById()");
        try {
            Optional<DonationModel> existing = donationRepo.findById(id);
            existing.ifPresentOrElse(
                    d -> LLogging.info("Donation found " + d.getTitle()),
                    () -> LLogging.warn("Donation not found, id: " + id));
            return existing;
        }catch (Exception e){
            LLogging.error(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<DonationModel> getAll() {
        LLogging.info("getAll()");
        try{
            List<DonationModel> allDonations = donationRepo.findAll();
            if (allDonations.isEmpty()){
                LLogging.warn("No Donors found");
            }else {
                LLogging.info("Fetched " + allDonations.size() + " donations");
            }
            return allDonations;
        }catch (Exception e){
            return List.of();
        }
    }

    @Override
    public boolean updateById(int id, DonationModel entity) {
        LLogging.info("updateById()");
        try{
            DonationModel existing = donationRepo.findById(id)
                    .orElseThrow(()->new RuntimeException("Donation not found"));
            existing.setDescription(entity.getDescription());
            existing.setType(entity.getType());
            existing.setTitle(entity.getTitle());
            existing.setPhoto(entity.getPhoto());
            existing.setLocation(entity.getLocation());
            return true;
        }catch (Exception e){
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(DonationModel entity) {
        LLogging.info("create()");
        try {
            donationRepo.save(entity);
            LLogging.info("Donation saved " + entity.getTitle());
            return true;
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public boolean delete(int id) {
        LLogging.info("delete()");
        try {
            donationRepo.deleteById(id);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
