package com.foodandhunger.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="recipients")
public class RecipientModel {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private String name;
    private int age;
    private String address;
    private String organizationName;
    private String pan;
    private String aadhaar;
    private String phone;
    private String email;
    private String organization_certificate_id;

    // Store binary data for images or certificates
    private byte[] organizationCertificate;
    private byte[] photo;
    private byte[] signature;

    public RecipientModel(){}
    public RecipientModel(int userId, String name, int age, String address, String organizationName, String pan, String aadhaar, String phone, String email, String organization_certificate_id ){
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
