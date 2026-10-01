#!/bin/bash
# Quick GitHub setup script for Manulife Benefits Assistant
# Run this after creating your empty GitHub repo

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Manulife Benefits Assistant - GitHub Push ===${NC}\n"

# Check if git is initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  echo -e "${GREEN}✓ Git initialized${NC}\n"
fi

# Configure git user (one time only)
echo -e "${YELLOW}Setting git user (one-time setup)${NC}"
git config user.name "Victoria Yefymenko"
git config user.email "vyefymen@uwaterloo.ca"
echo -e "${GREEN}✓ Git user configured${NC}\n"

# Add all files
echo "Adding all files to git..."
git add .
echo -e "${GREEN}✓ Files staged${NC}\n"

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
  echo -e "${YELLOW}No changes to commit. Repository already up to date.${NC}"
else
  # Create initial commit with meaningful message
  echo "Creating initial commit..."
  git commit -m "Initial commit: AI benefits assistant with Gemini integration

Built for Manulife Summer 2027 Software Engineering Internship follow-up.

Features:
- React frontend with TypeScript for type safety
- Next.js API routes for Gemini integration
- Tailwind CSS responsive design
- Sample insurance policy documents
- AI-powered benefits answers with source citations

Architecture:
- Frontend: Next.js 14 + React + TypeScript
- Styling: Tailwind CSS (utility-first)
- AI: Google Gemini API (gemini-2.5-flash model)
- Deployment: Vercel (serverless)

Key implementation details:
- Chat state managed client-side for real-time UX
- Policy documents embedded in API for context
- Environment variables for API key security
- Error handling for failed requests"

  echo -e "${GREEN}✓ Initial commit created${NC}\n"
fi

# Get GitHub username
echo -e "${YELLOW}Now let's connect to GitHub${NC}"
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
  echo -e "${YELLOW}GitHub username required. Skipping push.${NC}"
  exit 1
fi

REPO_URL="https://github.com/${GITHUB_USER}/manulife-benefits-assistant.git"

# Check if remote already exists
if git remote | grep -q origin; then
  echo "Updating existing remote..."
  git remote set-url origin "$REPO_URL"
else
  echo "Adding GitHub remote..."
  git remote add origin "$REPO_URL"
fi

echo -e "${GREEN}✓ Remote configured: ${REPO_URL}${NC}\n"

# Set main branch
echo "Setting main branch..."
git branch -M main
echo -e "${GREEN}✓ Branch: main${NC}\n"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}\n"

# Display success info
echo "────────────────────────────────────────"
echo -e "${GREEN}✓ All done!${NC}"
echo "────────────────────────────────────────"
echo ""
echo "Your repository is now online:"
echo "  ${REPO_URL}"
echo ""
echo "Next steps:"
echo "  1. Deploy to Vercel: https://vercel.com/new"
echo "  2. Add GEMINI_API_KEY environment variable"
echo "  3. Get live URL from Vercel"
echo "  4. Update thank-you email with:"
echo "     - Live demo link"
echo "     - GitHub repo link"
echo ""
echo "Questions? Check SETUP_AND_CUSTOMIZE.md for detailed info"
echo ""
