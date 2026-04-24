# EVInsight Dashboard

A clean and user-friendly EV monitoring dashboard for battery status, trip feasibility, efficiency analytics, and future STM32 hardware integration.

Built as a companion software system for a **Physics Project Expo**, alongside the hardware prototype **Smart Electric Vehicle Battery Monitoring and Route Feasibility System**.

---

## Overview

EVInsight Dashboard was created to visually demonstrate how a hardware EV battery monitoring system can be extended into a practical software dashboard.

The project was built quickly for expo demonstration purposes to showcase the concept of combining embedded systems with a modern monitoring interface.

**Important:** All values shown in this version are **simulated** for demonstration purposes and do not represent live production-grade vehicle data.

---
## Live Demo

Try the project here:

**Demo Link:** `https://routepulse.netlify.app/`

> Note: This is a prototype demo built for exhibition purposes. All displayed values are simulated and some features may be experimental.

## Demo Notice

This project was developed in a short time specifically for presentation/demo use.

Because of that:

* Some features may be incomplete
* Some calculations are simplified
* UI interactions may contain bugs
* Values are simulated
* Performance may not be fully optimized

This version is meant to demonstrate the idea and future potential of the system.

---

## Why This Project Matters

Electric vehicle users often face:

* Range anxiety
* Uncertainty about reaching destinations
* Unexpected battery drain
* Lack of clear battery insights
* Poor trip planning

This dashboard explores how software can help solve those issues.

---

## Features

* Simulated battery percentage monitoring
* Voltage and runtime estimation
* Destination reachability checker
* Suggested charging alerts
* Driving efficiency insights
* Battery health overview
* Historical analytics with charts
* Clean minimal dashboard UI
* Responsive design for desktop and mobile
* Future-ready for STM32 live hardware sync

---

## Dashboard Sections

### Main Dashboard

* Battery %
* Voltage
* Runtime remaining
* Current draw
* Vehicle status
* Smart recommendations

### Trip Planner

* Enter destination distance
* Reachable / Not Reachable result
* Remaining range after trip
* Charging recommendation

### Battery Health

* Health score
* Voltage stability
* Temperature status
* Degradation estimate

### Analytics

* Battery trend
* Runtime history
* Efficiency graphs
* Usage patterns

### Alerts

* Low battery warning
* High consumption alerts
* Critical battery notifications

---

## Current Prototype Mode

This version currently uses manual controls/sliders for simulation:

* Battery %
* Voltage
* Distance
* Throttle %
* Current draw

These are used to mimic hardware readings during the expo demo.

---

## Future Integration

Planned upgrades:

* Direct STM32 hardware connection
* Auto-sync potentiometer readings
* Real-time sensor streaming
* Web Serial / USB integration
* Better calculations
* Mobile companion app
* Stable production-ready version

---

## Tech Stack

* React / HTML / CSS / JavaScript
* Chart.js / Recharts
* Responsive UI design

---

## Installation

```bash
git clone https://github.com/teliamogh7578/EVInsight-Dashboard.git
cd EVInsight-Dashboard
npm install
npm run dev
```

---

## Project Expo Purpose

This dashboard was built to show how a traditional physics/electronics prototype can evolve into a smart software-assisted EV monitoring system.

It demonstrates the combination of:

* Physics concepts
* Battery behavior analysis
* Embedded systems
* EV usability improvements
* Dashboard software development

---

## Status

Prototype dashboard built rapidly for Physics Project Expo demonstration.

Not production-ready.
Contains simulated data.
May contain bugs.
Future improved version planned.
