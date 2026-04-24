# EVInsight Dashboard

A clean and user-friendly EV monitoring dashboard for real-time battery status, trip feasibility, efficiency analytics, and future STM32 hardware integration.

Built as a companion software system for a **Physics Project Expo**, alongside the hardware prototype **Smart Electric Vehicle Battery Monitoring and Route Feasibility System**.

---

## Overview

EVInsight Dashboard was created to extend a hardware-based EV battery monitoring project into a practical user interface.

The goal was to demonstrate how embedded systems and software dashboards can work together to improve electric vehicle usability, battery awareness, and travel confidence.

This current version uses manual inputs/sliders to simulate hardware values. Future versions can directly inherit live readings from STM32 potentiometers and sensors.

---

## Why This Project Matters

Electric vehicle users often face:

* Range anxiety
* Uncertainty about reaching destinations
* Unexpected battery drain
* Lack of clear battery insights
* Poor trip planning

This dashboard helps solve those issues with a simple monitoring system.

---

## Features

* Real-time battery percentage monitoring
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

This version currently supports manual controls for demonstration/testing:

* Battery %
* Voltage
* Distance
* Throttle %
* Current draw

These values simulate live hardware readings during the expo demo.

---

## Future Integration

Planned future upgrades:

* Direct STM32 hardware connection
* Auto-sync potentiometer readings
* Real-time sensor streaming
* Web Serial / USB integration
* IoT cloud support
* Mobile companion app

---

## Tech Stack

* React
* HTML
* CSS
* JavaScript
* Responsive UI design

---

## Installation

```bash
git clone https://github.com/yourusername/EVInsight-Dashboard.git
cd EVInsight-Dashboard
npm install
npm run dev
```

---

## Project Expo Purpose

This dashboard was built to showcase how a traditional physics/electronics hardware prototype can be transformed into a modern software-assisted smart system.

It demonstrates the combination of:

* Physics concepts
* Battery behavior analysis
* Embedded systems
* Real-world EV problem solving
* Software dashboard development

---

## Status

Prototype dashboard completed for Physics Project Expo. Hardware auto-sync integration planned next.
