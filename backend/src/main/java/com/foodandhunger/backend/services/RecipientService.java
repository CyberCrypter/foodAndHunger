package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.RecipientModel;
import com.foodandhunger.backend.repository.RecipientRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipientService implements ServicesStruct<RecipientModel> {

    @Autowired
    RecipientRepo recipientRepo;

    @Override
    public Optional<RecipientModel> getById(int id) {
        LLogging.info("getById()");
        try {
            Optional<RecipientModel> recipient = recipientRepo.findById(id);
            recipient.ifPresentOrElse(
                    r -> LLogging.info("Recipient found: " + r.getName()),
                    () -> LLogging.warn("Recipient not found, id: " + id)
            );
            return recipient;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<RecipientModel> getAll() {
        LLogging.info("getAll()");
        try {
            List<RecipientModel> recipients = recipientRepo.findAll();
            if (recipients.isEmpty()) {
                LLogging.warn("No recipients found");
            } else {
                LLogging.info("Fetched " + recipients.size() + " recipients");
            }
            return recipients;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return List.of();
        }
    }

    @Override
    public boolean updateById(int id, RecipientModel entity) {
        LLogging.info("updateById()");
        try {
            RecipientModel existing = recipientRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
            existing.setAadhaar(entity.getAadhaar());
            existing.setName(entity.getName());
            existing.setAge(entity.getAge());
            existing.setAddress(entity.getAddress());
            existing.setLocation(entity.getLocation());
            existing.setOrganization_certificate_id(entity.getOrganization_certificate_id());
            existing.setOrganizationName(entity.getOrganizationName());
            existing.setPan(entity.getPan());
            existing.setPhone(entity.getPhone());
            existing.setEmail(entity.getEmail());
            existing.setUserId(entity.getUserId());
            existing.setPhoto(entity.getPhoto());
            recipientRepo.save(existing);
            LLogging.info("Recipient updated with id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(RecipientModel entity) {
        LLogging.info("create()");
        try {
            recipientRepo.save(entity);
            LLogging.info("Recipient saved: " + entity.getName());
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
            if (!recipientRepo.existsById(id)) {
                LLogging.warn("Recipient not found, cannot delete");
                return false;
            }
            recipientRepo.deleteById(id);
            LLogging.info("Recipient deleted with id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public ResponseEntity<List<RecipientModel>> search(String query) {
        LLogging.info("search()");
        try {
            List<RecipientModel> result = recipientRepo.findByNameContainingIgnoreCase(query);
            if (result.isEmpty()) {
                LLogging.warn("No results found for query: " + query);
            } else {
                LLogging.info("Found " + result.size() + " recipients for query: " + query);
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
            long total = recipientRepo.count();
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
            boolean exists = recipientRepo.existsById(id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
