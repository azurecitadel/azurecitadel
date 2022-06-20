---
title: "Key Vault Extension"
description: "Rotating server certificates in a large estate has always been a administration hassle, so let this key vault extension take the heavy lifting for both Azure and Azure Arc-enabled VMs."
slug: keyvault
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-keyvault
series:
 - arc-servers
weight: 170
---

## Introduction

Another nice extension is the Key Vault Extension. This will watch a certificate uploaded into a key vault and then pull it down to the server. Therefore you can rotate your certificates and allow the extensions to do all of the hard work.

On Windows server it will be installed into the selected certificate store.

For linux it is downloaded to a directory and you then install. (This last stage should be scripted.). As this is the slightly more complex version then we will work on the linux VMs for this one.

This is a guided lab rather than a challenge.

## Create a key vault

1. Get a uniq value

    This will help ensure the FQDNs are unique.

    ```bash
    uniq=$(az account show --query id --output tsv | cut -f1 -d-)
    ```

1. Create the key vault

    ```bash
    kv=arc-pilot-$uniq
    az keyvault create --name $kv --retention-days 7 --resource-group arc_pilot --location uksouth
    ```

1.  Create a self signed certificate

    The certificate will be used in the Key Vault Extension lab.

    ```bash
    az keyvault certificate create --name self-signed-cert --vault-name $kv --policy "$(az keyvault certificate get-default-policy)"
    ```

## Access policy

For the Key Vault Extension to work, you need to ensure that the managed identity has access to get the secret. (Remember that certificates are uploaded into the certificate, key and secret areas of a key vault. The certificate part is just the public part, whereas the secret includes everything.)

1. List the managed identities

    Display a table of the Azure Arc-enabled servers and their managed identities.

    ```bash
    az connectedmachine list --resource-group arc_pilot --query "[].{name:name, identity:identity.principalId}" --output table
    ```

1. Create a variable with the objectIds for the managed identities

    ```bash
    managedIdentityIds=$(az connectedmachine list --resource-group arc_pilot --query "[].identity.principalId" --output tsv)
    ```

1. Get the key vault name

    ```bash
    kv=$(az keyvault list --resource-group arc_pilot --query [0].name --output tsv)
    ```

1. Create the access policies

    ```bash
    for id in $managedIdentityIds; do az keyvault set-policy --name $kv --secret-permissions list get --resource-group arc_pilot --object-id $id; done
    ```

    > Note that you could add the managed identities into a security group and then use the objectId for the group as a single access policy or RBAC role assignment. This is a more elegant approach when working at scale.

### Key Vault Extension

1. Set the variables

    ```bash
    kv=$(az keyvault list --resource-group arc_pilot --query [0].name --output tsv)
    cert="self-signed-cert"
    ```

1. Create the Key Vault Extension

    ```bash
    az connectedmachine extension create --name KeyVaultForLinux --publisher Microsoft.Azure.KeyVault --type KeyVaultForLinux --machine-name ubuntu-03 --resource-group arc_pilot --settings "{\"secretsManagementSettings\":{\"pollingIntervalInS\":\"60\",\"observedCertificates\":[\"https://$kv.vault.azure.net/secrets/$cert\"]},\"authenticationSettings\":{\"msiEndpoint\":\"http://localhost:40342/metadata/identity\"}}"
    ```

    The polling interval has been set to 60 seconds rather than the default 3600, or hourly.

    Note the quoted JSON string. These can be a syntactical nightmare, so the [Creating quoted strings](#creating-quoted-strings) section at the end of this page has some useful hints.

1. Repeat

    Repeat the last step for the other linux VMs.

## Stretch targets (optional)

1. Create the Key Vault Extension for the same certificate on the Windows servers

    Use the CA store.

1. Update the certificate in the key vault

## Certificates

The extension will poll the key vault secret every minute and will download updates to /var/lib/waagent/Microsoft.Azure.KeyVault.Store/ in PEM format. This directory is only accessible to root.

1. SSH to the server

1. Set the variables

    ```bash
    kv="<myKeyVaultName>"
    cert="self-signed-cert"
    ```

1. Once the extension creation has succeeded then you can check the folder.

    ```bash
    sudo ls /var/lib/waagent/Microsoft.Azure.KeyVault.Store/
    sudo cat /var/lib/waagent/Microsoft.Azure.KeyVault.Store/$kv.$cert
    ```

    Note the secret's version is included in the full filename. The short form is a symbolic link to the latest of these files.

On Windows it will add to the specified certificateStoreName.

## Certificate Installation

You would usually have a cronjob to check for new certificates in that location and then run these install steps. We'll do it manually.

1. Set pem variable

    You should have the kv and cert variables from the previous step.

    ```bash
    pem=/var/lib/waagent/Microsoft.Azure.KeyVault.Store/$kv.$cert
    ```

1. Convert from PEM to DER

    ```bash
    sudo openssl x509 -outform der -in $pem -out /usr/local/share/ca-certificates/$cert.crt
    ```

1. Update CA certificates

    ```bash
    sudo update-ca-certificates
    ```

## Success criteria

Screen share with your proctor to prove:

* one of your linux VMs has the certificate

  ```bash
   openssl x509 -in  /usr/local/share/ca-certificates/$cert.crt -inform der -noout -text
   ```

* one of your Windows VMs has the certificate in the store (stretch)

## Troubleshooting

The extension manager writes out to /var/lib/GuestConfig/ext_mgr_logs.

The extension agents write out to the /var/lib/waagent/ area on linux.

We'll see the Windows equivalents for the Custom Script Extension in the next lab.

## Creating JSON strings

This section is purely for info.

If you are having difficulty creating JSON strings then first create a JSON file in vscode to check it is syntactically valid.

settings.json

```json
{
  "secretsManagementSettings": {
    "pollingIntervalInS": "3600",
    "certificateStoreLocation": "/var/lib/waagent/Microsoft.Azure.KeyVault.Store/",
    "certificateStoreName": "ignored",
    "observedCertificates": [
      "https://$kv.vault.azure.net/secrets/$cert"
    ]
  },
  "authenticationSettings": {
    "msiEndpoint": "http://localhost:40342/metadata/identity"
  }
}
```

The default certificateStoreLocation has been included for completeness. For Windows just specify the machine name.

### Quoted string

If your JSON includes bash variables then you can convert it to a quoted JSON string using jq.

```bash
jq @json settings.json
```

Output:

```json
"{\"secretsManagementSettings\":{\"pollingIntervalInS\":\"3600\",\"certificateStoreName\":\"ignored\",\"certificateStoreLocation\":\"/var/lib/waagent/Microsoft.Azure.KeyVault.Store/\",\"observedCertificates\":[\"https://$kv.vault.azure.net/secrets/$cert\"]},\"authenticationSettings\":{\"msiEndpoint\":\"http://localhost:40342/metadata/identity\"}}"
```

### Single quoted string

If all of the values are hardcoded then you can just minify it and then enclose in single quotes. This will be a little more readable.

```bash
jq -Mc . settings.json
```

Output:

```json
{"secretsManagementSettings":{"pollingIntervalInS":"3600","observedCertificates":["https://$kv.vault.azure.net/secrets/$cert"]},"authenticationSettings":{"msiEndpoint":"http://localhost:40342/metadata/identity"}}
```

Surround with single quotes.

```text
'{"secretsManagementSettings":{"pollingIntervalInS":"3600","observedCertificates":["https://$kv.vault.azure.net/secrets/$cert"]},"authenticationSettings":{"msiEndpoint":"http://localhost:40342/metadata/identity"}}'
```

### JSON file

If the file will be present then keep it simple and just specify the filename.

```bash
az connectedmachine extension create --name KeyVaultForLinux --publisher Microsoft.Azure.KeyVault --type KeyVaultForLinux --machine-name ubuntu-02 --resource-group arc_pilot --settings settings.json
```

## Resources

* [Key Vault Extension](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions#azure-key-vault-vm-extension)
* [Key Vault VM extension with CLI](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions-cli#enable-extension)
* [Key Vault VM extension with PowerShell](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions-powershell#key-vault-vm-extension)
* [Install CA certs on Ubuntu](https://www.techrepublic.com/article/how-to-install-ca-certificates-in-ubuntu-server/)

## Next

Next we will use the Custom Script Extension to run PowerShell and bash scripts on the connected servers.
