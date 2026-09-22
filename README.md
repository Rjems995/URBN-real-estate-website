# URBN — Luxury Architectural Real Estate Web Application

A modern, high-end real estate web application curated for contemporary, modernist, and architectural residences for sale. Built with Python (Flask) and a responsive, high-performance frontend styled with Tailwind CSS and vanilla ES6 JavaScript.

---

## ✨ Features

- **Architectural Hero Gallery**:
  - Asymmetric 3-column photo grid matching luxury editorial design.
  - Interactive **Fullscreen Lightbox** with thumbnail strip, caption display, and keyboard navigation (`ESC`, `←`, `→`).
- **Interactive Financing & Mortgage Calculator**:
  - Real-time calculations with sliders for Home Price, Down Payment (%), Interest Rate (%), and Loan Term (15/30 yrs).
  - Dynamic visual breakdown bar (Principal & Interest, Property Taxes, Home Insurance).
- **Listing Portfolio & Exploration Catalog** (`/catalog`):
  - Category filters: _Houses_, _Townhomes_, _Apartments_, _Land_, and _Commercial_.
  - Search by city, country, or keyword, plus budget range filters.
- **Agency & Lead Capture Workflow**:
  - Agent profile badge for **Floors 🛡️ Agency** (Broker Alessandro Moretti).
  - Private Showing and Technical Dossier request modal with immediate feedback.
- **Interactive Technical Dossier**:
  - Multi-category architectural breakdown: General specifications, Interior & Layout, Energy & Systems (EPC A4 NZEB, Geothermal, KNX Smart Home), and Exterior & Amenities.
  - Interactive **Floor Plans** tab switcher (Ground Floor Level 1 & Upper Level 2).
- **Client Features**:
  - **Save Property** to favorites with persistent local storage.
  - **Share Property** modal with one-click copy link and social shortcuts (WhatsApp, Twitter/X, Email).

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+ (Python 3.12 recommended)
- `pip` package manager

### Option 1: Double-Click Launcher (Windows)

Double-click the **`run.bat`** file in the project folder. It will start the Flask server and open your default browser to `http://127.0.0.1:5000` automatically.

### Option 2: Command Line / Terminal

1. **Clone or navigate to the directory**:

   ```bash
   cd "C:\Users\Win 10\Downloads\realestateweb"
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server**:

   ```bash
   python app.py
   ```

4. **Open in browser**:
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📁 Project Structure

```text
realestateweb/
├── app.py                      # Flask server application & REST API routes
├── run.bat                     # 1-click Windows launcher
├── requirements.txt            # Python dependencies (Flask, Pillow, requests)
├── README.md                   # Project documentation
├── data/
│   └── properties.json         # Structured JSON property listings & dossiers
├── static/
│   ├── css/
│   │   └── style.css           # Custom styles, fonts, and lightbox styling
│   ├── js/
│   │   ├── app.js              # Gallery lightbox, modals, favorites, share logic
│   │   └── calculator.js       # Reactive mortgage calculator engine
│   └── images/
│       └── extracted/          # Curated & high-resolution property imagery
└── templates/
    ├── base.html               # Global URBN navigation, auth modal, and footer
    ├── property_detail.html    # Star listing page (high-fidelity design match)
    └── index.html              # Searchable property catalog & filter view
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                                          |
| ------ | ------------------------- | ---------------------------------------------------- |
| `GET`  | `/`                       | Renders the primary featured residence               |
| `GET`  | `/property/<id>`          | Renders a specific property by ID                    |
| `GET`  | `/catalog`                | Search and filter catalog listings                   |
| `POST` | `/api/calculate-mortgage` | Computes monthly P&I, taxes, and insurance breakdown |
| `POST` | `/api/contact`            | Submits private showing / dossier inquiry to agency  |
| `GET`  | `/api/properties`         | Returns all listings as JSON                         |

---

## 🛠️ Adding New Properties

To add or modify listings, edit `data/properties.json`. Each entry supports custom hero images, total photo counts, technical specs, amenities, and floor plans.

---

## 📄 License

This project is licensed under the MIT License.
