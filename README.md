# Shopify Announcement Banner App

## Overview

This project is a Shopify app that allows merchants to create announcements from the admin dashboard. The announcement is stored in MongoDB, saved as a Shopify metafield, and displayed on the storefront using a Theme App Extension (App Embed).

## Technologies Used

- React Router
- Shopify App Bridge
- MongoDB
- Mongoose
- Shopify GraphQL API

## How to Run

1. Clone the repository.

```bash
git clone https://github.com/VikramSabbani/Shopify-Announcement-App.git
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the application.

```bash
shopify app dev
```

## Features

- Create announcements
- Store announcements in MongoDB
- Update Shopify metafields
- Display announcements using a Theme App Extension (App Embed)
