# Azure Citadel

The content for the public-facing website for [Azure Citadel](https://azurecitadel.com)

The site is currently hosted on Azure Static Web Apps, using GitHub actions to deploy, sitting behind Azure Front Door

## Local hugo install

Example commands for Ubuntu 24.04, run from the local directory for the cloned repo.

You should only need to either

- install a precompiled binary
- compile your own from source and include it in your PATH

You will need to compile your own if installing v0.90.1 on aarch64 architecture.

## Install NPM

1. Ensure you are in the root of the cloned repo

    ```shell
    cd ~/git/azurecitadel
    ```

1. Install npm

    ```shell
    sudo apt update && sudo apt install -y npm
    ```

1. Install the npm modules

    ```shell
    npm install
    ```

1. List out the installed npm modules

    ```shell
    npm ll
    ```

    Example output:

    ```text
    azurecitadel@
    │ /home/richeney/git/azurecitadel
    │
    ├── @primer/css@19.1.0
    │
    ├── @primer/octicons@16.2.0
    │
    └── highlight.js@11.4.0
    ```

## Determine the Hugo version

1. Determine the Hugo version from the [Dockerfile](.devcontainer/Dockerfile)

1. Set the variable

    ```shell
    hugo_version=0.123.7
    ```

## Precompiled binary

1. Download the .deb file

    ```shell
    hugo_binary=hugo_extended_${hugo_version}_Linux-64bit.deb
    wget https://github.com/gohugoio/hugo/releases/download/v$hugo_version/$hugo_binary
    ```

    If there is no binary file in the [Releases](https://github.com/gohugoio/hugo/releases) then you will need to [compile](#compile) a binary from source.

1. Install hugo

    ```shell
    sudo apt install ./$hugo_binary -y
    ```

1. Remove the .deb file

    ```shell
    rm $hugo_binary
    ```

## Compile

If you successfully completed the install steps for the precompiled binary then jump straight to [Run Hugo](#run-hugo).

Instructions taken from the [Hugo readme](https://github.com/gohugoio/hugo?tab=readme-ov-file#build-from-source) and customised for the older extended version used on this site on Ubuntu 24.04 running in WSL2 on aarch64.

1. Build the binary using [go install](https://thenewstack.io/golang-how-to-use-the-go-install-command/)

    ```shell
    CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@v${hugo_version}
    ```

    The resulting files will be written to ~/go/bin and the directory should be added to your path.

## Set hold

To ensure apt doesn't update to the most recent, mark the package.

1. Set hold

    ```shell
    sudo apt-mark hold hugo
    ```

1. List the holds

    ```shell
    sudo apt-mark showhold
    ```

## Run Hugo

1. Check location and version

    You may need to refresh the session if the path has changed.

    ```shell
    which hugo && hugo version
    ```

    Example output:

    ```text
    /home/richeney/go/bin/hugo
    hugo v0.90.1+extended linux/arm64 BuildDate=unknown
    ```

1. Run the server

    ```shell
    hugo server
    ```

    Example output:

    ```text
    Start building sites …
    hugo v0.90.1+extended linux/arm64 BuildDate=unknown

                       | EN
    -------------------+------
      Pages            | 348
      Paginator pages  |   0
      Non-page files   | 294
      Static files     |   6
      Processed images |   0
      Aliases          |  92
      Sitemaps         |   1
      Cleaned          |   0

    Built in 1317 ms
    Watching for changes in /home/richeney/git/azurecitadel/{archetypes,content,package.json,static,themes}
    Watching for config changes in /home/richeney/git/azurecitadel/config/_default, /home/richeney/git/azurecitadel/config/development
    Environment: "development"
    Serving pages from memory
    Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
    Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
    Press Ctrl+C to stop
    ```

1. Ctrl + Click on the URL

     <http://localhost:1313>
