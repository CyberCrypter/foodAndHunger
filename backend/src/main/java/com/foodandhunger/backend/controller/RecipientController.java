package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.RecipientModel;
import com.foodandhunger.backend.services.RecipientService;
import com.foodandhunger.backend.structures.ControllerStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipient")
public class RecipientController implements ControllerStruct<RecipientModel> {

    @Autowired
    RecipientService recipientService;

    @Override
    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody RecipientModel entity) {
        LLogging.info("create()");
        try {
            boolean created = recipientService.create(entity);
            if (created) {
                LLogging.info("Recipient added successfully");
                return ResponseEntity.ok("Recipient added successfully");
            } else {
                return ResponseEntity.status(400).body("Failed to add recipient");
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<RecipientModel> get(@PathVariable int id) {
        LLogging.info("get()");
        try {
            return recipientService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<List<RecipientModel>> getAll() {
        LLogging.info("getAll()");
        try {
            List<RecipientModel> result = recipientService.getAll();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<RecipientModel> update(@PathVariable int id, @RequestBody RecipientModel entity) {
        LLogging.info("update()");
        try {
            boolean updated = recipientService.updateById(id, entity);
            if (updated) {
                LLogging.info("Recipient updated successfully");
                return ResponseEntity.ok(entity);
            } else {
                return ResponseEntity.status(404).build();
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        LLogging.info("delete()");
        try {
            boolean deleted = recipientService.delete(id);
            if (deleted) {
                return ResponseEntity.ok("Recipient deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Recipient not found");
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/search")
    public ResponseEntity<List<RecipientModel>> search(@RequestParam String query) {
        LLogging.info("search()");
        return recipientService.search(query);
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        return recipientService.count();
    }

    @Override
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        LLogging.info("exists()");
        return recipientService.exists(id);
    }
}
