# Azure Citadel

The content for the public-facing website for [Azure Citadel](https://azurecitadel.com)

The site is currently hosted on Azure Static Web Apps, using GitHub actions to deploy, sitting behind Azure Front Door

## Local hugo install

Example commands for Ubuntu 20.04, run from the local directory for the cloned repo.

1. Install npm

    ```bash
    sudo apt update && sudo apt install -y npm
    ```

1. Install the npm modules

    ```bash
    npm install
    ```

1. Determine the Hugo version from the [Dockerfile](.devcontainer/Dockerfile)
1. Set the variable

    ```bash
    hugo_version=0.90.1
    ```

1. Download the .deb file

    ```bash
    hugo_binary=hugo_extended_${hugo_version}_Linux-64bit.deb
    wget https://github.com/spf13/hugo/releases/download/v$hugo_version/$hugo_binary
    ```

1. Install hugo

    ```bash
    sudo apt install ./$hugo_binary -y
    ```

1. Remove the .deb file

    ```bash
    rm $hugo_binary
    ```

## Run hugo

```bash
hugo server
```
