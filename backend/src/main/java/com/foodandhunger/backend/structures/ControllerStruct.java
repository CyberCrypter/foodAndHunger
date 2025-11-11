package com.foodandhunger.backend.structures;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ControllerStruct<T>{
    ResponseEntity<String> create(T entity);
    ResponseEntity<T> get(  int id);
    ResponseEntity<List<T>> getAll();
    ResponseEntity<T> update(int id, T entity);
    ResponseEntity<String> delete( int id);


    ResponseEntity<List<T>> search( String query); // e.g. search donors by name
    ResponseEntity<Long> count(); // total records
    ResponseEntity<Boolean> exists( int id); // check if entity exists
}
