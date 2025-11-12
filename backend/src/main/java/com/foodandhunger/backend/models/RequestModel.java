package com.foodandhunger.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="requests")
@Getter
@Setter
public class RequestModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String description;
    private double amount;
    private String location;
    private String address;
    private String type;         // e.g. veg, non-veg
    private String status = "pending"; // pending | approved | completed
    private String photo;        // optional image of requested item

    private int userId;          // who created this request

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public RequestModel() {}
    public RequestModel(String title, String address, String description, double amount, String location) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.location = location;
        this.address = address;
    }
}
