# Organizational Evolution Matrix

An interactive web application that visualizes organizational evolution from startup to enterprise, based on the concepts from [Scaling Organizations: Lessons from Evolution and Systems Theory](https://ilzekoning.com/blog/2025/02/22/lessons-in-scaling-organisations) by Izzi Koning.

## Overview

This tool allows users to visualize and analyze how organizations evolve across three key dimensions:

1. **Structural Evolution**: How hierarchy, departments, and roles develop over time
2. **Functional Specialization**: How processes, standards, and decision-making mature
3. **System Integration**: How communication channels and cross-functional collaboration adapt

The visualization demonstrates the progression from the "single-function phase" of startups to the specialized structures of established enterprises, providing real-time analysis and insights.

## Features

- **Interactive Stage Selection**: Choose between Startup, Growth Phase, Established, and Enterprise presets
- **Custom Configuration**: Adjust 10 different organizational attributes via intuitive sliders
- **Real-time Visualization**: Radar charts update instantly to show attribute relationships
- **Multi-dimensional Analysis**: Get insights for structural, functional, and integration aspects
- **Warning Detection**: Identify potential organizational issues like siloing or bureaucracy
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Theoretical Background

This tool is built on the organizational evolution concepts presented in [Izzi Koning's blog post](https://ilzekoning.com/blog/2025/02/22/lessons-in-scaling-organisations), which draws parallels between:

- **Biological Evolution** and **Organizational Evolution**
- **Single-cell organisms** and **Startups with generalist roles**
- **Cell specialization** and **Role specialization**
- **Organ systems** and **Departments/Teams**
- **Nervous system** and **Communication channels**

The visualization helps identify when an organization should consider transitioning from generalist to specialist roles, and how to maintain effective system integration during growth.

## Getting Started

### Prerequisites

This is a vanilla JavaScript application that requires:
- A modern web browser
- No build process or installation needed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/organizational-evolution-matrix.git
```

2. Open `index.html` in your web browser

That's it! No dependencies to install.

## Usage

1. Select a preset organization stage (Startup, Growth Phase, Established, Enterprise)
2. Adjust individual sliders to customize your organization's profile
3. View the radar charts to understand attribute relationships
4. Read the analysis for insights about your organization's evolutionary state
5. Look for warnings about potential organizational issues

## Project Structure

```
organizational-evolution-matrix/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── main.js             # JavaScript functionality
└── README.md           # This file
```

## Technical Details

The application uses:
- Vanilla JavaScript for functionality
- Chart.js for radar chart visualization
- CSS Grid for responsive layout
- CSS Custom Properties for theming

## Acknowledgments

- Inspired by the blog post [Scaling Organizations: Lessons from Evolution and Systems Theory](https://ilzekoning.com/blog/2025/02/22/lessons-in-scaling-organisations) by Izzi Koning
- Chart.js for the radar chart visualizations
- Design concept inspired by the Westworld Attribute Matrix UI