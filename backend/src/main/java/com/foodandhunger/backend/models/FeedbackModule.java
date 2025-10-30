package com.foodandhunger.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "feedbacks")
public class FeedbackModule {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private int id;

    @Setter
    @Getter
    private int userId;
    @Setter
    @Getter
    private String message;
    @Setter
    @Getter
    private int star;

    FeedbackModule(){}
    FeedbackModule(int userId, String message, int star){
        this.userId = userId;
        this.message = message;
        this.star = star;
    }
}
