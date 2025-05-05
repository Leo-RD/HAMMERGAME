
---

# 🎯 Hammer Game

**Hammer Game** is a fun, interactive game designed for children around six years old. Inspired by classic funfair attractions, players hit a platform with a small hammer, and their score—based on impact strength—is instantly displayed on a web interface. The game integrates hardware and software using a pressure sensor, a Raspberry Pi, and a web application with real-time scoring and a leaderboard.

---

## 🛠️ Project Overview

* **Platform:** Raspberry Pi
* **Language:** Python
* **Web Framework:** FastAPI or Flask
* **Front-end:** Webpage (HTML/CSS/JavaScript)
* **Sensor:** Pressure sensor to detect hammer hits (RP-240-ST)
* **Database:** Stores player scores and leaderboard
* **Target Audience:** Children (around 6 years old)

---

## 🎮 How It Works

1. **Hit Detection**
   A pressure sensor mounted under the platform captures the force of the hammer strike.

2. **Score Calculation**
   A Python script running on the Raspberry Pi reads the sensor data and calculates a score based on impact strength.

3. **API Communication**
   The Raspberry Pi hosts an API (FastAPI or Flask) to send scores to a web client.

4. **Web Display**
   The client displays the current score and updates a real-time leaderboard showing all-time best scores.

---

## 🧩 System Architecture

```plaintext
[Hammer Hit] --> [Pressure Sensor] --> [Raspberry Pi + Python] --> [API (Flask/FastAPI)] --> [Webpage]
                                                                  \
                                                                   --> [Database for scores]
```

---

## 📦 Technologies Used

* **Python**
* **Raspberry Pi OS**
* **Pressure Sensor (details below)**
* **FastAPI / Flask**
* **SQLite / PostgreSQL (or your DB choice)**
* **HTML/CSS/JavaScript**
* **Vercel**

---

## 🧪 Hardware Requirements

* Raspberry Pi (any model with GPIO)
* Pressure sensor (e.g., HX711 with load cell)
* Small hammer (kid-friendly)
* Display screen (optional, for arcade-like setup)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hammer-game.git
cd hammer-game
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Python Backend

```bash
python sensor_reader.py
```

### 4. Start the API Server

```bash
uvicorn api:app --reload
# or if using Flask:
# python app.py
```

### 5. Launch the Webpage

Open `index.html` in your browser or serve it via a web server for a cleaner setup.

---

## 📊 Leaderboard & Database

* Stores player scores with timestamps and names (optional).
* API endpoints provide data for the leaderboard.
* Sample endpoints:

  * `GET /scores` - List all scores
  * `POST /score` - Submit new score
  * `GET /leaderboard` - Top 10 scores

---

## 🧠 Future Improvements

* Add sound effects and animations
* NFC tag or QR code for player identification
* Multilingual support
* Adaptive difficulty based on age

---

## 📃 License

MIT License. See `LICENSE` file for details.

---

## 👥 Team

Developed by  
[**Léo RD**](https://github.com/Leo-RD)

[**Ali-Kasal**](https://github.com/Ali-Kasal)

 [**Tom Franzi**](https://github.com/tomfranzi)
 
 Contact us for questions or contributions!

---




## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/l%C3%A9opold-roux-decorzent-1a83ba2b3/) Léo-RD


[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tom-franzi/) Ali-Kasal

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ali-kasal-509a09326/) Tom Franzi



