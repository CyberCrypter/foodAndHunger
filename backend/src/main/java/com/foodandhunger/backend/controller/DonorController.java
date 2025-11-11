package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.DonorModel;
import com.foodandhunger.backend.services.DonorService;
import com.foodandhunger.backend.structures.ControllerStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donor")
public class DonorController implements ControllerStruct<DonorModel> {

    @Autowired
    DonorService donorService;

    //  Create Donor
    @Override
    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody DonorModel entity) {
        LLogging.info("create()");
        try {
            boolean created = donorService.create(entity);
            if (created) {
                LLogging.info("Donor added successfully");
                return ResponseEntity.ok("Donor added successfully");
            } else {
                LLogging.warn("Failed to add donor");
                return ResponseEntity.status(400).body("Failed to add donor");
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //  Get Donor by ID
    @Override
    @GetMapping("/{id}")
    public ResponseEntity<DonorModel> get(@PathVariable int id) {
        LLogging.info("get()");
        try {
            return donorService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        LLogging.warn("Donor not found, id: " + id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            LLogging.error("Error fetching donor: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Get All Donors
    @Override
    @GetMapping("/all")
    public ResponseEntity<List<DonorModel>> getAll() {
        LLogging.info("getAll()");
        try {
            List<DonorModel> result = donorService.getAll();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LLogging.error("Error fetching all donors: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Update Donor by ID
    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DonorModel> update(@PathVariable int id, @RequestBody DonorModel entity) {
        LLogging.info("update()");
        try {
            boolean updated = donorService.updateById(id, entity);
            if (updated) {
                LLogging.info("Donor updated successfully");
                return ResponseEntity.ok(entity);
            } else {
                return ResponseEntity.status(404).build();
            }
        } catch (Exception e) {
            LLogging.error("Error updating donor: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    //  Delete Donor by ID
    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        LLogging.info("delete()");
        try {
            boolean deleted = donorService.delete(id);
            if (deleted) {
                LLogging.info("Donor deleted successfully");
                return ResponseEntity.ok("Donor deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Donor not found");
            }
        } catch (Exception e) {
            LLogging.error("Error deleting donor: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    //  Search Donor by Name or Email
    @Override
    @GetMapping("/search")
    public ResponseEntity<List<DonorModel>> search(@RequestParam String query) {
        LLogging.info("search()");
        return donorService.search(query);
    }

    //  Count Total Donors
    @Override
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        return donorService.count();
    }

    //  Check if Donor Exists by ID
    @Override
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        LLogging.info("exists()");
        return donorService.exists(id);
    }
}
