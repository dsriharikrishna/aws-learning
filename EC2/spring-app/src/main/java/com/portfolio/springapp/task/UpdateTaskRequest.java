package com.portfolio.springapp.task;

import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        String title,

        String description,

        TaskStatus status,

        TaskPriority priority
) {}

