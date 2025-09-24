#!/bin/bash

# Programaxis Deployment Script
# Deploys the built static site to programaxis.opentangle.com

# Configuration
SERVER_USER="root"  # Change to your server username if different
SERVER_IP="146.190.117.215"
REMOTE_DIR="/var/www/programaxis"  # Remote directory for subdomain
LOCAL_BUILD_DIR="./dist"  # Local build directory

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Programaxis to programaxis.opentangle.com...${NC}"

# Step 1: Clean and build the project
echo -e "${YELLOW}Building project...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Build failed! Deployment aborted.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Verify build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory $LOCAL_BUILD_DIR not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}Build contents:${NC}"
ls -la $LOCAL_BUILD_DIR/

# Step 3: Ensure remote directory exists
echo -e "${YELLOW}Creating remote directory if it doesn't exist...${NC}"
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR && chown www-data:www-data $REMOTE_DIR"

# Step 4: Copy all built files to server using rsync
echo -e "${YELLOW}Copying website files to server...${NC}"
rsync -avz --delete $LOCAL_BUILD_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

# Step 5: Set proper permissions
echo -e "${YELLOW}Setting proper permissions...${NC}"
ssh $SERVER_USER@$SERVER_IP "chown -R www-data:www-data $REMOTE_DIR && chmod -R 755 $REMOTE_DIR"

# Step 6: Test nginx configuration (optional)
echo -e "${YELLOW}Testing nginx configuration...${NC}"
ssh $SERVER_USER@$SERVER_IP "nginx -t"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}Your Programaxis game should now be accessible at:${NC}"
echo -e "${GREEN}https://programaxis.opentangle.com${NC}"
echo ""
echo -e "${YELLOW}Next steps if this is your first deployment:${NC}"
echo "1. Set up nginx configuration for the subdomain"
echo "2. Configure SSL certificate with Let's Encrypt"
echo "3. Reload nginx configuration"
echo ""
echo -e "${BLUE}Check the server setup script for these commands.${NC}"