package com.foodandhunger.backend.services;

import com.foodandhunger.backend.models.FeedbackModel;
import com.foodandhunger.backend.repository.FeedbackRepo;
import com.foodandhunger.backend.structures.ServicesStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService implements ServicesStruct<FeedbackModel> {

    @Autowired
    FeedbackRepo feedbackRepo;

    @Override
    public Optional<FeedbackModel> getById(int id) {
        LLogging.info("getById()");
        try {
            Optional<FeedbackModel> existing = feedbackRepo.findById(id);
            existing.ifPresentOrElse(
                    f -> LLogging.info("Feedback found: " + f.getMessage()),
                    () -> LLogging.warn("Feedback not found, id: " + id)
            );
            return existing;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<FeedbackModel> getAll() {
        LLogging.info("getAll()");
        try {
            List<FeedbackModel> feedbacks = feedbackRepo.findAll();
            if (feedbacks.isEmpty()) {
                LLogging.warn("No feedbacks found");
            } else {
                LLogging.info("Fetched " + feedbacks.size() + " feedbacks");
            }
            return feedbacks;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return List.of();
        }
    }

    @Override
    public boolean updateById(int id, FeedbackModel entity) {
        LLogging.info("updateById()");
        try {
            FeedbackModel existing = feedbackRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));
            existing.setUserId(entity.getUserId());
            existing.setMessage(entity.getMessage());
            existing.setStar(entity.getStar());
            feedbackRepo.save(existing);
            LLogging.info("Feedback updated successfully for id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public boolean create(FeedbackModel entity) {
        LLogging.info("create()");
        try {
            feedbackRepo.save(entity);
            LLogging.info("Feedback saved: " + entity.getMessage());
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
            if (!feedbackRepo.existsById(id)) {
                LLogging.warn("Feedback not found, cannot delete");
                return false;
            }
            feedbackRepo.deleteById(id);
            LLogging.info("Feedback deleted, id: " + id);
            return true;
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return false;
        }
    }

    @Override
    public ResponseEntity<List<FeedbackModel>> search(String query) {
        LLogging.info("search()");
        try {
            List<FeedbackModel> results = feedbackRepo.findByMessageContainingIgnoreCase(query);
            if (results.isEmpty()) {
                LLogging.warn("No feedback found for query: " + query);
            } else {
                LLogging.info("Found " + results.size() + " feedback entries");
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
            long total = feedbackRepo.count();
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
            boolean exists = feedbackRepo.existsById(id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            LLogging.error(e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
