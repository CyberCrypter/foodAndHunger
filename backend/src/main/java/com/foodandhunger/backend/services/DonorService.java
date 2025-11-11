package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.repository.DonorRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonorService implements ServicesStruct<DonorModel> {

    @Autowired
    private DonorRepo donorRepository;

    // ✅ Get donor by ID
    @Override
    public Optional<DonorModel> getById(int id) {
        LLogging.info("getDonorById()");
        try {
            Optional<DonorModel> donor = donorRepository.findById(id);
            donor.ifPresentOrElse(
                    d -> LLogging.info("Donor found: " + d.getName()),
                    () -> LLogging.warn("Donor not found, id: " + id)
            );
            return donor;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return Optional.empty();
        }
    }

    // ✅ Get all donors
    @Override
    public List<DonorModel> getAll() {
        LLogging.info("getAllDonors()");
        try {
            List<DonorModel> donors = donorRepository.findAll();
            if (donors.isEmpty()) {
                LLogging.warn("No donors found");
            } else {
                LLogging.info("Fetched " + donors.size() + " donors");
            }
            return donors;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return List.of();
        }
    }

    // ✅ Create donor
    @Override
    public boolean create(DonorModel donor) {
        LLogging.info("createDonor()");
        try {
            donorRepository.save(donor);
            LLogging.info("Donor saved: " + donor.getName());
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    // ✅ Update donor by ID
    @Override
    public boolean updateById(int id, DonorModel donor) {
       LLogging.info("updateDonorById()");
        try {
            DonorModel existing = donorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));
            existing.setAadhaar(donor.getAadhaar());
            existing.setName(donor.getName());
            existing.setAge(donor.getAge());
            existing.setAddress(donor.getAddress());
            existing.setOrganization_certificate_id(donor.getOrganization_certificate_id());
            existing.setOrganizationName(donor.getOrganizationName());
            existing.setPan(donor.getPan());
            existing.setPhone(donor.getPhone());
            existing.setEmail(donor.getEmail());
            existing.setUserId(donor.getUserId());
            existing.setPhoto(donor.getPhoto());
            donorRepository.save(existing); // ✅ Save after update
            LLogging.info("Donor updated with id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    // ✅ Update donor by user ID
    public boolean updateByUserId(int userId, DonorModel donor) {
        LLogging.info("updateDonorByUserId()");
        try {
            DonorModel existing = donorRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));
            existing.setAadhaar(donor.getAadhaar());
            existing.setName(donor.getName());
            existing.setAge(donor.getAge());
            existing.setAddress(donor.getAddress());
            existing.setLocation(donor.getLocation());
            existing.setOrganization_certificate_id(donor.getOrganization_certificate_id());
            existing.setOrganizationName(donor.getOrganizationName());
            existing.setPan(donor.getPan());
            existing.setPhone(donor.getPhone());
            existing.setEmail(donor.getEmail());
            existing.setUserId(donor.getUserId());
            donorRepository.save(existing); // ✅ Save after update
            LLogging.info("Donor updated with userId: " + userId);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    // ✅ Delete donor by ID
    @Override
    public boolean delete(int id) {
        LLogging.info("deleteDonor()");
        try {
            donorRepository.deleteById(id);
            LLogging.info("Donor deleted with id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public ResponseEntity<List<DonorModel>> search(String query) {
        LLogging.info("search()");
        try {
            List<DonorModel> result = donorRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
            if (result.isEmpty()) {
                LLogging.warn("No donors found for query: " + query);
            } else {
                LLogging.info("Found " + result.size() + " donors for query: " + query);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        try {
            long total = donorRepository.count();
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
            boolean exists = donorRepository.existsById(id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

}
