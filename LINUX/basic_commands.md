# Linux Basic Commands Guide (Beginner Friendly)

A step-by-step beginner guide to learn and practice Linux fundamentals from scratch.

---

## 1. Directory Navigation (Where am I & Moving around)

| Command | Description | Example |
| :--- | :--- | :--- |
| `pwd` | **P**rint **W**orking **D**irectory (shows current path) | `pwd` |
| `ls` | **L**i**s**t files and folders | `ls` |
| `ls -l` | List with detailed info (permissions, size, owner, date) | `ls -l` |
| `ls -la` | List all files, including hidden files (starting with `.`) | `ls -la` |
| `ls -lh` | List with human-readable file sizes (KB, MB, GB) | `ls -lh` |
| `cd <folder>` | **C**hange **D**irectory into a folder | `cd documents` |
| `cd ..` | Go up one directory level | `cd ..` |
| `cd ~` or `cd` | Go to home directory | `cd ~` |
| `cd -` | Go back to the previous directory | `cd -` |

---

## 2. Creating, Copying & Removing Files / Folders

| Command | Description | Example |
| :--- | :--- | :--- |
| `mkdir <name>` | **M**a**k**e **dir**ectory (folder) | `mkdir test_folder` |
| `mkdir -p a/b/c` | Make nested folders all at once | `mkdir -p project/src` |
| `touch <file>` | Create an empty new file | `touch app.txt` |
| `cp <src> <dest>` | **C**o**p**y a file | `cp file1.txt backup.txt` |
| `cp -r <src> <dest>` | Copy an entire folder recursively | `cp -r folder1 folder2` |
| `mv <old> <new>` | **M**o**v**e or rename a file/folder | `mv old.txt new.txt` |
| `rm <file>` | **R**e**m**ove (delete) a file | `rm app.txt` |
| `rm -r <folder>` | Remove a folder and its contents | `rm -r test_folder` |

---

## 3. Viewing & Reading Files

| Command | Description | Example |
| :--- | :--- | :--- |
| `cat <file>` | Display full content of a file | `cat notes.txt` |
| `less <file>` | Open file in an interactive pager (`q` to quit, `space` to scroll) | `less large_file.log` |
| `head <file>` | View the first 10 lines of a file | `head -n 5 app.log` |
| `tail <file>` | View the last 10 lines of a file | `tail -n 10 app.log` |
| `tail -f <file>` | Follow live updates to a file in real-time | `tail -f app.log` |

---

## 4. Searching & Filtering

| Command | Description | Example |
| :--- | :--- | :--- |
| `grep "text" <file>` | Search for a specific word/phrase inside a file | `grep "ERROR" server.log` |
| `grep -i "text" <file>` | Case-insensitive search | `grep -i "warning" server.log` |
| `find <dir> -name "pattern"` | Search for files by name | `find . -name "*.txt"` |
| `wc -l <file>` | Count lines in a file | `wc -l access.log` |

---

## 5. File Permissions & Users

| Command | Description | Example |
| :--- | :--- | :--- |
| `whoami` | Shows your current user name | `whoami` |
| `sudo <command>` | Run a command with administrative (root) rights | `sudo apt update` |
| `chmod <mode> <file>` | **Ch**ange file permissions | `chmod +x script.sh` |
| `chown <user>:<group> <file>` | **Ch**ange file **own**er | `chown ubuntu:ubuntu app.js` |

> **Understanding Permissions (`chmod` numbers):**
> - Read (`r`) = 4
> - Write (`w`) = 2
> - Execute (`x`) = 1
> - Example: `chmod 755 script.sh` (User: read/write/exec, Group: read/exec, Others: read/exec)

---

## 6. Basic System Info & Utilities

| Command | Description | Example |
| :--- | :--- | :--- |
| `clear` | Clears the terminal screen (or `Ctrl + L`) | `clear` |
| `history` | Shows list of previously executed commands | `history` |
| `date` | Displays current date and time | `date` |
| `df -h` | Shows available disk space | `df -h` |
| `free -h` | Shows available RAM memory | `free -h` |
| `ps aux` | Lists currently running processes | `ps aux` |

---

## 💡 Quick Practice Tasks (Try these in order)

1. Check where you are: `pwd`
2. Create a folder: `mkdir practice`
3. Enter the folder: `cd practice`
4. Create a file: `touch test.txt`
5. Write text into it: `echo "Hello Linux" > test.txt`
6. Read the content: `cat test.txt`
7. Check the file details: `ls -lh`
8. Go back and clean up: `cd ..` and `rm -r practice`
