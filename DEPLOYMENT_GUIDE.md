# Hướng dẫn Deploy

## Deploy lên Vercel (Recommended)

Vercel là platform ideal nhất để deploy Next.js application.

### Bước 1: Chuẩn bị code
```bash
git init
git add .
git commit -m "Initial commit"
```

### Bước 2: Push lên GitHub
1. Tạo repository trên GitHub
2. Push code lên repository

```bash
git remote add origin https://github.com/your-username/repo-name.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy trên Vercel
1. Vào https://vercel.com
2. Click "New Project"
3. Chọn GitHub repository
4. Vercel sẽ tự động detect Next.js
5. Click "Deploy"

**Xong!** Application của bạn đã live tại `https://your-project-name.vercel.app`

## Deploy lên Server (VPS/Dedicated)

### Yêu cầu
- Node.js 18+
- npm hoặc yarn
- nginx hoặc apache (optional)

### Bước 1: Chuẩn bị server
```bash
# SSH vào server
ssh user@your-server-ip

# Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Tạo thư mục project
mkdir -p /var/www/user-management
cd /var/www/user-management
```

### Bước 2: Clone và cài dependencies
```bash
git clone https://github.com/your-username/repo-name.git .
npm install
```

### Bước 3: Build production
```bash
npm run build
```

### Bước 4: Chạy application
```bash
npm start
```

Hoặc dùng PM2 để keep running:
```bash
npm install -g pm2
pm2 start "npm start" --name "user-management"
pm2 startup
pm2 save
```

### Bước 5: Setup Nginx reverse proxy
```bash
sudo nano /etc/nginx/sites-available/default
```

Thêm config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Bước 6: Setup SSL (HTTPS)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Deploy với Docker

### Build Docker image
```bash
docker build -t user-management:latest .
```

### Run container
```bash
docker run -d -p 3000:3000 --name user-management user-management:latest
```

### Docker Compose (tùy chọn)
Tạo `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

## Environment Variables

Tạo `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_DEBUG_MODE=false
```

## Monitoring & Maintenance

### Check logs (PM2)
```bash
pm2 logs user-management
```

### Check logs (Docker)
```bash
docker logs user-management
```

### Update application
```bash
git pull origin main
npm install
npm run build
pm2 restart user-management
```

## Performance Optimization

1. Enable gzip compression (Nginx)
2. Setup CDN untuk static files
3. Monitor performance dengan Vercel Analytics
4. Use database caching nếu có backend

## Security Checklist

- [ ] Environment variables không commit vào Git
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] API rate limiting setup
- [ ] Regular security updates
- [ ] Firewall rules configured

## Troubleshooting

### Port 3000 already in use
```bash
# Tìm process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Out of memory
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Build fails
```bash
# Clear cache
rm -rf .next
npm run build
```

## Support

Cần help? Tạo issue trên GitHub repository.
