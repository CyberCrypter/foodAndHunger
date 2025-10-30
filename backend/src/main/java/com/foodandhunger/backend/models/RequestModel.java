package com.foodandhunger.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

public class RequestModel {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id ;

    @Getter
    @Setter
    private String title;
    @Getter
    @Setter
    private String description;
    @Getter
    @Setter
    private double amount;
    @Getter
    @Setter
    private String location;
    @Getter
    @Setter
    private String type; // veg, non-veg

    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;


    RequestModel(){}
    RequestModel(String title, String description, double amount, String location){
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.location = location;
    }
}
