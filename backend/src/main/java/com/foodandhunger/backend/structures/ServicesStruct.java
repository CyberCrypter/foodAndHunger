package com.foodandhunger.backend.structures;

import java.util.List;
import java.util.Optional;

public interface ServicesStruct<T> {
    Optional<T> getById(int id);
    List<T> getAll();  // removed unnecessary 'int id' parameter
    boolean updateById(int id, T entity);
    boolean create(T entity);
    boolean delete(int id);
}
