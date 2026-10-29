# Linux Advanced & System Administration Commands Guide

The natural next step after Intermediate. This guide focuses on **System Administration, Automations, Storage, User Security, and Network Triage** essential for managing production servers and cloud environments.

---

## 1. Task Scheduling & Automation (`cron` / `crontab`, `at`)

Automate backups, log cleanups, and routine maintenance scripts.

```bash
# Edit crontab for current user
crontab -e

# View scheduled cron jobs
crontab -l

# Remove all cron jobs for current user
crontab -r

# Edit crontab for a specific user (requires sudo)
sudo crontab -u ubuntu -e
```

### Cron Format Syntax:
```text
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * * <command-to-execute>
```

**Common Examples:**
- `0 2 * * * /scripts/backup.sh` — Every day at 2:00 AM
- `*/15 * * * * /scripts/healthcheck.sh` — Every 15 minutes
- `0 0 * * 0 /scripts/weekly_cleanup.sh` — Every Sunday at midnight
- `@reboot /scripts/start_app.sh` — Run once on system reboot

---

## 2. User, Group & Security Management (`useradd`, `usermod`, `sudoers`)

```bash
# Add a new user with home directory and bash shell
sudo useradd -m -s /bin/bash devops_user

# Set or reset password for a user
sudo passwd devops_user

# Add user to a secondary group (e.g., sudo or docker)
sudo usermod -aG sudo devops_user
sudo usermod -aG docker devops_user

# Delete a user and remove their home directory
sudo userdel -r devops_user

# Create and manage groups
sudo groupadd developers
sudo groupdel developers

# Edit sudo privileges safely (validates syntax before saving)
sudo visudo
```

---

## 3. Storage, Mounts & Filesystems (`lsblk`, `fdisk`, `mount`, `mkfs`)

Essential for attaching and managing AWS EBS volumes or storage disks.

```bash
# List all block devices (disks, partitions, EBS volumes)
lsblk -f

# Check partition tables
sudo fdisk -l

# Format a partition with ext4 filesystem
sudo mkfs -t ext4 /dev/xvdf

# Create mount directory and mount volume
sudo mkdir -p /data
sudo mount /dev/xvdf /data

# Unmount volume safely
sudo umount /data

# Make mount permanent across reboots by editing fstab:
# Get volume UUID
sudo blkid
# Add entry inside /etc/fstab:
# UUID=xxxx-xxxx /data ext4 defaults,nofail 0 2
```

---

## 4. Services & Daemon Control (`systemd` / `systemctl`)

Creating and managing background services.

### Core Commands:
```bash
# Check status of any service
sudo systemctl status nginx

# Start, stop, restart, reload
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

# Enable service to automatically start on boot
sudo systemctl enable nginx
sudo systemctl disable nginx

# View all failed services on the machine
systemctl --failed

# Reload systemd when you modify unit configuration files
sudo systemctl daemon-reload
```

### Creating your own custom Service:
File: `/etc/systemd/system/myapp.service`
```ini
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
Activate it:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

---

## 5. System Logs & Journal Management (`journalctl`, `logrotate`)

```bash
# Follow live logs of a specific service
journalctl -u myapp.service -f

# View logs from current boot only
journalctl -b

# View logs from a specific timeframe
journalctl -u nginx --since "2 hours ago"
journalctl -u nginx --since "2026-10-27 10:00:00" --until "2026-10-27 12:00:00"

# Check disk space used by system logs
journalctl --disk-usage

# Clean logs older than 7 days
sudo journalctl --vacuum-time=7d
```

---

## 6. Advanced Networking & Firewall (`ip`, `ss`, `ufw`, `iptables`)

```bash
# Show IP address of all interfaces
ip -br addr show

# Show routing table and default gateway
ip route show

# List all listening TCP and UDP sockets with process names
sudo ss -tulpn

# UFW Firewall (Ubuntu/Debian)
sudo ufw status verbose
sudo ufw allow 22/tcp       # Allow SSH
sudo ufw allow 80/tcp       # Allow HTTP
sudo ufw allow 443/tcp      # Allow HTTPS
sudo ufw enable
```

---

## 7. SSH Configuration & Key Hardening (`ssh`, `ssh-keygen`, `config`)

```bash
# Generate a modern Ed25519 SSH key pair
ssh-keygen -t ed25519 -C "admin@company.com"

# Set strict permissions required by SSH (will reject connection if too open!)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 400 /path/to/sample-key.pem

# Copy public key to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@<server-ip>

# Keep SSH shortcuts in ~/.ssh/config:
# Host my-ec2
#     HostName 54.210.12.34
#     User ubuntu
#     IdentityFile ~/AWS/KEYS/sample-key.pem
# Then connect simply using:
# ssh my-ec2
```

---

## 8. Performance Monitoring & Diagnostics (`vmstat`, `iostat`, `sar`)

```bash
# CPU, memory, paging, I/O in 2-second intervals
vmstat 2 5

# Disk I/O activity and wait times
iostat -xz 2 5

# Memory details
cat /proc/meminfo
```
