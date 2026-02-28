def get_carbon_metaphor(co2_kg: float) -> str:
    """
    Returns a relatable metaphor for a given amount of carbon emissions (kg CO2).
    """
    if co2_kg <= 0:
        return "Zero impact! Great job!"
        
    # 1 kg CO2 is roughly equivalent to driving a gas car 4 km
    km_driven = round(co2_kg * 4, 1)
    
    # 1 smartphone charge is roughly 0.008 kg CO2
    phone_charges = round(co2_kg / 0.008)
    
    # A mature tree absorbs about 22 kg CO2 per year
    trees = round((co2_kg / 22) * 365, 1)

    if co2_kg < 1:
        return f"That's like charging your phone {phone_charges} times."
    elif co2_kg < 3:
        return f"That's equivalent to driving a car for {km_driven} km."
    else:
        return f"That's like driving {km_driven} km, and a tree would need {trees} days to absorb it."
