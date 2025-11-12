package com.foodandhunger.backend.controller;

import com.foodandhunger.backend.models.RequestModel;
import com.foodandhunger.backend.services.RequestService;
import com.foodandhunger.backend.structures.ControllerStruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/request")
public class RequestController implements ControllerStruct<RequestModel> {

    @Autowired
    private RequestService requestService;

    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody RequestModel entity) {
        return requestService.create(entity)
                ? ResponseEntity.ok("Request added successfully")
                : ResponseEntity.status(400).body("Failed to add request");
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestModel> get(@PathVariable int id) {
        return requestService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<RequestModel>> getAll() {
        return ResponseEntity.ok(requestService.getAll());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RequestModel> update(@PathVariable int id, @RequestBody RequestModel entity) {
        boolean updated = requestService.updateById(id, entity);
        return updated ? ResponseEntity.ok(entity) : ResponseEntity.status(404).build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        return requestService.delete(id)
                ? ResponseEntity.ok("Request deleted successfully")
                : ResponseEntity.status(404).body("Request not found");
    }

    @GetMapping("/search")
    public ResponseEntity<List<RequestModel>> search(@RequestParam String query) {
        return requestService.search(query);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return requestService.count();
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> exists(@PathVariable int id) {
        return requestService.exists(id);
    }

    //  New: Requests by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RequestModel>> getByUser(@PathVariable int userId) {
        return requestService.getByUser(userId);
    }

    //  New: Requests by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<RequestModel>> getByLocation(@PathVariable String location) {
        return requestService.getByLocation(location);
    }

    //  New: Requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RequestModel>> getByStatus(@PathVariable String status) {
        return requestService.getByStatus(status);
    }

    //  New: Upload photo for request
    @PostMapping(value = "/{id}/photo", consumes = {"multipart/form-data"})
    public ResponseEntity<RequestModel> uploadPhoto(@PathVariable int id,
                                                    @RequestParam("photo") MultipartFile photo) {
        return requestService.uploadPhoto(id, photo);
    }
}
