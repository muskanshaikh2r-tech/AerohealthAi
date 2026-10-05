from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from model import HealthProfile
from risk_calculator import calculate_risk

app = FastAPI()

# Allow React frontend to connect with FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AeroHealth AI Backend is Running"}


@app.post("/calculate-risk")
def calculate_health_risk(data: HealthProfile):

    score, risk_level, recommendation = calculate_risk(
        data.age,
        data.health_condition,
        data.mode_of_travel,
        data.aqi,
        data.pm25,
        data.temperature,
        data.humidity
    )

    return {
        "personal_safety_score": score,
        "risk_level": risk_level,
        "recommendation": recommendation
    }