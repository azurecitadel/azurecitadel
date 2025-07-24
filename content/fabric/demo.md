---
title: "Demo"
description: "Set of copyable code blocks and demo reminders"
layout: single
draft: false

---

## Authentication check

1. Portals (as admin ID)

    - [Entra portal](https://entra.microsoft.com/#home)
    - [Azure portal](https://portal.azure.com)
    - [Fabric portal](https://app.powerbi.com/home?ctid=ac40fc60-2717-4051-a567-c0cd948f0ac9&experience=fabric-developer)

1. Azure CLI

    ```shell
    az account set --subscription "Terraform Fabric"
    az account show
    ```

1. GitHub

    ```shell
    gh auth status
    ```

1. Fabric CLI

    ```shell
    fab auth status
    ```

## Fabric Capacity

1. List the available capacities.

    ```shell
    fab ls -l .capacities
    ```

1. Create an F-SKU

    ```bash
    az group create --name "rg-fabric" --location "UK South"
    upn=$(az ad signed-in-user show --query userPrincipalName -otsv)
    az fabric capacity create --capacity-name "example" --resource-group "rg-fabric" --location "UK South" --sku "{name:F2,tier:Fabric}" --administration "{members:[${upn}]}"
    ```

1. Relist the available capacities

    ```shell
    fab ls -l .capacities
    ```

    Whilst that is running, go to the Azure portal and view the administrators for the fabric capacity.

1. Get full output for an F-SKU (optional)

    ```shell
    fab get .capacities/example.Capacity -q . | jq .
    ```

## User context

Can follow the <https://registry.terraform.io/providers/microsoft/fabric/latest/docs/guides/auth_app_reg_user> page, or use the commands below. (Is this needed, or has the Go SDK for Fabric been updated?)

1. Create the app reg

    Note that this needs to meet naming conventions now: <https://aka.ms/identifier-uri-formatting-error>

    ```shell
    name=fabric_terraform_provider
    uri="api://$(az account show --query tenantId -otsv)/$name"

    az ad app create --display-name $name --identifier-uris $uri
    az ad app update --id $uri --required-resource-accesses '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"},{"id":"b340eb25-3456-403f-be2f-af7a0d370277","type":"Scope"}]},{"resourceAppId":"00000009-0000-0000-c000-000000000000","resourceAccess":[{"id":"4eabc3d1-b762-40ff-9da5-0e18fdf11230","type":"Scope"},{"id":"b2f1b2fa-f35c-407c-979c-a858a808ba85","type":"Scope"},{"id":"445002fb-a6f2-4dc1-a81e-4254a111cd29","type":"Scope"},{"id":"8b01a991-5a5a-47f8-91a2-84d6bfd72c02","type":"Scope"}]}]'
    az ad app update --id $uri --set api='{"acceptMappedClaims":null,"knownClientApplications":[],"oauth2PermissionScopes":[{"adminConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","adminConsentDisplayName":"Microsoft Fabric Terraform Provider","id":"1ca1271c-e2c0-437c-af9a-3a92e745a24d","isEnabled":true,"type":"User","userConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","userConsentDisplayName":"Microsoft Fabric Terraform Provider","value":"access"}],"preAuthorizedApplications":[],"requestedAccessTokenVersion":null}'
    az ad app update --id $uri --set api='{"acceptMappedClaims":null,"knownClientApplications":[],"oauth2PermissionScopes":[{"adminConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","adminConsentDisplayName":"Microsoft Fabric Terraform Provider","id":"1ca1271c-e2c0-437c-af9a-3a92e745a24d","isEnabled":true,"type":"User","userConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","userConsentDisplayName":"Microsoft Fabric Terraform Provider","value":"access"}],"preAuthorizedApplications":[{"appId":"871c010f-5e61-4fb1-83ac-98610a7e9110","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"00000009-0000-0000-c000-000000000000","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"1950a258-227b-4e31-a9cf-717495945fc2","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"04b07795-8ddb-461a-bbee-02f9e1bf7b46","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]}],"requestedAccessTokenVersion":null}'
    az ad app owner add --id $uri --owner-object-id $(az ad signed-in-user show --query id -otsv)
    az ad app show --id $uri --output jsonc
    echo "App Registration created. Authenticate with:"
    echo "az login --scope $uri/.default"
    ```

1. [Microsoft Entra admin center](https://entra.microsoft.com/#home) > App registrations > My applications

    - API permissions
    - Exposed API
    - Pre-authorised apps (PowerShell, Azure CLI, Power BI)

1. Authenticate

    ```shell
    az login --scope api://$(az account show --query tenantId -otsv)/fabric_terraform_provider/.default
    ```

1. View token

    ```shell
    jq .AccessToken < ~/.azure/msal_token_cache.json
    ```

## Repo & initial run

1. <https://github.com/richeney/fabric_terraform_provider_quickstart>

1. Create to "fabric_demo"

1. Clone

    ```shell
    cd ~/git
    git clone https://github.com/richeney/fabric_demo demo
    cd ~/git/demo
    code .
    ```

1. Browse
1. Rename and modify example-terraform.tfvar
1. fmt > init > validate
1. apply

    ```shell
    terraform plan -var-file=test.tfvars
    ```

Browse <https://aka.ms/terraform/fabric>

## MCP servers

1. Add Microsoft Learn Docs MCP server
1. Run Docker Desktop
1. Create `.vscode/mcp.json`

    ```json
    {
        "servers": {
            "terraform": {
                "type": "stdio",
                "command": "docker",
                "args": [
                    "run",
                    "--interactive",
                    "--rm",
                    "hashicorp/terraform-mcp-server"
                ]
            }
        }
    }
    ```

1. Prompts

    ```text
    #terraform Describe the fabric workspace RBAC assignment resource
    ```

    ```text
    add in the azuread provider, a string variable for group, and a data source for azuread_group
    ```

    ```text
    what role assignment resources are there in the fabric provider?
    ```

    ```text
    add the fabric_workspace_role_assignment for the example workspace and selected group and Contributor role
    ```

1. Rerun fmt > init > validate > plan

1. Apply

    Browse Fabric portal including workspace settings.

1. Destroy

    If Apply is successful then Destroy.

1. ⚠️ Update prod.tfvars

    - Set fabric_capacity_name = example
    - Add group = Finance

Ready to move to CI/CD.

## Fabric tenant settings

Fabric Admin Portal > Tenant Settings > Developer settings. Allows either all identities or a specified security group.

1. Entra security group for Microsoft Fabric Workload Identities

    ```shell
    fabric_group_name="Microsoft Fabric Workload Identities"
    fabric_group_description="Service Principals and Managed Identities used for Fabric automation."
    fabric_group_mail_nickname="FabricWorkloadIdentities"
    az ad group create --display-name "$fabric_group_name" --description "$fabric_group_description" --mail-nickname "$fabric_group_mail_nickname"
    fabric_group_id=$(az ad group show --group "Microsoft Fabric Workload Identities" --query id -otsv)
    echo "Created security group $fabric_group_name"
    ```

1. Update tenant settings

    ```shell
    body=$(jq -nc --arg oid "$fabric_group_id" --arg name "$fabric_group_name" '{"enabled":true,"canSpecifySecurityGroups":true,"enabledSecurityGroups":[{"graphId":$oid,"name":$name}]}')
    jq . <<< $body
    fab api --method post admin/tenantsettings/ServicePrincipalAccessGlobalAPIs/update -i "$body"
    fab api --method post admin/tenantsettings/ServicePrincipalAccessPermissionAPIs/update -i "$body"
    fab api --method post admin/tenantsettings/AllowServicePrincipalsCreateAndUseProfiles/update -i "$body"
    ```

    The Fabric CLI is great for Fabric REST API calls.

    ```shell
    fab api --method get admin/tenantsettings --query "text.tenantSettings[?tenantSettingGroup == 'Developer settings']" | jq .
    ```

## Managed identity and backend

1. Create storage account and managed identity

    ```shell
    terraform_resource_group_name="rg-terraform"
    location="uksouth"
    managed_identity_name="mi-terraform"
    storage_account_prefix="saterraform"
    management_subscription_id="73568139-5c52-4066-a406-3e8533bb0f15"

    az account set --subscription $management_subscription_id
    az group create --name $terraform_resource_group_name --location $location
    az identity create --name $managed_identity_name --resource-group $terraform_resource_group_name --location $location
    managed_identity_object_id=$(az identity show --name $managed_identity_name --resource-group $terraform_resource_group_name --query principalId -otsv)
    managed_identity_client_id=$(az identity show --name $managed_identity_name --resource-group $terraform_resource_group_name --query clientId -otsv)
    storage_account_name="$storage_account_prefix$(az group show --name $terraform_resource_group_name --query id -otsv | sha1sum | cut -c1-8)"
    az storage account create --name $storage_account_name --resource-group $terraform_resource_group_name --location $location --min-tls-version TLS1_2 --sku Standard_LRS --https-only true --default-action "Allow" --public-network-access "Enabled" --allow-shared-key-access false --allow-blob-public-access false
    storage_account_id=$(az storage account show --name $storage_account_name --resource-group $terraform_resource_group_name --query id -otsv)
    az storage account blob-service-properties update --account-name $storage_account_name --enable-versioning --enable-delete-retention   --delete-retention-days 7
    az storage container create --name prod --account-name $storage_account_name --auth-mode login
    az role assignment create --role "Storage Blob Data Contributor" --assignee $managed_identity_object_id --scope "$storage_account_id/blobServices/default/containers/prod"
    az storage container create --name dev --account-name $storage_account_name --auth-mode login
    az role assignment create --role "Storage Blob Data Contributor" --assignee $(az ad signed-in-user show --query id -otsv) --scope "$storage_account_id/blobServices/default/containers/dev"
    ```

1. Add a backend.tf

    ```shell
1. Create a backend.tf

    ```shell
    cat - <<BACKEND > backend.tf
    terraform {
      backend "azurerm" {
        subscription_id      = "$management_subscription_id"
        resource_group_name  = "terraform"
        storage_account_name = "$storage_account_name"
        container_name       = "test"
        key                  = "terraform.tfstate"
        use_azuread_auth     = true
      }
    }
    BACKEND
    ```

## Authorisations

### Fabric

1. Add to the Entra security group for Fabric

    ```shell
    az ad group member add --group "$fabric_group_name" --member-id "$managed_identity_object_id"
    ```

1. Add as administrator on the Fabric Capacity

    ```shell
    fabric_resource_id=$(az fabric capacity show --name "example" --resource-group "rg-fabric" --query id -otsv)
    admins=$(az fabric capacity show --ids $fabric_resource_id --query administration.members --output json | jq --arg oid "$managed_identity_object_id" '. += [$oid]')
    az fabric capacity update --ids $fabric_resource_id --administration "{\"members\": $admins}"
    ```

    Show the administrators on the Fabric Capacity - note that it is a UPN for users and object ID for workload identities.

    Alternatively:

    - assign the Fabric Administrator role to the Entra security group when creating (use the Microsoft Graph)
    - assign Contributor to the Fabric Capacity in the Fabric Admin Portal

    Effectively choose from Entra RBAC (admin on all), Azure RBAC (admin on specified), or Fabric RBAC (contributor on specified).

### Azure RBAC

1. Azure RBAC

    ```shell
    scope="/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15"
    az role assignment create --role "Contributor" --scope $scope --assignee-object-id $managed_identity_object_id --assignee-principal-type ServicePrincipal
    ```

    Show in Azure portal.

### Entra App Roles

1. Entra app roles

    App roles are hidden away, and only available via the REST API today.

    ```shell
    entra_roles="['User.ReadBasic.All','Group.Read.All']"
    graph_object_id=$(az ad sp show --id "00000003-0000-0000-c000-000000000000" --query id -otsv)
    app_role_ids=$(az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "appRoles[?contains(\`$entra_roles\`,
    value)].id" -otsv)
    for role in $app_role_ids
    do
      body=$(jq -nc --arg graph "$graph_object_id" --arg mi "$managed_identity_object_id" --arg role "$role" '{principalId:$mi,resourceId:$graph,appRoleId:$role}')
      az rest --method post --uri "https://graph.microsoft.com/v1.0/servicePrincipals/${managed_identity_object_id}/appRoleAssignments" --body "$body"
    done
    ```

   ```shell
    graph_app_id="00000003-0000-0000-c000-000000000000"
    graph_object_id=$(az ad sp show --id "00000003-0000-0000-c000-000000000000" --query id -otsv)

    for role in User.Read.All Group.Read.All
    do
      app_role_id=$(az ad sp show --id $graph_app_id --query "appRoles[?value == '"$role"'].id" -otsv)
      body=$(jq -nc --arg graph "$graph_object_id" --arg mi "$managed_identity_object_id" --arg role "$app_role_id" '{principalId:$mi,resourceId:$graph,appRoleId:$role}')
      echo "Adding app role $role:"
      jq . <<< $body
      az rest --method post --uri "https://graph.microsoft.com/v1.0/servicePrincipals/${managed_identity_object_id}/appRoleAssignments" --body "$body"
    done
    ```

    Show in Entra portal under Enterprise Apps (Application type = Managed Identities). Other roles:

    ```shell
    az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "appRoles[].value" -oyamlc
    ```

## GitHub

1. Commit the changes and push

    Do it in vscode, or:

    ```shell
    git add .github/workflows/terraform.yml
    git commit -m "Added Terraform workflow"
    git push
    ```

1. View

    ```shell
    gh repo view --web
    ```

1. Browse the .github/workflows/terraform.yml file

1. Create GitHub Actions variables

    ```shell
    terraform_resource_group_name="rg-terraform"
    managed_identity_name="mi-terraform"
    storage_account_prefix="saterraform"
    subscription_id="73568139-5c52-4066-a406-3e8533bb0f15"
    managed_identity_client_id=$(az identity show --name $managed_identity_name --resource-group $terraform_resource_group_name --query clientId -otsv)
    storage_account_name="saterraform$(az group show --name $terraform_resource_group_name --query id -otsv | sha1sum | cut -c1-8)"

    gh variable set ARM_TENANT_ID --body "$(az account show --query tenantId -otsv)"
    gh variable set ARM_CLIENT_ID --body "$managed_identity_client_id"
    gh variable set ARM_SUBSCRIPTION_ID --body "$subscription_id"
    gh variable set BACKEND_AZURE_SUBSCRIPTION_ID --body "$subscription_id"
    gh variable set BACKEND_AZURE_RESOURCE_GROUP_NAME --body "$terraform_resource_group_name"
    gh variable set BACKEND_AZURE_STORAGE_ACCOUNT_NAME --body "$storage_account_name"
    gh variable set BACKEND_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME --body "prod"
    gh variable set TFVARS_FILE --body "prod.tfvars"
    ```

    View in the Settings > GitHub Actions variables

1. Create federated credential in the portal

    |Key|Value|
    |---|---|
    | org | richeney |
    | repo | fabric_demo |
    | entity | Branch |
    | Branch | main |
    | name | github |

    ```shell
    subject=$(gh repo view --json nameWithOwner --template '{{printf "repo:%s:ref:refs/heads/main" .nameWithOwner}}')
    az identity federated-credential create --name github --identity-name $managed_identity_name --resource-group $terraform_resource_group_name --audiences "api://AzureADTokenExchange" --issuer "https://token.actions.githubusercontent.com" --subject "$subject"
    echo "Added federated credential."
    ```

1. Run the workflow

    ```shell
    gh workflow run terraform.yml
    ```

1. View the workflow

   ```shell
   gh workflow view terraform.yml --web
   ```

## Links

- [Terraform Provider for Microsoft Fabric: #1 Accelerating first steps using the CLIs](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-1-accelerating-first-steps-using-the-clis)
- [Terraform Provider for Microsoft Fabric: #2 Using MCP servers and Fabric CLI to help define your fabric resources](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-2-using-mcp-servers-and-fabric-cli-to-help-define-your-fabric-resources)
- [Terraform Provider for Microsoft Fabric: #3 Creating a workload identity with Fabric permissions](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-3-creating-a-workload-identity-with-fabric-permissions)
- [Terraform Provider for Microsoft Fabric: #4 Deploying a fabric config with Terraform in GitHub Actions](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-4-deploying-a-fabric-config-with-terraform-in-github-actions)

- <https://github.com/richeney/terraform_fabric_administrator_reference>
- <https://azurecitadel.com/fabric>

## Cleanup

1. Terraform destroy, or remove workspace from Fabric

    ```shell
    terraform destroy
    ```

1. Delete repo

    ```shell
    cd ~/git
    rm -fr ~/git/demo

1. Delete repo from GitHub

    ```shell
    gh repo delete --yes richeney/fabric_demo
    ```

1. Remove MCP server from Visual Studio Code's user settings
1. Delete terraform and fabric resource groups

    ```shell
    az group delete --yes --no-wait --name rg-terraform
    az group delete --yes --no-wait --name rg-fabric
    ```

1. Remove Fabric developer settings

    ```shell
    body=$(jq -nc '{"enabled":false,"canSpecifySecurityGroups":false}')
    fab api --method post admin/tenantsettings/ServicePrincipalAccessGlobalAPIs/update -i "$body"
    fab api --method post admin/tenantsettings/ServicePrincipalAccessPermissionAPIs/update -i "$body"
    fab api --method post admin/tenantsettings/AllowServicePrincipalsCreateAndUseProfiles/update -i "$body"
    ```

1. Remove Entra group

    ```shell
    az ad group delete --group "Microsoft Fabric Workload Identities"
    ```

1. Remove app reg

    ```shell
    az ad app delete --id api://$(az account show --query tenantId -otsv)/fabric_terraform_provider
    ```

1. Log out of az and fab and delete MSAL token cache

    ```shell
    fab auth logout
    az logout
    rm ~/.azure/msal_token_cache.json
    ```

1. Clear the most recently used list in Azure Portal

1. Check Workspaces in Fabric Admin Portal. May need to clean up Orphaned workspaces.

## Confirmation

```shell
az account set --name "Terraform Fabric"
az account show
az group show --name "rg-fabric"
az group show --name "rg-terraform"
ll -d ~/git/demo
gh repo view richeney/fabric_demo
az ad app show --id api://$(az account show --query tenantId -otsv)/fabric_terraform_provider
fab api --method get admin/tenantsettings --query "text.tenantSettings[?tenantSettingGroup == 'Developer settings']" | jq .
fab ls -l
fab ls -l .capacities
```
