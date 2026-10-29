package com.portfolio.springapp.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private final TaskResponse sampleTask = new TaskResponse(
            "task-uuid-1234",
            "Deploy to AWS EC2",
            "Set up multi-stage container deployment",
            TaskStatus.TODO,
            TaskPriority.HIGH,
            Instant.now(),
            Instant.now()
    );

    @Test
    void createTask_returns201_whenValid() throws Exception {
        Mockito.when(taskService.createTask(any(CreateTaskRequest.class))).thenReturn(sampleTask);

        CreateTaskRequest req = new CreateTaskRequest("Deploy to AWS EC2", "Set up multi-stage container deployment", TaskStatus.TODO, TaskPriority.HIGH);

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("task-uuid-1234"))
                .andExpect(jsonPath("$.title").value("Deploy to AWS EC2"));
    }

    @Test
    void createTask_returns400_whenTitleMissing() throws Exception {
        CreateTaskRequest req = new CreateTaskRequest("", "missing title", TaskStatus.TODO, TaskPriority.HIGH);

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listTasks_returns200_withPagination() throws Exception {
        Mockito.when(taskService.listTasks(1, 10, null, null))
                .thenReturn(Map.of("data", List.of(sampleTask), "total", 1, "page", 1, "limit", 10, "totalPages", 1));

        mockMvc.perform(get("/tasks?page=1&limit=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.data[0].id").value("task-uuid-1234"));
    }

    @Test
    void getTask_returns404_whenNotFound() throws Exception {
        Mockito.when(taskService.getTask(eq("non-existent")))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        mockMvc.perform(get("/tasks/non-existent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_returns204_whenSuccess() throws Exception {
        Mockito.doNothing().when(taskService).deleteTask("task-uuid-1234");

        mockMvc.perform(delete("/tasks/task-uuid-1234"))
                .andExpect(status().isNoContent());
    }
}

