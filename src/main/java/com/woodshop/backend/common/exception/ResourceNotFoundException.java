package com.woodshop.backend.common.exception;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resourceName, Object id) {
        super(resourceName + " not found with id " + id, 404);
    }
}
