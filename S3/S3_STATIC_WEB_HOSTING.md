# Amazon S3 Static Website Hosting & File Upload Guide

Complete reference notes for hosting a static website (Next.js / HTML / React) on **Amazon S3** and uploading files using the **AWS CLI**.

---

## 1. Prerequisites

1. **AWS CLI** installed and configured:
   ```bash
   aws --version
   aws configure
   ```
2. Check caller identity:
   ```bash
   aws sts get-caller-identity
   ```

---

## 2. Step-by-Step CLI Commands

### Step 1: Create an S3 Bucket

> S3 bucket names must be globally unique across all AWS accounts.

- For **regions other than `us-east-1`** (e.g., Mumbai `ap-south-1`):
  ```bash
  aws s3api create-bucket \
    --bucket my-portfolio-bucket-name \
    --region ap-south-1 \
    --create-bucket-configuration LocationConstraint=ap-south-1
  ```
- For **`us-east-1`**:
  ```bash
  aws s3api create-bucket \
    --bucket my-portfolio-bucket-name \
    --region us-east-1
  ```

---

### Step 2: Disable S3 Block Public Access

To allow public read access for website visitors:

```bash
aws s3api put-public-access-block \
  --bucket my-portfolio-bucket-name \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

---

### Step 3: Apply Public Read Bucket Policy

1. Create a file named `bucket-policy.json`:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::my-portfolio-bucket-name/*"
           }
       ]
   }
   ```
   *(Replace `my-portfolio-bucket-name` with your actual bucket name)*

2. Apply the policy to the bucket:
   ```bash
   aws s3api put-bucket-policy \
     --bucket my-portfolio-bucket-name \
     --policy file://bucket-policy.json
   ```

---

### Step 4: Enable Static Website Hosting

Configure the index and error documents:

```bash
aws s3api put-bucket-website \
  --bucket my-portfolio-bucket-name \
  --website-configuration '{
      "IndexDocument": { "Suffix": "index.html" },
      "ErrorDocument": { "Key": "404.html" }
  }'
```

---

### Step 5: Build & Upload Files

#### Next.js Static Export:
```bash
cd portfolio
pnpm run build
```
*(Next.js generates the static website files inside the `out/` folder)*

#### Upload Files with Optimal Caching:

1. **Upload immutable static assets (`_next/`) with long cache (1 year):**
   ```bash
   aws s3 sync out/_next s3://my-portfolio-bucket-name/_next \
     --cache-control "public, max-age=31536000, immutable" \
     --delete
   ```

2. **Upload HTML, images, and root files with instant revalidation:**
   ```bash
   aws s3 sync out s3://my-portfolio-bucket-name \
     --exclude "_next/*" \
     --cache-control "public, max-age=0, must-revalidate" \
     --delete
   ```

---

## 3. Website Endpoint URL Format

Once configured, your static website is accessible at the S3 Website Endpoint:

| AWS Region | Endpoint URL Format | Example |
| :--- | :--- | :--- |
| **ap-south-1** (Mumbai) | `http://<bucket-name>.s3-website.ap-south-1.amazonaws.com` | `http://my-portfolio-bucket-name.s3-website.ap-south-1.amazonaws.com` |
| **ap-south-2** (Hyderabad) | `http://<bucket-name>.s3-website.ap-south-2.amazonaws.com` | `http://my-portfolio-bucket-name.s3-website.ap-south-2.amazonaws.com` |
| **us-east-1** (N. Virginia) | `http://<bucket-name>.s3-website-us-east-1.amazonaws.com` | `http://my-portfolio-bucket-name.s3-website-us-east-1.amazonaws.com` |

---

## 4. Useful Management Commands

- **List files in bucket:**
  ```bash
  aws s3 ls s3://my-portfolio-bucket-name/
  ```

- **Upload a single file (e.g. resume or image):**
  ```bash
  aws s3 cp resume.pdf s3://my-portfolio-bucket-name/docs/resume.pdf
  ```

- **Empty the bucket (delete all files):**
  ```bash
  aws s3 rm s3://my-portfolio-bucket-name/ --recursive
  ```

- **Delete the bucket completely:**
  ```bash
  aws s3 rb s3://my-portfolio-bucket-name --force
  ```

