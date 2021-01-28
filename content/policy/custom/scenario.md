---
title: "Customer scenario"
date: 2020-08-25
author: [ "Richard Cheney" ]
description: "In this first lab we will describe the customer scenario so that you understand the problem being solved by the custom policy."
weight: 1
draft: false
series:
 - policy-custom
menu:
  side:
    parent: policy-custom
---

## Scenario

Before we start, let's spend a little time understanding the problem statement that the customer was trying to prevent.

## Just In Time access

The customer uses Just In Time access (JIT) to minimise the attack surface of their management VMs. When you use JIT, the service creates a rule on the NSG to deny traffic on ports 22 (SSH), 3389 (RDP) and 5985/5986 (WinRM). (This is the default list of ports and can be customised.)

![JIT default](/policy/custom/images/custom-jit-default.png)

## Requesting access in the portal

When you connect to a protected VM you have the option of using your internet IP address as the source, specifying one or more addresses or allowing any source IP.

![JIT connect](/policy/custom/images/custom-jit-connect.png)

## All configured IPs

_All configured IPs_ is the current default source. If that default is used and accepted then a new rule goes in with a higher priority.

![JIT any](/policy/custom/images/custom-jit-anysourcerule.png)

Note the **Source: Any**.

## Customer requirement

This Just In Time rule will be automatically removed after a period of time - usually three hours - but in the meantime there is a greater risk of a brute force attack against the public IP.

The customer has asked whether it is possible to use policy to deny any JIT created rules with the _All configured IPs_ option.

Challenge accepted!

## Warning

As already mentioned, creating custom policies is a dark art and much of the text is to help you understand some of the nuances. Don't just fly through the labs by copying the code blocks out!

OK, let's go.
