# azure-pubsub-node-python

## Overview

This project demonstrates real-time invoice transmission using WebSockets through Azure Web PubSub. It consists of a **Node.js server** built with Express.js and a **Python client**, which communicate via WebSockets. The data is stored in an **SQL Server** database, either locally or in the cloud.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Azure Account](https://portal.azure.com/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/) (local instance or cloud-hosted)

## Installation

### Clone the Repository

To get started, clone the repository:

```bash
git clone https://github.com/itsronalds/azure-pubsub-node-python.git
```

## Setting Up the Node.js Server

### Install Dependencies

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file in the `server` directory and define the required variables:

```bash
# File: .env

PORT=8000
MSSQL_CONNECTION_STRING=Server=server_name,port;Database=database_name;User Id=user;Password=password;Encrypt=true
AZURE_WEBPUBSUB_CONNECTION_STRING=
HUB_NAME=
```

> **Note:** Replace `server_name`, `port`, `database_name`, `user`, and `password` with your actual database credentials.

> **Azure Setup:** To obtain `AZURE_WEBPUBSUB_CONNECTION_STRING` and `HUB_NAME`, create an **Azure Web PubSub** resource in your Azure portal and extract the required values.

### Start the Server

Once everything is set up, start the server:

```bash
npm start
```

## Setting Up the Python Client

### Create and Activate a Virtual Environment

Navigate to the `client` directory and set up a virtual environment:

```bash
cd client
python -m venv venv
```

Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Install Dependencies

With the virtual environment activated, install the required dependencies:

```bash
pip install -r requirements.txt
```

### Run the Client

Start the Python client by running:

```bash
python main.py
```

## Expected Outcome 🚀

After completing the above steps, the Node.js server should be running, and the Python client should be able to send real-time invoices via WebSockets using Azure Web PubSub.
