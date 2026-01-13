# Cloudflare Workers with Assets Setup

This document explains how to configure Cloudflare Workers with Assets for StudySpot after the wrangler.toml has been added to the repository.

## Dashboard Configuration

With the `wrangler.toml` file now in the repository, the Cloudflare dashboard configuration should be simplified:

### Build Configuration

In the Cloudflare dashboard (Settings > Builds & deployments > Build configuration), update the following settings:

1. **Build command**: `./build.sh`
2. **Deploy command**: `npx wrangler deploy` (remove the `--assets` and `--compatibility-date` flags)
3. **Version command**: `npx wrangler versions upload` (remove the `--assets` and `--compatibility-date` flags)
4. **Root directory**: `/` (default)

The `wrangler.toml` file now contains the assets directory and compatibility date configuration, so these no longer need to be specified in the dashboard commands.

### What Changed

**Before:**
- Build command: `./build.sh`
- Deploy command: `npx wrangler deploy --assets=./output/wwwroot --compatibility-date 2025-12-15`
- Version command: `npx wrangler versions upload --assets=./output/wwwroot --compatibility-date 2025-12-15`

**After:**
- Build command: `./build.sh` (unchanged)
- Deploy command: `npx wrangler deploy` (simplified - reads from wrangler.toml)
- Version command: `npx wrangler versions upload` (simplified - reads from wrangler.toml)

All configuration (assets directory, compatibility date) is now in `wrangler.toml` and version-controlled in the repository.

### Benefits

1. **Version Control**: Configuration is now tracked in Git
2. **Consistency**: All deployments use the same configuration
3. **Maintainability**: No need to manually update dashboard settings when changing compatibility dates or asset directories
4. **Best Practice**: Follows Cloudflare's recommended approach for Workers with Assets

### Deployment

Cloudflare will automatically:
1. Clone the repository
2. Read `wrangler.toml` for assets and compatibility configuration
3. Run the build command (`./build.sh`)
4. Deploy using the simplified commands that reference the wrangler.toml configuration

### Using Wrangler CLI (Optional)

With the `wrangler.toml` in place, you can also deploy manually using:

```bash
# Build first
./build.sh

# Deploy using wrangler (it will read wrangler.toml automatically)
npx wrangler deploy

# Or create a version
npx wrangler versions upload
```

This is much cleaner than the previous approach with repeated `--assets` and `--compatibility-date` flags.

### Updating Configuration

To update the compatibility date or assets directory in the future:
1. Edit `wrangler.toml` in the repository
2. Update the relevant field (`compatibility_date` or `assets.directory`)
3. Commit and push the change
4. Cloudflare will use the new configuration on the next deployment

No dashboard command changes required!
