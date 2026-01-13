+++
Title = "Sovereignty and Geography Groups"
Date = 2025-10-21T00:00:00Z
people = ["Richard Cheney"]
tags = ["citadel"]
draft = false
+++

An interesting little Azure Update popped up last week, as the Locations API will be switching its output for the UK, with the Geography Group changing from "Europe" to "UK".

{{< flash>}}
**[Generally Available: Locations API Update for UK Azure Regions](https://azure.microsoft.com/en-us/updates?id=513376)**

To align with evolving compliance and regulatory requirements, Azure is updating the geographyGroup and regionalDisplayName metadata for UK-based regions in the Locations API.

These changes will take effect this month, October 2025, and will apply to the existing UK South and UK West regions. It will introduce a new geographyGroup value: "UK", and the regionalDisplayName prefix will also be updated from "Europe" to "UK".

What customers will see:

- Updated values in Locations API responses for UK-based regions
- Revised region names in Azure Portal region selection menus
{{< /flash>}}

This command pulls out the info for the UK regions.

```bash
az account list-locations --query "[?starts_with(name, 'uk')]" --output jsonc
```

Here is how it looked at the start of the month:

```json
[
  {
    "availabilityZoneMappings": [
      {
        "logicalZone": "1",
        "physicalZone": "uksouth-az2"
      },
      {
        "logicalZone": "2",
        "physicalZone": "uksouth-az1"
      },
      {
        "logicalZone": "3",
        "physicalZone": "uksouth-az3"
      }
    ],
    "displayName": "UK South",
    "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/locations/uksouth",
    "metadata": {
      "geography": "United Kingdom",
      "geographyGroup": "Europe",
      "latitude": "50.941",
      "longitude": "-0.799",
      "pairedRegion": [
        {
          "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/locations/ukwest",
          "name": "ukwest"
        }
      ],
      "physicalLocation": "London",
      "regionCategory": "Recommended",
      "regionType": "Physical"
    },
    "name": "uksouth",
    "regionalDisplayName": "(Europe) UK South",
    "type": "Region"
  },
  {
    "displayName": "United Kingdom",
    "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/locations/uk",
    "metadata": {
      "regionCategory": "Other",
      "regionType": "Logical"
    },
    "name": "uk",
    "regionalDisplayName": "United Kingdom",
    "type": "Region"
  },
  {
    "displayName": "UK West",
    "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/locations/ukwest",
    "metadata": {
      "geography": "United Kingdom",
      "geographyGroup": "Europe",
      "latitude": "53.427",
      "longitude": "-3.084",
      "pairedRegion": [
        {
          "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/locations/uksouth",
          "name": "uksouth"
        }
      ],
      "physicalLocation": "Cardiff",
      "regionCategory": "Other",
      "regionType": "Physical"
    },
    "name": "ukwest",
    "regionalDisplayName": "(Europe) UK West",
    "type": "Region"
  }
]
```

And here is how it looks now:

```json
[
  {
    "availabilityZoneMappings": [
      {
        "logicalZone": "1",
        "physicalZone": "uksouth-az1"
      },
      {
        "logicalZone": "2",
        "physicalZone": "uksouth-az2"
      },
      {
        "logicalZone": "3",
        "physicalZone": "uksouth-az3"
      }
    ],
    "displayName": "UK South",
    "id": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/locations/uksouth",
    "metadata": {
      "geography": "United Kingdom",
      "geographyGroup": "UK",
      "latitude": "50.941",
      "longitude": "-0.799",
      "pairedRegion": [
        {
          "id": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/locations/ukwest",
          "name": "ukwest"
        }
      ],
      "physicalLocation": "London",
      "regionCategory": "Recommended",
      "regionType": "Physical"
    },
    "name": "uksouth",
    "regionalDisplayName": "(UK) UK South",
    "type": "Region"
  },
  {
    "displayName": "United Kingdom",
    "id": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/locations/uk",
    "metadata": {
      "regionCategory": "Other",
      "regionType": "Logical"
    },
    "name": "uk",
    "regionalDisplayName": "United Kingdom",
    "type": "Region"
  },
  {
    "displayName": "UK West",
    "id": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/locations/ukwest",
    "metadata": {
      "geography": "United Kingdom",
      "geographyGroup": "UK",
      "latitude": "53.427",
      "longitude": "-3.084",
      "pairedRegion": [
        {
          "id": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/locations/uksouth",
          "name": "uksouth"
        }
      ],
      "physicalLocation": "Cardiff",
      "regionCategory": "Other",
      "regionType": "Physical"
    },
    "name": "ukwest",
    "regionalDisplayName": "(UK) UK West",
    "type": "Region"
  }
]
```

The geographyGroup in the metadata is gaining more importance as data and operation sovereignty controls tighten for public cloud, with the EU Data Boundary relating to the EU and EFTA regions.

Here is another useful command that shows all of the current physical regions as a table sorted by geographyGroup and geography.

```bash
az account list-locations --query "sort_by(sort_by(sort_by([?metadata.regionType == 'Physical'].{geographyGroup:metadata.geographyGroup, geography:metadata.geography, location:metadata.physicalLocation, displayName:displayName, name:name}, &displayName), &geography), &geographyGroup)" --output table
```

Feel free to check out the JMESPATH page for the syntax of the query above. Effectively it filters the array where metadata.regionType is physical, selectively creates new objects, sorts by displayName, then geography, then geographyGroup and outputs as a table.

(Copilot can be very useful in constructing more complex queries...)

Here is the resulting table in Markdown form.

| GeographyGroup | Geography       | Location         | DisplayName           | Name                  |
|---------------|-----------------|-----------------|-----------------------|-----------------------|
| Africa        | South Africa    | Johannesburg     | South Africa North    | southafricanorth     |
| Africa        | South Africa    | Cape Town        | South Africa West     | southafricawest      |
| Asia Pacific  | Asia Pacific    | Hong Kong        | East Asia             | eastasia             |
| Asia Pacific  | Asia Pacific    | Singapore        | Southeast Asia        | southeastasia        |
| Asia Pacific  | Australia       | Canberra         | Australia Central     | australiacentral     |
| Asia Pacific  | Australia       | Canberra         | Australia Central 2   | australiacentral2    |
| Asia Pacific  | Australia       | New South Wales  | Australia East        | australiaeast        |
| Asia Pacific  | Australia       | Victoria         | Australia Southeast   | australiasoutheast   |
| Asia Pacific  | India           | Pune             | Central India         | centralindia         |
| Asia Pacific  | India           | Nagpur           | Jio India Central     | jioindiacentral      |
| Asia Pacific  | India           | Jamnagar         | Jio India West        | jioindiawest         |
| Asia Pacific  | India           | Chennai          | South India           | southindia           |
| Asia Pacific  | India           | Mumbai           | West India            | westindia            |
| Asia Pacific  | Indonesia       | Jakarta          | Indonesia Central     | indonesiacentral     |
| Asia Pacific  | Japan           | Tokyo, Saitama   | Japan East            | japaneast            |
| Asia Pacific  | Japan           | Osaka            | Japan West            | japanwest            |
| Asia Pacific  | Korea           | Seoul            | Korea Central         | koreacentral         |
| Asia Pacific  | Korea           | Busan            | Korea South           | koreasouth           |
| Asia Pacific  | Malaysia        | Kuala Lumpur     | Malaysia West         | malaysiawest         |
| Asia Pacific  | New Zealand     | Auckland         | New Zealand North     | newzealandnorth      |
| Canada        | Canada          | Toronto          | Canada Central        | canadacentral        |
| Canada        | Canada          | Quebec           | Canada East           | canadaeast           |
| Europe        | Austria         | Vienna           | Austria East          | austriaeast          |
| Europe        | Belgium         | Brussels         | Belgium Central       | belgiumcentral       |
| Europe        | Europe          | Ireland          | North Europe          | northeurope          |
| Europe        | Europe          | Netherlands      | West Europe           | westeurope           |
| Europe        | France          | Paris            | France Central        | francecentral        |
| Europe        | France          | Marseille        | France South          | francesouth          |
| Europe        | Germany         | Berlin           | Germany North         | germanynorth         |
| Europe        | Germany         | Frankfurt        | Germany West Central  | germanywestcentral   |
| Europe        | Italy           | Milan            | Italy North           | italynorth           |
| Europe        | Norway          | Norway           | Norway East           | norwayeast           |
| Europe        | Norway          | Norway           | Norway West           | norwaywest           |
| Europe        | Poland          | Warsaw           | Poland Central        | polandcentral        |
| Europe        | Spain           | Madrid           | Spain Central         | spaincentral         |
| Europe        | Sweden          | Gävle            | Sweden Central        | swedencentral        |
| Europe        | Switzerland     | Zurich           | Switzerland North     | switzerlandnorth     |
| Europe        | Switzerland     | Geneva           | Switzerland West      | switzerlandwest      |
| Mexico        | Mexico          | Querétaro State  | Mexico Central        | mexicocentral        |
| Middle East   | Israel          | Israel           | Israel Central        | israelcentral        |
| Middle East   | Qatar           | Doha             | Qatar Central         | qatarcentral         |
| Middle East   | UAE             | Abu Dhabi        | UAE Central           | uaecentral           |
| Middle East   | UAE             | Dubai            | UAE North             | uaenorth             |
| South America | Brazil          | Sao Paulo State  | Brazil South          | brazilsouth          |
| South America | Brazil          | Rio              | Brazil Southeast      | brazilsoutheast      |
| South America | Chile           | Santiago         | Chile Central         | chilecentral         |
| UK            | United Kingdom  | London           | UK South              | uksouth              |
| UK            | United Kingdom  | Cardiff          | UK West               | ukwest               |
| US            | United States   | Iowa             | Central US            | centralus            |
| US            | United States   | Virginia         | East US               | eastus               |
| US            | United States   | Virginia         | East US 2             | eastus2              |
| US            | United States   | Illinois         | North Central US      | northcentralus       |
| US            | United States   | Texas            | South Central US      | southcentralus       |
| US            | United States   | Wyoming          | West Central US       | westcentralus        |
| US            | United States   | California       | West US               | westus               |
| US            | United States   | Washington       | West US 2             | westus2              |
| US            | United States   | Phoenix          | West US 3             | westus3              |

You can expect to see a few more posts from me relating to sovereignty over the next few months!
