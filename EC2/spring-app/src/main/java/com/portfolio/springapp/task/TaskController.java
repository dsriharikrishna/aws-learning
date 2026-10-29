package com.portfolio.springapp.task;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Tasks", description = "CRUD operations for Tasks")
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Create task")
    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @Operation(summary = "List tasks with pagination and filters")
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TaskStatus status
    ) {
        return ResponseEntity.ok(taskService.listTasks(page, limit, search, status));
    }

    @Operation(summary = "Get task by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTask(id));
    }

    @Operation(summary = "Update task by ID")
    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @Operation(summary = "Delete task by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}

