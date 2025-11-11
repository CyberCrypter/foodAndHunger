package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.DonationModel;
import com.foodandhunger.backend.repository.DonationRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationService implements ServicesStruct<DonationModel> {

    @Autowired
    DonationRepo donationRepo;

    @Override
    public Optional<DonationModel> getById(int id) {
        LLogging.info("getById()");
        try {
            Optional<DonationModel> existing = donationRepo.findById(id);
            existing.ifPresentOrElse(
                    d -> LLogging.info("Donation found: " + d.getTitle()),
                    () -> LLogging.warn("Donation not found, id: " + id));
            return existing;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<DonationModel> getAll() {
        LLogging.info("getAll()");
        try {
            List<DonationModel> allDonations = donationRepo.findAll();
            if (allDonations.isEmpty()) {
                LLogging.warn("No donations found");
            } else {
                LLogging.info("Fetched " + allDonations.size() + " donations");
            }
            return allDonations;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return List.of();
        }
    }

    @Override
    public boolean updateById(int id, DonationModel entity) {
        LLogging.info("updateById()");
        try {
            DonationModel existing = donationRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Donation not found"));
            existing.setDescription(entity.getDescription());
            existing.setType(entity.getType());
            existing.setTitle(entity.getTitle());
            existing.setPhoto(entity.getPhoto());
            existing.setLocation(entity.getLocation());
            existing.setAddress(entity.getAddress());
            donationRepo.save(existing);
            LLogging.info("Donation updated with id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(DonationModel entity) {
        LLogging.info("create()");
        try {
            donationRepo.save(entity);
            LLogging.info("Donation saved: " + entity.getTitle());
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean delete(int id) {
        LLogging.info("delete()");
        try {
            if (!donationRepo.existsById(id)) {
                LLogging.warn("Donation not found, cannot delete");
                return false;
            }
            donationRepo.deleteById(id);
            LLogging.info("Donation deleted, id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public ResponseEntity<List<DonationModel>> search(String query) {
        LLogging.info("search()");
        try {
            List<DonationModel> results = donationRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
            if (results.isEmpty()) {
                LLogging.warn("No donations found for query: " + query);
            } else {
                LLogging.info("Found " + results.size() + " donations for query: " + query);
            }
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        try {
            long total = donationRepo.count();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<Boolean> exists(int id) {
        LLogging.info("exists()");
        try {
            boolean exists = donationRepo.existsById(id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
