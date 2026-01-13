# Cloudflare Pages Setup

This document explains how to configure Cloudflare Pages for StudySpot after the wrangler.toml has been added to the repository.

## Dashboard Configuration

With the `wrangler.toml` file now in the repository, the Cloudflare Pages dashboard configuration should be simplified:

### Build Configuration

In the Cloudflare Pages dashboard (Settings > Builds & deployments > Build configuration), update the following settings:

1. **Framework preset**: None (Custom)
2. **Build command**: `./build.sh` (or leave empty if wrangler.toml is being used)
3. **Build output directory**: `output/wwwroot`
4. **Root directory**: `/` (default)
5. **Remove** any custom deploy/version commands - these should not be needed for Cloudflare Pages

### Important: Switching from Workers to Pages

If you're currently using Cloudflare Workers with Assets (using `wrangler deploy --assets` and `wrangler versions upload --assets`), you should migrate to Cloudflare Pages instead, which is the recommended approach for static sites:

1. Create a new Cloudflare Pages project
2. Connect it to your GitHub repository
3. Configure the build settings as described above
4. Remove the old Workers deployment

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
2. Read `wrangler.toml` for configuration (optional but recommended)
3. Run the build command (`./build.sh`)
4. Deploy from the specified output directory (`./output/wwwroot`)

### Using Wrangler CLI (Optional)

With the `wrangler.toml` in place, you can also deploy manually using:

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy ./output/wwwroot --project-name=studyspot

# Or if you build first:
./build.sh && npx wrangler pages deploy ./output/wwwroot --project-name=studyspot
```

This is much cleaner than the previous approach with `--assets` and `--compatibility-date` flags.

### Updating Compatibility Date

To update the compatibility date in the future:
1. Edit `wrangler.toml` in the repository
2. Update the `compatibility_date` field
3. Commit and push the change
4. Cloudflare will use the new date on the next deployment

No dashboard changes required!
