import xgboost as xgb
import pandas as pd
import numpy as np
from joblib import load
from sklearn.preprocessing import StandardScaler
from typing import List
import os

HERE = os.path.dirname(os.path.abspath(__file__))

class CaloriePredictor:
    def __init__(self, model_path: str = None):
        self.model = xgb.XGBRegressor()
        self.model.load_model(model_path or os.path.join(HERE, 'calorie_predictor.json'))
        self.scaler = load(os.path.join(HERE, 'std_scaler.bin'))

    def predict(self, input_data: List[float]) -> float:
        # Convert input to numpy array and scale
        feature_names = ['gender', 'age', 'height', 'weight', 'duration', 'heart_rate', 'body_temp']
        input_df = pd.DataFrame([input_data], columns=feature_names)
        scaled_input = self.scaler.transform(input_df)
        
        # Create DMatrix and predict
        prediction = self.model.predict(scaled_input)
        
        return float(prediction)