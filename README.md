# Azure Citadel

The content for the public-facing website for [Azure Citadel](https://azurecitadel.com)

The site is currently hosted on Azure Static Web Apps, using GitHub actions to deploy, sitting behind Azure Front Door

## Local hugo install

Example commands for Ubuntu 20.04 in WSL2, and for macOS on Apple silicon.

Run from the local directory for the cloned repo.

1. Install npm and wget

    Ubuntu:

    ```bash
    sudo apt update && sudo apt install -y npm wget
    ```

    macOS:

    ```zsh
    brew update && brew install npm wget
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

1. Download the hugo binary

    Ubuntu:

    ```bash
    cd /tmp
    hugo_package=hugo_extended_${hugo_version}_Linux-64bit.deb
    wget https://github.com/gohugoio/hugo/releases/download/v$hugo_version/$hugo_package
    ```

    macOS:

    ```zsh
    cd /tmp
    hugo_archive=hugo_extended_${hugo_version}_macOS-ARM64.tar.gz
    wget https://github.com/gohugoio/hugo/releases/download/v$hugo_version/$hugo_archive
    ```

1. Install hugo

    Ubuntu:

    ```bash
    sudo apt install ./$hugo_package -y
    ```

    macOS:

    ```zsh
    sudo tar -zxvf /tmp/$hugo_archive --directory /usr/local/bin hugo
    ```

1. Remove the .deb file

    Ubuntu:

    ```bash
    rm /tmp/$hugo_binary
    ```

    macOS:

    ```zsh
    rm /tmp/$hugo_archive
    ```

## Run hugo

```bash
hugo server
```
