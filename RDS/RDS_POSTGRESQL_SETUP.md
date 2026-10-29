# Amazon RDS PostgreSQL Setup & Multi-Microservice Isolation Guide

This guide details best practices for configuring a shared, highly available Amazon RDS PostgreSQL instance hosting four isolated databases for independent EC2 microservices (`express-app`, `nest-app`, `fastapi-app`, `spring-app`).

---

## 1. AWS RDS PostgreSQL Provisioning (AWS CLI)

### 1.1 Create DB Subnet Group (Private Subnets Only)
```bash
aws rds create-db-subnet-group \
    --db-subnet-group-name rds-private-subnet-group \
    --db-subnet-group-description "Private database subnet group across multiple AZs" \
    --subnet-ids "subnet-0a1b2c3d4e5f60001" "subnet-0a1b2c3d4e5f60002"
```

### 1.2 Create DB Security Group
Allow ingress on port 5432 **strictly** from the EC2 application security group:
```bash
# Get EC2 Security Group ID
EC2_SG_ID="sg-0123456789abcdef0"

# Create RDS Security Group
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name "rds-postgres-sg" \
    --description "Allow Postgres inbound from EC2 app security group only" \
    --vpc-id "vpc-0123456789abcdef0" \
    --query 'GroupId' --output text)

# Authorize inbound traffic
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $EC2_SG_ID
```

### 1.3 Provision Multi-AZ RDS PostgreSQL Instance
```bash
aws rds create-db-instance \
    --db-instance-identifier ec2-portfolio-rds-postgres \
    --db-instance-class db.t4g.medium \
    --engine postgres \
    --engine-version 16.3 \
    --master-username masteradmin \
    --master-user-password "YourSecureMasterPassword123!" \
    --allocated-storage 50 \
    --max-allocated-storage 200 \
    --storage-type gp3 \
    --storage-encrypted \
    --multi-az \
    --no-publicly-accessible \
    --db-subnet-group-name rds-private-subnet-group \
    --vpc-security-group-ids $RDS_SG_ID \
    --backup-retention-period 7 \
    --auto-minor-version-upgrade \
    --deletion-protection
```

---

## 2. Multi-Tenant Database & Least Privilege IAM/User Isolation

To guarantee full independence, each backend microservice connects with its own distinct database user restricted strictly to its dedicated database.

Connect as `masteradmin`:
```bash
psql "host=ec2-portfolio-rds-postgres.xxxxxx.ap-south-1.rds.amazonaws.com user=masteradmin dbname=postgres sslmode=require"
```

Execute initialization script:

```sql
-- 1. Create independent databases
CREATE DATABASE expressdb;
CREATE DATABASE nestdb;
CREATE DATABASE fastapidb;
CREATE DATABASE springdb;

-- Revoke default public connection permissions
REVOKE ALL ON DATABASE expressdb FROM PUBLIC;
REVOKE ALL ON DATABASE nestdb FROM PUBLIC;
REVOKE ALL ON DATABASE fastapidb FROM PUBLIC;
REVOKE ALL ON DATABASE springdb FROM PUBLIC;

-- 2. Create restricted database users
CREATE USER expressuser WITH ENCRYPTED PASSWORD 'ExpressProdPass2026!';
CREATE USER nestuser WITH ENCRYPTED PASSWORD 'NestProdPass2026!';
CREATE USER fastapiuser WITH ENCRYPTED PASSWORD 'FastAPIProdPass2026!';
CREATE USER springuser WITH ENCRYPTED PASSWORD 'SpringProdPass2026!';

-- 3. Grant connection privileges strictly to matching databases
GRANT CONNECT ON DATABASE expressdb TO expressuser;
GRANT CONNECT ON DATABASE nestdb TO nestuser;
GRANT CONNECT ON DATABASE fastapidb TO fastapiuser;
GRANT CONNECT ON DATABASE springdb TO springuser;

-- 4. Set schema permissions within each database
-- Connect to expressdb:
\c expressdb
GRANT ALL ON SCHEMA public TO expressuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO expressuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO expressuser;

-- Connect to nestdb:
\c nestdb
GRANT ALL ON SCHEMA public TO nestuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nestuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO nestuser;

-- Connect to fastapidb:
\c fastapidb
GRANT ALL ON SCHEMA public TO fastapiuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fastapiuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fastapiuser;

-- Connect to springdb:
\c springdb
GRANT ALL ON SCHEMA public TO springuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO springuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO springuser;
```

---

## 3. Microservice Connection Strings

| Application | Engine/Driver | Environment Variable Format |
|---|---|---|
| **Express** (`port 3001`) | Prisma ORM | `DATABASE_URL="postgresql://expressuser:ExpressProdPass2026!@rds-host:5432/expressdb?sslmode=require"` |
| **NestJS** (`port 3002`) | Prisma ORM | `DATABASE_URL="postgresql://nestuser:NestProdPass2026!@rds-host:5432/nestdb?sslmode=require"` |
| **FastAPI** (`port 3003`) | SQLAlchemy / asyncpg | `DATABASE_URL="postgresql+asyncpg://fastapiuser:FastAPIProdPass2026!@rds-host:5432/fastapidb?ssl=require"` |
| **Spring Boot** (`port 3004`) | JDBC Driver | `DATABASE_URL="jdbc:postgresql://rds-host:5432/springdb?sslmode=require"`<br>`DATABASE_USERNAME="springuser"`<br>`DATABASE_PASSWORD="SpringProdPass2026!"` |

---

## 4. Production Checklist
- [x] Multi-AZ deployment for zero-downtime failover
- [x] Storage encrypted at rest via AWS KMS (`aws/rds`)
- [x] In-transit TLS/SSL enforcement (`sslmode=require`)
- [x] Automated daily backup snapshot retention (7-30 days)
- [x] Subnets completely isolated with no Internet Gateway attached

