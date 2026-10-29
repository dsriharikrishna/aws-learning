# Independent AWS EC2 Multi-Server Deployment Guide

This guide details deploying **4 completely independent applications on 4 separate AWS EC2 instances**. Each application is entirely self-contained with its own **dedicated Nginx reverse proxy**, **independent Dockerfile**, and **dedicated docker-compose stack**.

---

## 1. Multi-Server Isolated Architecture

Each application lives in its own directory, deployed to its own dedicated EC2 instance with its own local Nginx reverse proxy listening on Port 80:

```
[ Internet / Traffic ]
       │
       ├─────────────────────────► EC2 Instance 1 (Express Service)
       │                           ├── Nginx (Port 80) -> proxy_pass to express-app:3001
       │                           └── express-app:3001
       │
       ├─────────────────────────► EC2 Instance 2 (NestJS Service)
       │                           ├── Nginx (Port 80) -> proxy_pass to nest-app:3002
       │                           └── nest-app:3002
       │
       ├─────────────────────────► EC2 Instance 3 (FastAPI Service)
       │                           ├── Nginx (Port 80) -> proxy_pass to fastapi-app:3003
       │                           └── fastapi-app:3003
       │
       └─────────────────────────► EC2 Instance 4 (Spring Boot Service)
                                   ├── Nginx (Port 80) -> proxy_pass to spring-app:3004
                                   └── spring-app:3004

                                          │ │ │ │
                                          ▼ ▼ ▼ ▼
                             [ Amazon RDS PostgreSQL Multi-AZ ]
                         (expressdb, nestdb, fastapidb, springdb)
```

---

## 2. Directory Layout (Zero Clubbing)

Every service directory is completely standalone and deployable in total isolation:

```
EC2/
├── express-app/
│   ├── nginx.conf           <-- Dedicated Nginx proxy for Express
│   ├── docker-compose.yml   <-- Launches Nginx + Express + PostgreSQL
│   ├── Dockerfile           <-- Independent multi-stage build
│   └── src/
├── nest-app/
│   ├── nginx.conf           <-- Dedicated Nginx proxy for NestJS
│   ├── docker-compose.yml   <-- Launches Nginx + NestJS + PostgreSQL
│   ├── Dockerfile           <-- Independent multi-stage build
│   └── src/
├── fastapi-app/
│   ├── nginx.conf           <-- Dedicated Nginx proxy for FastAPI
│   ├── docker-compose.yml   <-- Launches Nginx + FastAPI + PostgreSQL
│   ├── Dockerfile           <-- Independent container build
│   └── app/
└── spring-app/
    ├── nginx.conf           <-- Dedicated Nginx proxy for Spring Boot
    ├── docker-compose.yml   <-- Launches Nginx + Spring Boot + PostgreSQL
    ├── Dockerfile           <-- Independent Maven + JDK runner build
    └── src/
```

---

## 3. EC2 Provisioning Checklist (Per Server)

For each microservice, provision a separate EC2 instance in AWS:

| Service | Recommended Instance Type | Open Ports (Security Group) | Target RDS Database |
|---|---|---|---|
| **Express App** | `t3.small` / `t4g.small` | 80 (HTTP), 443 (HTTPS), 22 (SSH) | `expressdb` (5432) |
| **NestJS App** | `t3.small` / `t4g.small` | 80 (HTTP), 443 (HTTPS), 22 (SSH) | `nestdb` (5432) |
| **FastAPI App** | `t3.small` / `t4g.small` | 80 (HTTP), 443 (HTTPS), 22 (SSH) | `fastapidb` (5432) |
| **Spring Boot App** | `t3.medium` / `t4g.medium` | 80 (HTTP), 443 (HTTPS), 22 (SSH) | `springdb` (5432) |

---

## 4. Server Setup & Docker Installation (Run on each EC2)

Connect via SSH:
```bash
ssh -i /path/to/key.pem ubuntu@<EC2_INSTANCE_PUBLIC_IP>
```

Install Docker and Docker Compose plugin:
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker
```

---

## 5. Deployment Procedures for Each Individual Server

### Server 1: Express Application
On EC2 Instance #1:
```bash
mkdir -p /opt/app && cd /opt/app
# Copy or git sparse-checkout only the express-app folder:
git clone <REPO_URL> .
cd EC2/express-app

# Optional: To connect to Amazon RDS instead of local container db:
# export DATABASE_URL="postgresql://expressuser:expresspass@<rds-endpoint>:5432/expressdb"

docker compose up -d --build

# Verify
curl http://localhost/health
curl http://localhost/api/express/health
```

### Server 2: NestJS Application
On EC2 Instance #2:
```bash
mkdir -p /opt/app && cd /opt/app
git clone <REPO_URL> .
cd EC2/nest-app

# Optional RDS override:
# export DATABASE_URL="postgresql://nestuser:nestpass@<rds-endpoint>:5432/nestdb?schema=public"

docker compose up -d --build

# Verify
curl http://localhost/health
curl http://localhost/api/nest/health
```

### Server 3: FastAPI Application
On EC2 Instance #3:
```bash
mkdir -p /opt/app && cd /opt/app
git clone <REPO_URL> .
cd EC2/fastapi-app

# Optional RDS override:
# export DATABASE_URL="postgresql+asyncpg://fastapiuser:fastapipass@<rds-endpoint>:5432/fastapidb"

docker compose up -d --build

# Verify
curl http://localhost/health
curl http://localhost/api/fastapi/health
```

### Server 4: Spring Boot Application
On EC2 Instance #4:
```bash
mkdir -p /opt/app && cd /opt/app
git clone <REPO_URL> .
cd EC2/spring-app

# Optional RDS override:
# export DATABASE_URL="jdbc:postgresql://<rds-endpoint>:5432/springdb"
# export DATABASE_USERNAME="springuser"
# export DATABASE_PASSWORD="springpass"

docker compose up -d --build

# Verify
curl http://localhost/health
curl http://localhost/api/spring/health
```

---

## 6. Zero Downtime Updates per Service

To update any application on its dedicated EC2 server without affecting any other service:
```bash
cd /opt/app/EC2/<application-name>
git pull origin main
docker compose build <service-name>
docker compose up -d --no-deps <service-name>
```
To reload Nginx on that specific EC2 server:
```bash
docker compose exec nginx nginx -s reload
```
