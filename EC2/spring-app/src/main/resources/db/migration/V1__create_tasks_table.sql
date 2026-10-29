CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

INSERT INTO tasks (id, title, description, status, priority, created_at, updated_at) VALUES
('b0e77d54-6b2a-4318-80e1-7ecf6424b901', 'Configure EC2 Autoscaling', 'Set up launch template and dynamic scaling policies based on CPU metric', 'TODO', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b0e77d54-6b2a-4318-80e1-7ecf6424b902', 'Provision Multi-AZ RDS Postgres', 'Configure primary-standby replica with automated snapshots', 'IN_PROGRESS', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b0e77d54-6b2a-4318-80e1-7ecf6424b903', 'Integrate CloudWatch Alarms', 'Configure SNS notification topic for latency and 5xx rate alerts', 'TODO', 'MEDIUM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b0e77d54-6b2a-4318-80e1-7ecf6424b904', 'Set up IAM Least Privilege Role', 'Create IAM instance profile with limited S3 and SecretsManager permissions', 'DONE', 'HIGH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b0e77d54-6b2a-4318-80e1-7ecf6424b905', 'Nginx Reverse Proxy Hardening', 'Enable SSL termination and rate limiting per client IP', 'DONE', 'LOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

