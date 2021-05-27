---
title: "SAP Azure Synapse Analytics Integration series"
description: "This is a 5 part series for SAP and Azure Synapse Analytics Integration. In this series we will set the context around the SAP data integration, Architecture Overview, SAP data integration with Azure Synapse Analytics, data analytics, BI reporting with Power BI along with outlining the challenges and best practices."
author: [ "Mahesh Balija" ]
layout: single
toc: 3
menu:
  side:
    identifier: sap-asa-integration
---

## Video Series

### Episode 1: Business Overview 

Today our customers face a lot of Integration challenges while managing their data estate. There are challenges around siloed data, getting a holistic view of data when different enterprise systems are used, building modern data ware house, data governance, analytics and also developing inhouse skillsets. 
Today organizations have to deal with data coming from wide variety of source systems such as SAP, Salesforce, Line Of Business applications, Operational databases, application logs or data generated from devices or even social media datasets. Data could come in all shapes and sizes such as Unstructured, Semi-structured, Structured datasets and gigabytes to petabytes scale. Organizations are looking to build centralized data lakes where they can collect, store and transform the data from all these source systems so they can analyse and generate insights across their data estate rather than dealing with isolated or siloed data independently. 

From SAP perspective, Once customers get their SAP landscapes running in Azure in a secure and compliant way, they are ready to integrate SAP data and applications with non-SAP data, to drive greater insights and digital transformation. Azure Synapse Analytics provides the ability to ingest, store, process, analyse all kinds of data and at all scales i.e., gigabyte to petabyte scale and provides a one-stop-shop solution for your Data Engineering, Data Science and Data Analytics workloads. 

To showcase SAP and Azure Synapse Integration,  We would be building out a Sales Dashboard Report for a fictitious company who sell motorbikes. In this Sales Dashboard we can see top 10 materials by Volume which is the type of motorbike,  Sales, General & administrative expenses by year, who are the top 10 customers by revenue & SGA sales by posting period. 

{{< youtube id="uSKIQPHuXBM" autoplay="false">}}

### Episode 2: Project Overview 

In the first part we talked about SAP Data Integration Challenges,  a specific business use case & a quick overview of Azure Synapse. Now let's do a deep dive into our business use case  & also understand what are the pre-requisites.  The sales dashboard is going to show a summary  of key Sales information. 

For the source system we are using SAP S/4 HANA 2020. The information that we are gathering is
	a. balance per year from universal journal table which is ACDOCA,
	b. top 10 customers by revenue from VBRK which is a SAP standard transparent table used for storing Billing Document: Header Data
	c. top 10 materials sold by volume from VBRP,  is a SAP standard transparent table used for storing Billing Document: Item Data
	d. top 5 geo area by sales revenue from VBRK
	e. Selling, general and admin(SGA) as a percentage of Sales from ACDOCA  
	
We extract this data and bring into Azure Synapse where effectively we are storing this in Azure data lake as a landing zone. Once the raw data is available in the Azure Data Lake Storage, we then applied ETL/ELT transformations within the Azure Synapse Analytics using Synapse Mapping Data Flows, Synapse Spark and SQL notebooks using both Dedicated SQL Pools and  Server Less SQL Pools. Upon transforming the data you can land the data into Synapse dedicated SQL pools which acts as the Serving layer for the Reporting. We have also performed advanced analytics such as predictive modelling using Azure Machine Learning and generated the final reports using Power BI which is also natively integrated into Azure Synapse Analytics.

We are using 3 main components in this setup

	1. The source system which is S/4 HANA 2020
	2. SHIR which is Self-hosted Integration Runtime. 
	3. Azure Synapse Analytics workspace

The integration runtime (IR) is the compute infrastructure that Azure Synapse uses to provide data-integration capabilities across different network environments. 
	a. A self-hosted integration runtime can run copy activities between a cloud data store and a data store in a private network. 
	b. It also can dispatch transform activities against compute resources in an on-premises network or an Azure virtual network. 
	c. The installation of a self-hosted integration runtime needs an on-premises machine or a virtual machine inside a private network.


When we create the Linked Service in Azure synapse workspace, connecting to Source Data, we selected the SAP table connector and in the next screen you get all the details to create Self Hosted IR. You can download and install the Integration Runtime on a VM along with SAP connector for Microsoft .NET
 
This can be present in the same VNET where you have your SAP application or could be a different Vnet. If it is a different Vnet, in that case you would need VNET peering to ensure the SHIR VM can communicate with SAP systems. 

{{< youtube id="aIr7OeMWkOc" autoplay="false">}}

## Resources

* [Azure Synapse Analytics](https://docs.microsoft.com/en-us/azure/synapse-analytics/)
