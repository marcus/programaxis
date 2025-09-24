#!/bin/bash

# Server Setup Script for Programaxis Deployment
# Run this on your Ubuntu server to set up the subdomain and SSL

# Configuration
DOMAIN="programaxis.opentangle.com"
WEBROOT="/var/www/programaxis"
NGINX_CONF="/etc/nginx/sites-available/programaxis"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Setting up server for $DOMAIN...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run this script as root (or with sudo)${NC}"
    exit 1
fi

# Step 1: Create web directory
echo -e "${YELLOW}Creating web directory...${NC}"
mkdir -p $WEBROOT
chown www-data:www-data $WEBROOT
chmod 755 $WEBROOT
echo -e "${GREEN}✅ Web directory created at $WEBROOT${NC}"

# Step 2: Copy nginx configuration
echo -e "${YELLOW}Setting up nginx configuration...${NC}"
if [ ! -f "./nginx-programaxis.conf" ]; then
    echo -e "${RED}❌ nginx-programaxis.conf not found in current directory!${NC}"
    echo "Please ensure you've uploaded the nginx configuration file."
    exit 1
fi

cp ./nginx-programaxis.conf $NGINX_CONF
echo -e "${GREEN}✅ Nginx configuration copied${NC}"

# Step 3: Enable the site (but don't restart nginx yet - SSL needs to be set up first)
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/programaxis
echo -e "${GREEN}✅ Nginx site enabled${NC}"

# Step 4: Test nginx configuration syntax
echo -e "${YELLOW}Testing nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors!${NC}"
    exit 1
fi

# Step 5: Install certbot if not already installed
echo -e "${YELLOW}Checking for certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing certbot...${NC}"
    apt update
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed${NC}"
else
    echo -e "${GREEN}✅ Certbot already installed${NC}"
fi

echo -e "${BLUE}🌟 Initial server setup completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. First, disable SSL in the nginx config temporarily:"
echo -e "   ${BLUE}sudo nano $NGINX_CONF${NC}"
echo "   Comment out the SSL server block and just keep the HTTP one for now"
echo ""
echo "2. Reload nginx:"
echo -e "   ${BLUE}sudo systemctl reload nginx${NC}"
echo ""
echo "3. Get SSL certificate with certbot:"
echo -e "   ${BLUE}sudo certbot --nginx -d $DOMAIN${NC}"
echo ""
echo "4. After SSL is set up, restore the full nginx config and reload:"
echo -e "   ${BLUE}sudo cp ./nginx-programaxis.conf $NGINX_CONF${NC}"
echo -e "   ${BLUE}sudo systemctl reload nginx${NC}"
echo ""
echo "5. Deploy your site with the deployment script:"
echo -e "   ${BLUE}./deploy.sh${NC}"
echo ""
echo -e "${GREEN}The site will then be available at https://$DOMAIN${NC}"

# Optional: Create a simplified nginx config for initial SSL setup
cat > /tmp/nginx-programaxis-temp.conf << 'EOF'
server {
    listen 80;
    server_name programaxis.opentangle.com;

    root /var/www/programaxis;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

echo ""
echo -e "${BLUE}💡 Pro tip: A temporary config has been created at /tmp/nginx-programaxis-temp.conf${NC}"
echo -e "${BLUE}   You can use this for initial SSL setup if needed.${NC}"