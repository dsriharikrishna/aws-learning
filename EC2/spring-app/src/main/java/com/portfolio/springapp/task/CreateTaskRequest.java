package com.portfolio.springapp.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        String title,

        String description,

        TaskStatus status,

        TaskPriority priority
) {}

