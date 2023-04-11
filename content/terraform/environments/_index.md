---
title: "Environments"
description: "Example environments commonly used when deploying infrastructure as code to Azure via Terraform."
date: 2023-04-11
draft: false
weight: 10
menu:
  side:
    identifier: 'terraform-envs'
    parent: 'terraform'
---

## Overview

There are many ways to use Terraform with Azure, so here are a few options. Whethere you are working alone or in a team, demoing or deploying to production, running interactively or in a pipeline then this section will give a terse description of the pros and cons, and simple steps.

For consistency we will use the same source repo all the way through, and make use of environment variables.

Wherever applicable we will be making use of OpenID Connect to securely federate the security principals with other identity providers such as GitHub and Terraform Cloud.

## Environments