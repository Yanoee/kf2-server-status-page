# KF2 Server Landing Page

A fully animated, real-time landing page for a **Killing Floor 2** server.

This project provides a lightweight, visually rich status page that displays live server information without using frameworks, Node.js, or build tools.

---

## ✨ Overview

The landing page displays live data pulled directly from a KF2 server, including:

- Server online/offline status  
- Current map and game mode  
- Real-time player list  
- One-click Steam connect  
- Password popup with copy-to-clipboard buttons  

Built using **vanilla HTML, CSS, JavaScript**, and **PHP with SourceQuery**.

**No frameworks.  
No Node.js.  
No build step.**

---

## 🔥 Features

- 🎮 Live Killing Floor 2 server status  
- 👥 Player list (name, kills, playtime)  
- 🗺️ Current map & game mode display  
- 🔐 Password popup with copy buttons  
- 🔊 Optional background music (user-initiated)  
- 🧊 Glassmorphism UI  
- 🎨 Animated hex-grid canvas background  
- 🖱️ Mouse-based parallax background  
- 🧲 Draggable modal window  
- 📱 Fully responsive layout  
- ⚡ Zero JavaScript dependencies  

---

## ⚠️ Requirements

This project **will not work** without the following:

### 1️⃣ Web Server
- NGINX or Apache  
- PHP 8.x recommended  

### 2️⃣ SourceQuery (Required)

This project uses **xPaw’s PHP SourceQuery** to query the Killing Floor 2 server.

GitHub repository:  
https://github.com/xPaw/PHP-Source-Query

---

## 📦 Installing SourceQuery

### Step 1 — Download SourceQuery

```bash
cd /var/www/your-site/api
git clone https://github.com/xPaw/PHP-Source-Query.git SourceQuery
```

Resulting file:
```
api/SourceQuery/SourceQuery.class.php
```

### Step 2 — Include SourceQuery in `status.php`

```php
require __DIR__ . '/SourceQuery/SourceQuery.class.php';
```

---

## 🔌 API Endpoint

**Endpoint:**
```
/api/status.php
```

The frontend (`js/status.js`) polls this endpoint every **5 seconds**.

### Expected JSON Output

```json
{
  "online": true,
  "name": "[TR] KF2 Server",
  "mode": "Survival",
  "map": "KF-BioticsLab",
  "players": 5,
  "max": 10,
  "playerlist": [
    { "Name": "Player1", "Kills": 120, "Time": "12:34" }
  ]
}
```

If the query fails or times out, the frontend automatically switches to **offline mode**.

---

## 🌐 NGINX Install Guide (Recommended)

### Install NGINX + PHP

```bash
apt update
apt install nginx php php-fpm php-curl php-sockets php-json -y
```

### Example NGINX Server Block

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/your-site;
    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~ /\. {
        deny all;
    }
}
```

### Reload NGINX

```bash
nginx -t && systemctl reload nginx
```

---

## 🚀 How to Run

1. Upload all project files to your web root  
2. Install SourceQuery  
3. Configure `api/status.php`:
   - Server IP  
   - Query port  
4. Update the Steam connect link in `index.html`  
5. Open the site in your browser  

---

## 🛠 Configuration Notes

### Change Server IP
- `index.html` → Steam connect URL  
- `api/status.php` → SourceQuery host & port  

### Change Refresh Rate

`js/status.js`
```js
const REFRESH_MS = 5000;
```

### Background Images
- Place `.webp` images inside `/img/`  
- Images are auto-randomized on page load  

---

## ❗ Common Problems

### ❌ Server Always Offline
- UDP port blocked  
- Wrong query port  
- PHP sockets disabled  
- Firewall blocking outbound UDP  

### ❌ Players Not Showing
- Server is empty (normal behavior)  
- SourceQuery timeout too low  
- KF2 server not responding to queries  

---

## 👤 Author

**Yanoee**  
© 2026  

Steam:  
https://steamcommunity.com/id/triacetontriperoxide/

---

## 📜 License

Free to use, modify, and self-host.  
No warranty. No support obligation.
