---
title: "Test locally"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "See how to test your changes locally so that you can go into the CI/CD process confident that your commit will pass the Continuous Integration tests."
draft: false
weight: 30
menu:
  side:
    parent: alz-deploy
    identifier: alz-deploy-test
series:
 - alz-deploy
tabs:
  - azure-landing-zone
force_tabs: true
---

{{% shared-content "alz/deploy/test" %}}

## Next

If the tests all look good then your config should pass the CI tests. You're done on this page.

On the next page we will run through the standard branch based workflow to commit your changes into a new branch and submit a pull request to trigger the CI/CD pipelines.
