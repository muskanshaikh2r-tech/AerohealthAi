def calculate_risk(
    age,
    health_condition,
    mode_of_travel,
    aqi,
    pm25,
    temperature,
    humidity
):
    score = 100

    # Health condition
    if health_condition.lower() == "asthma":
        score = score - 20

    elif health_condition.lower() == "normal":
        score = score - 0

    else:
        score = score - 10

    # Mode of travel
    if mode_of_travel.lower() == "two-wheeler":
        score = score - 10

    elif mode_of_travel.lower() == "walking":
        score = score - 5

    # Age
    if age > 60:
        score = score - 10

    elif age < 12:
        score = score - 5

    # AQI
    if aqi > 300:
        score = score - 25

    elif aqi > 200:
        score = score - 20

    elif aqi > 100:
        score = score - 10

    # PM2.5
    if pm25 > 60:
        score = score - 15

    elif pm25 > 35:
        score = score - 10

    # Temperature
    if temperature > 35:
        score = score - 5

    # Humidity
    if humidity > 80:
        score = score - 5

    # Minimum score
    if score < 0:
        score = 0

    # Risk level
    if score >= 80:
        risk_level = "Low"

    elif score >= 50:
        risk_level = "Moderate"

    else:
        risk_level = "High"

    # Recommendation
    if risk_level == "Low":

        recommendation = (
            "Outdoor activity is generally suitable "
            "based on the current prototype score."
        )

    elif risk_level == "Moderate":

        recommendation = (
            "Consider reducing prolonged outdoor exposure."
        )

    else:

        recommendation = (
            "Consider limiting outdoor exposure and "
            "checking current air-quality conditions."
        )

    return score, risk_level, recommendation