package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.RequestModel;
import com.foodandhunger.backend.services.RequestService;
import com.foodandhunger.backend.structures.ControllerStruct;
import com.foodandhunger.backend.utils.LLogging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request")
public class RequestController implements ControllerStruct<RequestModel> {

    @Autowired
    RequestService requestService;

    @Override
    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody RequestModel entity) {
        LLogging.info("create()");
        try {
            boolean save = requestService.create(entity);
            if (save) {
                LLogging.info("Request added successfully");
                return ResponseEntity.ok("Request added successfully");
            } else {
                LLogging.warn("Request could not be saved");
                return ResponseEntity.status(400).body("Failed to add request");
            }
        } catch (Exception e) {
            LLogging.error("something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<RequestModel> get(@PathVariable int id) {
        LLogging.info("get()");
        try {
            return requestService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> {
                        LLogging.warn("Request not found");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            LLogging.error("something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<List<RequestModel>> getAll() {
        LLogging.info("getAll()");
        try {
            List<RequestModel> result = requestService.getAll();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            LLogging.error("something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }


    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<RequestModel> update(@PathVariable int id, @RequestBody RequestModel entity) {
        LLogging.info("update()");
        try {
            boolean updated = requestService.updateById(id, entity);
            if (updated) {
                LLogging.info("Request updated successfully");
                return ResponseEntity.ok(entity);
            } else {
                return ResponseEntity.status(404).build();
            }
        } catch (Exception e) {
            LLogging.error("something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        LLogging.info("delete()");
        try {
            boolean deleted = requestService.delete(id);
            if (deleted) {
                LLogging.info("Request deleted successfully");
                return ResponseEntity.ok("Request deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Request not found");
            }
        } catch (Exception e) {
            LLogging.error("something went wrong: " + e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/search")
    public ResponseEntity<List<RequestModel>> search(@RequestParam String query) {
        LLogging.info("search()");
        return requestService.search(query);
    }

    @Override
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        LLogging.info("count()");
        return requestService.count();
    }

    @Override
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        LLogging.info("exists()");
        return requestService.exists(id);
    }
}
