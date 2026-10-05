from pydantic import BaseModel
from typing import Optional

class HealthProfile(BaseModel):
    age: int
    health_condition: str  # e.g. "Asthma", "Normal"
    mode_of_travel: str    # e.g. "Two-wheeler", "Walking", "Car"
    aqi: int
    pm25: Optional[float] = 0.0
    temperature: Optional[float] = 25.0
    humidity: Optional[float] = 50.0