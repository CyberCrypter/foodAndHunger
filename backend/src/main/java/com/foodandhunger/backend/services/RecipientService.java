package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.RecipientModel;
import com.foodandhunger.backend.repository.RecipientRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.FileUploadUtil;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class RecipientService implements ServicesStruct<RecipientModel> {

    @Autowired
    private RecipientRepo recipientRepo;

    @Override
    public Optional<RecipientModel> getById(int id) {
        return recipientRepo.findById(id);
    }

    @Override
    public List<RecipientModel> getAll() {
        return recipientRepo.findAll();
    }

    @Override
    public boolean updateById(int id, RecipientModel entity) {
        try {
            RecipientModel existing = recipientRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            existing.setName(entity.getName());
            existing.setAge(entity.getAge());
            existing.setAddress(entity.getAddress());
            existing.setOrganizationName(entity.getOrganizationName());
            existing.setPan(entity.getPan());
            existing.setAadhaar(entity.getAadhaar());
            existing.setPhone(entity.getPhone());
            existing.setEmail(entity.getEmail());
            existing.setLocation(entity.getLocation());
            existing.setOrganization_certificate_id(entity.getOrganization_certificate_id());
            existing.setStatus(entity.getStatus());
            existing.setRemarks(entity.getRemarks());

            recipientRepo.save(existing);
            return true;
        } catch (Exception e) {
            LLogging.error("Update failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(RecipientModel entity) {
        try {
            recipientRepo.save(entity);
            return true;
        } catch (Exception e) {
            LLogging.error("Create failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean delete(int id) {
        if (!recipientRepo.existsById(id)) return false;
        recipientRepo.deleteById(id);
        return true;
    }

    @Override
    public ResponseEntity<List<RecipientModel>> search(String query) {
        return ResponseEntity.ok(recipientRepo.findByNameContainingIgnoreCase(query));
    }

    @Override
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(recipientRepo.count());
    }

    @Override
    public ResponseEntity<Boolean> exists(int id) {
        return ResponseEntity.ok(recipientRepo.existsById(id));
    }

    //  Upload recipient files
    public ResponseEntity<RecipientModel> uploadFiles(int recipientId, MultipartFile photo,
                                                      MultipartFile certificate, MultipartFile signature) {
        try {
            RecipientModel recipient = recipientRepo.findById(recipientId)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            if (photo != null)
                recipient.setPhoto(FileUploadUtil.saveUserFile("uploads/recipients", recipient.getUserId(), photo, "photo"));
            if (certificate != null)
                recipient.setOrganizationCertificate(FileUploadUtil.saveUserFile("uploads/recipients", recipient.getUserId(), certificate, "certificate"));
            if (signature != null)
                recipient.setSignature(FileUploadUtil.saveUserFile("uploads/recipients", recipient.getUserId(), signature, "signature"));

            recipientRepo.save(recipient);
            return ResponseEntity.ok(recipient);

        } catch (Exception e) {
            LLogging.error("File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Filter by user
    public ResponseEntity<RecipientModel> getByUserId(int userId) {
        return recipientRepo.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Filter by location
    public ResponseEntity<List<RecipientModel>> getByLocation(String location) {
        return ResponseEntity.ok(recipientRepo.findByLocationContainingIgnoreCase(location));
    }

    //  Filter by organization
    public ResponseEntity<List<RecipientModel>> getByOrganization(String name) {
        return ResponseEntity.ok(recipientRepo.findByOrganizationNameContainingIgnoreCase(name));
    }

    //  Filter by status
    public ResponseEntity<List<RecipientModel>> getByStatus(String status) {
        return ResponseEntity.ok(recipientRepo.findByStatusIgnoreCase(status));
    }

    //  Verify or reject recipient
    public ResponseEntity<RecipientModel> updateStatus(int id, String status, String remarks) {
        try {
            RecipientModel recipient = recipientRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
            recipient.setStatus(status);
            recipient.setRemarks(remarks);
            recipientRepo.save(recipient);
            return ResponseEntity.ok(recipient);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
