---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
author: ["Your Name"]
description: "Brief description of the blog post"
draft: false
tags: ["azure", "tutorial"]
categories: ["blog"]
---

# {{ replace .Name "-" " " | title }}

Your blog post content goes here. This first paragraph will be displayed on the main page as a preview.

<!--more-->

Continue with the rest of your blog post content here. Content after the `<!--more-->` comment will only be visible on the full blog post page.