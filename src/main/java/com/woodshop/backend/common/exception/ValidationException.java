package com.woodshop.backend.common.exception;

import java.util.Map;

public class ValidationException extends ApiException {
    private final Map<String, String> errors;

    public ValidationException(Map<String, String> errors) {
        super("Validation failed", 422);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
