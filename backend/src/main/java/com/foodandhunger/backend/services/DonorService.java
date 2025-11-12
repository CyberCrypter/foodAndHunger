package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.repository.DonorRepo;
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
public class DonorService implements ServicesStruct<DonorModel> {

    @Autowired
    private DonorRepo donorRepo;

    @Override
    public Optional<DonorModel> getById(int id) {
        return donorRepo.findById(id);
    }

    @Override
    public List<DonorModel> getAll() {
        return donorRepo.findAll();
    }

    @Override
    public boolean updateById(int id, DonorModel entity) {
        try {
            DonorModel donor = donorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));

            donor.setName(entity.getName());
            donor.setAge(entity.getAge());
            donor.setAddress(entity.getAddress());
            donor.setLocation(entity.getLocation());
            donor.setOrganizationName(entity.getOrganizationName());
            donor.setPan(entity.getPan());
            donor.setAadhaar(entity.getAadhaar());
            donor.setPhone(entity.getPhone());
            donor.setEmail(entity.getEmail());
            donor.setStatus(entity.getStatus());
            donor.setRemarks(entity.getRemarks());
            donorRepo.save(donor);
            return true;
        } catch (Exception e) {
            LLogging.error("update failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(DonorModel entity) {
        try {
            donorRepo.save(entity);
            return true;
        } catch (Exception e) {
            LLogging.error("create failed: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean delete(int id) {
        if (!donorRepo.existsById(id)) return false;
        donorRepo.deleteById(id);
        return true;
    }

    @Override
    public ResponseEntity<List<DonorModel>> search(String query) {
        return ResponseEntity.ok(donorRepo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query));
    }

    @Override
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(donorRepo.count());
    }

    @Override
    public ResponseEntity<Boolean> exists(int id) {
        return ResponseEntity.ok(donorRepo.existsById(id));
    }

    //  Upload donor files
    public ResponseEntity<DonorModel> uploadFiles(int donorId,
                                                  MultipartFile photo,
                                                  MultipartFile certificate,
                                                  MultipartFile signature) {
        try {
            DonorModel donor = donorRepo.findById(donorId)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));

            if (photo != null)
                donor.setPhoto(FileUploadUtil.saveUserFile("uploads/donors", donor.getUserId(), photo, "photo"));
            if (certificate != null)
                donor.setOrganizationCertificate(FileUploadUtil.saveUserFile("uploads/donors", donor.getUserId(), certificate, "certificate"));
            if (signature != null)
                donor.setSignature(FileUploadUtil.saveUserFile("uploads/donors", donor.getUserId(), signature, "signature"));

            donorRepo.save(donor);
            return ResponseEntity.ok(donor);
        } catch (Exception e) {
            LLogging.error("File upload failed: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Filter by user
    public ResponseEntity<DonorModel> getByUserId(int userId) {
        return donorRepo.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  Filter by location
    public ResponseEntity<List<DonorModel>> getByLocation(String location) {
        return ResponseEntity.ok(donorRepo.findByLocationContainingIgnoreCase(location));
    }

    //  Filter by status
    public ResponseEntity<List<DonorModel>> getByStatus(String status) {
        return ResponseEntity.ok(donorRepo.findByStatusIgnoreCase(status));
    }

    //  Update donor verification status
    public ResponseEntity<DonorModel> updateStatus(int id, String status, String remarks) {
        try {
            DonorModel donor = donorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));
            donor.setStatus(status);
            donor.setRemarks(remarks);
            donorRepo.save(donor);
            return ResponseEntity.ok(donor);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    //  Count verified donors
    public ResponseEntity<Long> countVerified() {
        long count = donorRepo.findByStatusIgnoreCase("verified").size();
        return ResponseEntity.ok(count);
    }
}
