# Skill: Image Processing

## Overview
Automated image optimization pipeline to ensure the platform remains fast and premium-looking while managing storage costs effectively.

## Instructions
- **Trigger**: Every time a user or admin uploads an image to the platform.
- **Processing Steps**:
  - **Normalization**: Convert all formats (HEIC, PNG) to WEBP for optimal compression/quality ratio.
  - **Resizing**: Generate multiple resolutions (Thumbnail: 400px, Hero: 1200px) based on target component needs.
  - **Compression**: Apply lossy compression (Target quality: 80%) to minimize file size without visible artifacts.
  - **Watermarking**: Superimpose a subtle, semi-transparent "24h Food Tour" logo at the bottom-right corner (Opacity: 20%).
- **Storage**:
  - Store assets in Firebase Storage or Cloudinary.
  - Return the optimized URL to the calling agent or frontend logic.
- **Safety**: Scan for inappropriate content using relevant AI vision tools before processing.
