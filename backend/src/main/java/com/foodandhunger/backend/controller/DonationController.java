package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.DonationModel;
import com.foodandhunger.backend.services.DonationService;
import com.foodandhunger.backend.structures.ControllerStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donation")
public class DonationController implements ControllerStruct<DonationModel> {

    @Autowired
    DonationService donationService;

    //  Create donation
    @Override
    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody DonationModel entity) {
        LLogging.info("create()");
        try {
            boolean created = donationService.create(entity);
            if (created) {
                LLogging.info("Donation added successfully");
                return ResponseEntity.ok("Donation added successfully");
            } else {
                LLogging.warn("Failed to add donation");
                return ResponseEntity.status(400).body("Failed to add donation");
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Get donation by ID
    @Override
    @GetMapping("/{id}")
    public ResponseEntity<DonationModel> get(@PathVariable int id) {
        LLogging.info("get()");
        try {
            return donationService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        LLogging.warn("Donation not found, id: " + id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            LLogging.error("Error fetching donation: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    // Get all donations
    @Override
    @GetMapping("/all")
    public ResponseEntity<List<DonationModel>> getAll() {
        LLogging.info("getAll()");
        try {
            List<DonationModel> donations = donationService.getAll();
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            LLogging.error("Error fetching all donations: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Update donation
    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DonationModel> update(@PathVariable int id, @RequestBody DonationModel entity) {
        LLogging.info("update()");
        try {
            boolean updated = donationService.updateById(id, entity);
            if (updated) {
                LLogging.info("Donation updated successfully");
                return ResponseEntity.ok(entity);
            } else {
                return ResponseEntity.status(404).build();
            }
        } catch (Exception e) {
            LLogging.error("Error updating donation: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    // Delete donation
    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        LLogging.info("delete()");
        try {
            boolean deleted = donationService.delete(id);
            if (deleted) {
                LLogging.info("Donation deleted successfully");
                return ResponseEntity.ok("Donation deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Donation not found");
            }
        } catch (Exception e) {
            LLogging.error("Error deleting donation: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //  Search donation
    @Override
    @GetMapping("/search")
    public ResponseEntity<List<DonationModel>> search(@RequestParam String query) {
        LLogging.info("search()");
        return donationService.search(query);
    }

    // Count all donations
    @Override
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        return donationService.count();
    }

    // Check if donation exists
    @Override
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        LLogging.info("exists()");
        return donationService.exists(id);
    }
}
