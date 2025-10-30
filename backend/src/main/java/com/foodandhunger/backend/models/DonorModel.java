package com.foodandhunger.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="donors")
public class DonorModel {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private int id;

    @Setter
    @Getter
    private int userId ;
    @Setter
    @Getter
    private String name;
    @Setter
    @Getter
    private int age;
    @Setter
    @Getter
    private String address;
    @Setter
    @Getter
    private String organizationName;
    @Setter
    @Getter
    private String pan;
    @Setter
    @Getter
    private String aadhaar;
    @Setter
    @Getter
    private String phone;
    @Setter
    @Getter
    private String email;
    @Setter
    @Getter
    private String organization_certificate_id;

    // Store binary data for images or certificates
    private byte[] organizationCertificate;
    private byte[] photo;
    private byte[] signature;

    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public DonorModel(int userId, String name, int age, String address, String organizationName, String pan, String aadhaar, String phone, String email, String organization_certificate_id ){
        this.userId=userId;
        this.name = name;
        this.age =age ;
        this.address =address ;
        this.organizationName =organizationName ;
        this.pan =pan ;
        this.aadhaar =aadhaar ;
        this.phone =phone ;
        this.email =email ;
        this.organization_certificate_id =organization_certificate_id ;
    }
}
