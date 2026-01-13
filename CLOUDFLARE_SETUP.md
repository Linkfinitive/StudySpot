# Cloudflare Pages Setup

This document explains how to configure Cloudflare Pages for StudySpot after the wrangler.toml has been added to the repository.

## Dashboard Configuration

With the `wrangler.toml` file now in the repository, the Cloudflare Pages dashboard configuration should be simplified:

### Build Configuration

In the Cloudflare Pages dashboard, update the following settings:

1. **Framework preset**: None (Custom)
2. **Build command**: Leave empty (will use wrangler.toml)
3. **Build output directory**: Leave empty (will use wrangler.toml)
4. **Root directory**: `/` (default)

### What Changed

**Before:**
- Build command: `./build.sh`
- Deploy command: `npx wrangler deploy --assets=./output/wwwroot --compatibility-date 2025-12-15`
- Version command: `npx wrangler versions upload --assets=./output/wwwroot --compatibility-date 2025-12-15`

**After:**
- All configuration is now in `wrangler.toml`
- Cloudflare Pages will automatically read the configuration from the file
- Commands and compatibility dates are version-controlled in the repository

### Benefits

1. **Version Control**: Configuration is now tracked in Git
2. **Consistency**: All deployments use the same configuration
3. **Maintainability**: No need to manually update dashboard settings
4. **Best Practice**: Follows Cloudflare's recommended approach

### Deployment

Cloudflare Pages will automatically:
1. Clone the repository
2. Read `wrangler.toml`
3. Run the build command (`./build.sh`)
4. Deploy from the specified output directory (`./output/wwwroot`)

### Updating Compatibility Date

To update the compatibility date in the future:
1. Edit `wrangler.toml` in the repository
2. Update the `compatibility_date` field
3. Commit and push the change
4. Cloudflare will use the new date on the next deployment

No dashboard changes required!
