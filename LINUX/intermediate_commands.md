# Linux Intermediate Commands Guide

Ready to level up from the basics? This guide covers the essential day-to-day intermediate Linux commands used by developers, DevOps, and cloud engineers.

---

## 1. Pipes & Redirection (`|`, `>`, `>>`, `2>`)

Connecting commands together and controlling where output goes.

| Operator / Command | What It Does | Example |
| :--- | :--- | :--- |
| `>` | Redirect output to a file (**overwrites** existing content) | `echo "first line" > output.txt` |
| `>>` | Redirect output and **append** to the end of a file | `echo "second line" >> output.txt` |
| `2>` | Redirect **errors** (stderr) to a file | `ls /fake-folder 2> error.log` |
| `&>` | Redirect **both** output and errors into one file | `command &> all_output.log` |
| `\|` (pipe) | Send output of the left command as input to the right | `cat names.txt \| sort` |
| `tee` | Write output to the screen **and** save to a file at the same time | `echo "Hello" \| tee output.txt` |

---

## 2. Text Processing & Data Extraction (`grep`, `awk`, `sed`, `sort`, `uniq`)

Powerful tools for searching, filtering, and transforming text data.

### `grep` (Search text)
```bash
# Search recursively in all files inside a folder
grep -r "DATABASE_URL" ./config/

# Case-insensitive search with line numbers
grep -in "error" app.log

# Invert match (show all lines that DO NOT match)
grep -v "DEBUG" app.log

# Show 3 lines before (B) and after (A) matching line
grep -C 3 "Exception" app.log
```

### `awk` (Extract columns/fields)
```bash
# Print only 1st and 3rd columns from a file
awk '{print $1, $3}' data.txt

# Use custom separator (e.g. colon in /etc/passwd)
awk -F: '{print $1}' /etc/passwd
```

### `sed` (Find and Replace in files)
```bash
# Replace 'old' with 'new' in stream (preview only)
sed 's/old/new/g' file.txt

# Replace directly inside the file (in-place edit)
sed -i 's/localhost/127.0.0.1/g' config.env
```

### `sort` & `uniq`
```bash
# Sort lines alphabetically
sort names.txt

# Sort numbers numerically
sort -n numbers.txt

# Count unique lines (must be sorted first!)
sort access.log | uniq -c | sort -nr
```

---

## 3. Finding Files & Locating Binaries (`find`, `which`, `locate`)

| Command | What It Does | Example |
| :--- | :--- | :--- |
| `find . -name "*.log"` | Find files matching name pattern | `find . -name "*.log"` |
| `find . -type d` | Find only directories | `find . -type d` |
| `find . -type f -mtime -7` | Find files modified within last 7 days | `find . -type f -mtime -7` |
| `find . -size +50M` | Find files larger than 50 Megabytes | `find /var/log -size +50M` |
| `which <tool>` | Show path to an executable | `which python3` |
| `whereis <tool>` | Find binary, source, and manual page | `whereis nginx` |

---

## 4. Archiving & Compression (`tar`, `gzip`, `zip`)

Managing archives and backup bundles.

```bash
# Create a compressed tar.gz archive
tar -czvf backup.tar.gz /path/to/folder

# Extract a tar.gz archive
tar -xzvf backup.tar.gz

# View contents of archive without extracting
tar -tzvf backup.tar.gz

# Zip and Unzip
zip -r myproject.zip myproject/
unzip myproject.zip
```
> **Memory Trick for `tar`:**
> - **C**reate: `c-z-v-f` (**C**reate, g**Z**ip, **V**erbose, **F**ile)
> - e**X**tract: `x-z-v-f` (e**X**tract, g**Z**ip, **V**erbose, **F**ile)

---

## 5. Process Monitoring & Control (`ps`, `kill`, `killall`)

Find and stop running programs or background tasks.

```bash
# List all processes with full details
ps aux

# Search for a specific running process
ps aux | grep node

# Stop a process cleanly by PID (Process ID)
kill <PID>

# Force kill a stuck process
kill -9 <PID>

# Kill all processes by program name
killall python3

# Interactive process manager
top
```

---

## 6. Background Jobs & Terminal Persistence (`&`, `nohup`, `jobs`, `fg`, `bg`)

Keep programs running when you switch tasks or disconnect.

```bash
# Run a script in the background
./long_job.sh &

# Run program that survives even after closing SSH terminal
nohup ./server.sh > server.log 2>&1 &

# View background jobs in current shell
jobs

# Bring background job 1 back to foreground
fg %1

# Resume a paused job in the background (after Ctrl + Z)
bg %1
```

---

## 7. Basic Networking & Downloads (`curl`, `wget`, `ping`, `netstat`)

```bash
# Download a file from URL
wget https://example.com/file.zip

# Fetch HTTP response from URL
curl https://api.github.com

# Download file with original name via curl
curl -O https://example.com/app.tar.gz

# Check server reachable / latency
ping -c 4 google.com

# Check if a port is open and listening
ss -tuln
# or
netstat -tuln
```

---

## 8. Disk Space & File Sizes (`du`, `df`)

```bash
# Summary of current directory size
du -sh .

# Top 5 largest folders inside current directory
du -h --max-depth=1 . | sort -hr | head -n 5

# Overall disk partitions usage
df -h
```

---

## 💡 Practical Intermediate Exercise:
Try combining these commands like a real engineer:

1. **Find error count in a log:**
   ```bash
   grep "ERROR" /var/log/syslog | wc -l
   ```
2. **Find all `.txt` files and compress them:**
   ```bash
   tar -czvf all_texts.tar.gz *.txt
   ```
3. **Find the top 5 memory hogs:**
   ```bash
   ps aux --sort=-%mem | head -n 6
   ```
