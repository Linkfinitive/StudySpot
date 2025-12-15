# The build commands for Cloudflare workers to use when building.

# Download the dotnet installer
curl -sSL https://dot.net/v1/dotnet-install.sh > dotnet-install.sh
chmod +x dotnet-install.sh

# Install dotnet 10
./dotnet-install.sh -c 10.0 -InstallDir ./dotnet

# Publish the app using the locally installed dotnet
# -c Release: builds for production
# -o output: places the build artifacts in a folder named 'output'
./dotnet/dotnet publish -c Release -o output
