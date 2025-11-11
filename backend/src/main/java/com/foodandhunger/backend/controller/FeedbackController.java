package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.FeedbackModel;
import com.foodandhunger.backend.services.FeedbackService;
import com.foodandhunger.backend.structures.ControllerStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController implements ControllerStruct<FeedbackModel> {

    @Autowired
    FeedbackService feedbackService;

    @Override
    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody FeedbackModel entity) {
        LLogging.info("create()");
        try {
            boolean created = feedbackService.create(entity);
            if (created) {
                LLogging.info("Feedback added successfully");
                return ResponseEntity.ok("Feedback added successfully");
            } else {
                LLogging.warn("Failed to add feedback");
                return ResponseEntity.status(400).body("Failed to add feedback");
            }
        } catch (Exception e) {
            LLogging.error("Something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackModel> get(@PathVariable int id) {
        LLogging.info("get()");
        try {
            return feedbackService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        LLogging.warn("Feedback not found, id: " + id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            LLogging.error("Error fetching feedback: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<List<FeedbackModel>> getAll() {
        LLogging.info("getAll()");
        try {
            List<FeedbackModel> result = feedbackService.getAll();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LLogging.error("Error fetching all feedback: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<FeedbackModel> update(@PathVariable int id, @RequestBody FeedbackModel entity) {
        LLogging.info("update()");
        try {
            boolean updated = feedbackService.updateById(id, entity);
            if (updated) {
                LLogging.info("Feedback updated successfully");
                return ResponseEntity.ok(entity);
            } else {
                return ResponseEntity.status(404).build();
            }
        } catch (Exception e) {
            LLogging.error("Error updating feedback: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        LLogging.info("delete()");
        try {
            boolean deleted = feedbackService.delete(id);
            if (deleted) {
                LLogging.info("Feedback deleted successfully");
                return ResponseEntity.ok("Feedback deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Feedback not found");
            }
        } catch (Exception e) {
            LLogging.error("Error deleting feedback: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/search")
    public ResponseEntity<List<FeedbackModel>> search(@RequestParam String query) {
        LLogging.info("search()");
        return feedbackService.search(query);
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        return feedbackService.count();
    }

    @Override
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        LLogging.info("exists()");
        return feedbackService.exists(id);
    }
}
