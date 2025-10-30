package com.foodandhunger.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="donations")
public class DonationModel {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private int id;

    @Setter
    @Getter
    private String title;
    @Setter
    @Getter
    private String description;
    @Setter
    @Getter
    private byte[] photo;
    @Setter
    @Getter
    private String location;
    @Getter
    @Setter
    private String type;
    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public DonationModel(){}
    public DonationModel(String title, String description, byte[] photo, String location, String type){
        this.title = title;
        this.description = description;
        this.photo = photo;
        this.location = location;
    }
}