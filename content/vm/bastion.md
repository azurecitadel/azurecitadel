---
title: "Azure Bastion with native tools & AAD"
description: "Follow this lab to configure a small Azure Bastion environment with a couple of example VMs for config management purposes. Authenticate with your Azure AD credentials and access using native SSH and RDP."
layout: single
draft: false
menu:
  side:
    parent: vm
    identifier: vm-bastion
---

## Introduction

The [Azure Bastion](https://docs.microsoft.com/azure/bastion/bastion-overview) service has been very successful since its introduction. The standard SKU enables the use of native tooling. There are also updated AAD extensions.

Combining these gives a very functional way of accessing virtual machines in Azure whilst enabling MFA and drastically limiting the attack surface. Remember that Azure Bastion can also access virtual machines across virtual network peers.

In this lab you will:

* use Terraform to spin up the lab environment
* connect to the Windows Server 2022 Azure Edition virtual machine via Azure Bastion
  * authenticate using Azure Active Directory
  * using the native Windows remote desktop tool
* connect to the Ubuntu 20.04 virtual machine via Azure Bastion
  * authenticate using Azure Active Directory
  * using openssh from either Windows or WSL2
* explore basic automation integration
  * set variables using the instance metadata service
  * access an example secret from the key vault using the virtual machine's managed identity
* access a "management" application using a tunnel via Azure Bastion
* clean up

## AAD authentication

Before we build the environment, spend a few mintes to understand the requirements for AAD auth on Azure VMs, as specified on these pages:

- [Log in to a Windows virtual machine in Azure by using Azure AD](https://docs.microsoft.com/azure/active-directory/devices/howto-vm-sign-in-azure-ad-windows)
- [Log in to a Linux virtual machine in Azure by using Azure AD and OpenSSH](https://docs.microsoft.com/azure/active-directory/devices/howto-vm-sign-in-azure-ad-linux)

### Windows checklist

- [x] Supported OS level - Windows Server 2019 or Windows 10 1809 and later VM, e.g.

  ```c
  publisher = "MicrosoftWindowsServer"
  offer     = "WindowsServer"
  sku       = "2022-datacenter-azure-edition"
  version   = "latest"
  ```

- [x] System assigned managed identity enabled on the VM
- [x] AADLoginForWindows extension added to the VM

  ```c
  publisher = "Microsoft.Azure.ActiveDirectory"
  type      = "AADLoginForWindows"
  ```

- [x] RBAC role assignment on the VM (or higher scope), either
  - Virtual Machine Administrator Login
  - Virtual Machine User Login
- [x] Member user (guest IDs not supported)
- [x] Outgoing 443 permitted to specific URIs

Example call (Windows OS level)
```bash
az login
az extension add --name bastion
az network bastion rdp --name myBastion --resource-group myBastionRG --target-resource-id <myVMID> --enable-mfa true
```

Login using RDP, specifying the userid in `user@domain.com` format.

### Linux checklist

- [x] [Supported Linux distribution](https://learn.microsoft.com/azure/active-directory/devices/howto-vm-sign-in-azure-ad-linux#supported-linux-distributions-and-azure-regions), e.g.

  ```c
  publisher = "canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
  ```

- [x] System assigned managed identity enabled on the VM
- [x] AADSSHLoginForLinux extension added to the VM

  ```c
  publisher = "Microsoft.Azure.ActiveDirectory"
  type      = "AADSSHLoginForLinux"
  ```

  (Installs the aadsshlogin or aadsshlogin-selinx package.)

- [x] RBAC role assignment on the VM (or higher scope), either
  - Virtual Machine Administrator Login
  - Virtual Machine User Login
- [x] Member user (guest IDs not supported)
- [x] Outgoing 443 permitted to specific URIs

Example connection:

```bash
az login
az extension add --name ssh
az ssh vm --name myVM --resource-group myResourceGroup
```

## Pre-requirements for Terraform example

You will need

* to be Owner on an Azure subscription

* an [SSH key pair](https://docs.microsoft.com/en-gb/azure/virtual-machines/linux/mac-create-ssh-keys#create-an-ssh-key-pair) (defaults to `~/.ssh/id_rsa.pub`)
* [Terraform](https://www.terraform.io/downloads) and the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)

If you want to use a completely separate SSH key pair for this lab then you can create one using the following command:

```shell
ssh-keygen -m PEM -t rsa -b 4096 -f ~/.ssh/bastion -N ''
```

Then specify `admin_ssh_public_key_file = "~/.ssh/bastion.pub"` in  terraform.tfvars.

## Create resources

Note that this section may be run from the [Cloud Shell](https://shell.azure.com), but we recommend that you [setup](https://azurecitadel.com/setup) and use your own bash environment.

1. Clone the repo

    ```shell
    git clone https://github.com/terraform-azurerm-examples/bastion
    ```

1. Change directory

    ```shell
    cd bastion
    ```

1. Initialise

    ```shell
    terraform init
    ```

1. Create a terraform.tfvars

    _Optional_. You may override the default variable values in variables.tf or add in additional AAD object IDs for the Virtual Machine Administrator/User Login roles on the resource group.

    Example terraform.tfvars:

    ```json
    location = "eastus2"
    admin_ssh_public_key_file = "~/.ssh/bastion.pub"
    address_space = "10.3.240.0/25"
    ```

    If a windows password is not specified for the admin account then one will be generated and stored in the key vault along with the private key for the SSH key pair. All access should be via AAD authentication, so these credentials are intended for break glass scenarios.

    For reference, here are all of the defaults found in variables.tf, expressed in terraform.tfvars format.

    ```json
    resource_group_name = "bastion"
    location = "West Europe"
    bastion_name = "bastion"
    admin_username = "azureadmin"
    admin_ssh_public_key_file = "~/.ssh/id_rsa.pub"
    windows_server_name = "windows"
    windows_server_admin_password = null
    virtual_network_name = "bastion"
    address_space = "172.19.76.0/25"
    subnet_name = "vms"
    scale_units = 2
    virtual_machine_admins = []
    virtual_machine_users = []
    ```

1. Plan

    ```shell
    terraform plan
    ```

1. Apply

    ```shell
    terraform apply
    ```

    Terraform will start to create the resources and will then display the outputs. The resources take about 20 minutes to deploy.

1. Redisplay output

    _Optional_. If you ever need to redisplay the output values, then type:

    ```shell
    terraform output
    ```

## Resources created

All of the resources are created in a single resource group.

| **Resource Type** | **Default Name** | **Notes** |
|---|---|---|
| Resource group | bastion | |
| Virtual Network | bastion | 172.19.76.0/25, split into two /26 subnets for VMs and Azure Bastion |
| Bastion | bastion | Standard SKU |
| SSH Key | ubuntu-ssh-public-key | ~/.ssh/id_rsa.pub |
| VM | ubuntu | Ubuntu 20.04 with AAD and Azure tools |
| VM | windows | Windows 2022 Server Azure Edition with AAD and Azure tools |
| Key Vault | bastion-_\<uniq>_-kv | Secrets: windows password, private SSH key, sql connection string |

Plus associated NSGs, NICs, OS disks etc.

## RDP

Use the native Windows RDP client via Azure Bastion to access the Windows server. Authenticate with your AAD credentials.

The command to initiate an RDP session **can only be used from a Windows client**, e.g. Windows 10 / Windows 11.

> PowerShell cmdlets for Azure Bastion are available but are not covered in this lab.

1. Copy the command

    Run a `terraform output` command to display the command, and then copy the result. Run this from the directory that you originally cloned and ran `terraform apply` from.

    ```shell
    terraform output rdp_to_windows_server
    ```

    Example output:

    ```shell
    az network bastion rdp --name bastion --resource-group bastion --target-resource-id <vmid>
    ```

    > Copy the command between the double quotes, but not the quotes themselves..

1. Authenticate

    You'll need the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows) installed at the OS level.

    Open a PowerShell terminal on your machine and login to Azure.

    ```shell
    az login
    ```

    Check you are in the right subscription. (This is your "current context".)

    ```shell
    az account show
    ```

    > If not then [change subscription](https://docs.microsoft.com/en-us/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

1. RDP

    Run the `az network bastion rdp` command you copied earlier. You'll be prompted to re-authenticate using your AAD credentials before you can access the desktop.

    ![authenticate](../images/authenticate.png)

    The RDP session will open if you have Virtual Machine Administrator Login or Virtual Machine User Login on the target VM.

    ![rdp](../images/rdp.jpg)

1. Check identity access to the secret

    _Optional._

    The Windows VM's custom data has installed the Azure CLI and PowerShell 7 plus the Az PowerShell module. The VM has a system assigned managed identity that has been given an access policy on the key vault enabling it to get secrets.

    Use the identity to read the example sql secret from the key vault.

    * Copy the command

        ```shell
        terraform output example_secret_powershell
        ```

        Example command:

        ```powershell
        Connect-AzAccount -Identity | Out-Null; Get-AzKeyVaultSecret -Name sql -VaultName bastion-<uniq>-kv -AsPlainText
        ```

    * Open a PowerShell 7 (x64) terminal from the remote desktop session's Start menu
    * Paste the PowerShell command

        You will authenticate as the managed identity and retrieve the secret from the key vault.

        ![Example secret via PowerShell](../images/example_secret_powershell.png)

        Expected output:

        ```text
        Server=tcp:myserver.database.windows.net,1433;Database=myDataBase;User ID=mylogin@myserver;Password=myPassword;Trusted_Connection=False;Encrypt=True;
        ```

    The managed identity successfully retrieved the secret. This is a very useful pattern when using a config management server and you need to be able to add keys, secrets and certs into your automation without compromising security.

1. Disconnect from the remote desktop session

## SSH

Now you will SSH via Azure Bastion to the linux VM and authenticate using AAD.

This command works from both Windows (which now has the native [openssh](https://docs.microsoft.com/windows-server/administration/openssh/openssh_overview) client) and from linux systems such as WSL2.

1. Copy the command

    ```shell
    terraform output user_ssh_to_linux_server
    ```

    Example output:

    ```shell
    az network bastion ssh --name bastion --resource-group bastion --target-resource-id <vmid> --auth-type AAD
    ```

1. Open a PowerShell terminal on your machine
1. Paste the `az network bastion ssh` command

    You may be prompted to re-authenticate using your AAD credentials if the token needs refreshing.

    ![ssh](../images/ssh.png)

    Note that you are logged in as your Azure AD user principal name.

1. Use the Instance Metadata Service (IMDS)

    _Optional._

    The Ubuntu VM used cloud-init to install the Azure CLI, Terraform, jq, stress and tree. It has also set the JQ_COLORS environment variable to match the jsonc output form the Azure CLI.

    Access the [instance metadata service](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/instance-metadata-service?tabs=linux) using the command below.

    ```shell
    curl -H Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance?api-version=2021-02-01" | jq
    ```

    There is some useful information in there which may be useful in scripts.

    Here are some example techniques to set variables from the IMDS output JSON.

    * straight IMDS REST API call

      ```shell
      image_reference=$(curl -sSLH Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance/compute/storageProfile/imageReference?api-version=2021-02-01")
      ```

    * extracting a sub-value using jq

      ```shell
      subscription_id=$(curl -sSLH Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance/compute/?api-version=2021-02-01" | jq -r .subscriptionId)
      ```

    * slurping the JSON into a variable used as a here string

      ```shell
      imds=$(curl -sSLH Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance/?api-version=2021-02-01")
      id=$(jq -r .compute.resourceId <<< $imds)
      subscription_id=$(jq -r .compute.subscriptionId <<< $imds)
      resource_group_name=$(jq -r .compute.resourceGroupName <<< $imds)
      resource_group_id=${id%%/providers/Microsoft.Compute/*}
      ```

      This approach has a modest speed gain.

1. Check managed identity access to the secret

    _Optional._

    The Ubuntu VM also has a managed identity and an access policy to get secrets.

    * Copy the command

        ```shell
        terraform output example_secret_cli
        ```

        Example command:

        ```shell
        az login --identity --allow-no-subscriptions --output none; az keyvault secret show --name sql --vault-name bastion-<uniq>-kv --query value --output tsv
        ```

    * Paste the command into your Ubuntu VM ssh session

        Expected output:

        ```text
        Server=tcp:myserver.database.windows.net,1433;Database=myDataBase;User ID=mylogin@myserver;Password=myPassword;Trusted_Connection=False;Encrypt=True;
        ```

## Tunneling

The core SSH and RDP commands will be all that most admins will need. But what if you want to punch through to another port? For instance, an admin portal web page that is running on one of those servers?

Let's use the example of Jenkins, which runs a web UI defaulting to port 8080. We'll emulate that with a simple HTML page.

### Create a basic web server

You should still be on the Ubuntu VM as your AAD credentials. Spin up a simple web server.

1. Create a directory

    ```shell
    sudo mkdir -m 755 /web
    ```

1. Create an index.html file

    ```shell
    sudo curl https://raw.githubusercontent.com/terraform-azurerm-examples/bastion/main/index.html --output /web/index.html
    ```

1. Start the web server on port 8080

    ```shell
    sudo /usr/bin/python3 -m http.server --directory /web 8080
    ```

    Expected output:

    ```text
    Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
    ```

1. Keep this session open

### Tunnel

On your machine, start up the tunnel and then access the site via the browser. 

1. Open a **new terminal session** and go back into your Terraform folder
1. Display the tunnel command

    ```shell
    terraform output tunnel_to_linux_server
    ```

    Copy the command between the prompts.

    Example command format:

    ```shell
    az network bastion tunnel --name bastion --resource-group bastion --target-resource-id <vmid> --resource-port 8080 --port 8080
    ```

    The `resource port` is the one on the VM. It will be mapped to the `--port` value.

1. Run the `az network bastion tunnel` command at the OS level

    ![Tunnel](../images/tunnel.png)

1. Open the web page

    Open up a browser and go to <http://localhost:8080>.

    If you see the basic web page below then you have traversed the tunnel through Azure Bastion and accessed the web page running on the virtual machine.

    ![Web Page](../images/web_page.png)

    **Success!**

## Cleanup

You can use Terraform to remove all of the resources.

```shell
terraform destroy
```

Alternatively, delete the resource group manually with the CLI or Azure portal.

## Summary

The combination of Azure AD authentication for virtual machines, native client access through Azure Bastion and managed identity is potent.

Azure Bastion's native client access is a far better way of accessing your Azure virtual machines. Rich functionality, improved copy and paste and file upload and download make an admin's life simpler. This is achieved without requiring public IPs and increasing the attack surface.

Add in AAD auth and you can manage access with conditional access and MFA. Limit who can access by assigning the Virtual Machine Administrator Login and Virtual Machine User Login roles to the right scope points for the right Azure AD security groups. In the example repo we add this in using a standard Terraform resource type, but you could use Azure Policy and the _deploy if not exist (DINE)_ effect to auto-install the extensions.

Many of you use linux and Windows machines as jumpboxes, or configuration management hosts. Using the instance metadata service and managed identity access to other Azure Resource such as Azure Key Vault, Azure Storage, Shared Image Gallery etc. opens up a number of automation possibilities.

The [best practices for virtual machine remote access](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/plan-for-virtual-machine-remote-access) in the [Cloud Adoption Framework](https://aka.ms/caf) are recommended reading.
