# main.py

from flask import Flask, request, render_template
import joblib
import numpy as np
import os # <-- ADD THIS LINE

# --- THIS IS THE FIX ---
# Get the absolute path of the directory where this file is located
basedir = os.path.abspath(os.path.dirname(__file__))
# Point to the templates folder
template_folder_path = os.path.join(basedir, 'templates')
# Explicitly tell Flask where to find the templates
app = Flask(__name__, template_folder=template_folder_path)
# ----------------------


# --- Recommendation Logic ---
def get_recommendations(disease, user_input):
    """Generates personalized recommendations based on user input."""
    recommendations = []
    
    if disease == 'diabetes':
        if user_input.get('glucose', 0) > 140:
            recommendations.append("Your Glucose level is high. Consider reducing sugar intake and consult a doctor.")
        if user_input.get('bmi', 0) > 24.9:
            recommendations.append("Your BMI is above the normal range. Regular exercise and a balanced diet are recommended.")
            
    elif disease == 'heart':
        if user_input.get('trestbps', 0) > 140:
            recommendations.append("Your resting blood pressure is high. It's advisable to monitor it regularly and consult a doctor.")
        if user_input.get('chol', 0) > 240:
            recommendations.append("Your cholesterol level is high. A diet low in saturated fats is recommended.")

    elif disease == 'kidney':
        if user_input.get('blood_pressure', 0) > 80:
             recommendations.append("Your blood pressure appears elevated. Managing blood pressure is crucial for kidney health.")
        if user_input.get('specific_gravity', 0) <= 1.010:
             recommendations.append("Your specific gravity is low, which could indicate hydration issues or other concerns. Consult a doctor.")
        if user_input.get('hemoglobin', 0) < 13.5:
             recommendations.append("Your hemoglobin is on the lower side, which can be associated with kidney issues. A medical review is advised.")
        if user_input.get('blood_glucose_random', 0) > 126:
             recommendations.append("Elevated blood glucose can impact kidney function. Please discuss this with your healthcare provider.")

    elif disease == 'cancer':
        if user_input.get('tumour_stage', 0) == 3:
            recommendations.append("A Tumour Stage of III is a significant factor. Please discuss the detailed prognosis with your oncologist.")
        if user_input.get('her2_status', 0) == 1:
            recommendations.append("A positive HER2 status may influence treatment options. Ensure this is discussed with your medical team.")

    elif disease == 'liver':
        if user_input.get('total_bilirubin', 0) > 1.2:
            recommendations.append("Your Bilirubin level is outside the typical range. A follow-up with your doctor is recommended.")
        if user_input.get('albumin', 0) < 3.4:
            recommendations.append("Your Albumin levels appear low. This can be related to liver or kidney health and should be reviewed by a doctor.")

    return recommendations

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/input_page')
def input_page():
    return render_template('input.html')

@app.route('/predict', methods=['POST'])
def predict():
    disease = request.form['disease']
    
    form_values = {}
    for key, value in request.form.items():
        if key != 'disease':
            try:
                form_values[key] = float(value)
            except (ValueError, TypeError):
                form_values[key] = value
    
    input_data = list(form_values.values())
    feature_array = np.array([float(i) for i in input_data]).reshape(1, -1)

    model_filename_map = {
        'cancer': 'brca_xgboost_model',
        'diabetes': 'diabetes_xgboost_model_improved',
        'heart': 'heart_xgboost_model',
        'kidney': 'kidney_disease_xgboost_model',
        'liver': 'liver_xgboost_model_improved'
    }
    scaler_filename_map = {
        'cancer': 'brca_scaler',
        'diabetes': 'diabetes_scaler',
        'heart': 'heart_scaler',
        'kidney': 'kidney_scaler',
        'liver': 'liver_scaler'
    }

    model_name = model_filename_map.get(disease)
    
    try:
        model_path = f'{model_name}.pkl'
        model = joblib.load(model_path)
    except FileNotFoundError:
        return f"Error: Model file not found at {model_path}", 400

    if disease in scaler_filename_map:
        try:
            scaler_name = scaler_filename_map.get(disease)
            scaler_path = f'{scaler_name}.pkl'
            scaler = joblib.load(scaler_path)
            feature_array = scaler.transform(feature_array)
        except FileNotFoundError:
            pass

    prediction = model.predict(feature_array)[0]
    
    try:
        probability = model.predict_proba(feature_array)
        confidence = round(np.max(probability) * 100, 2)
    except (AttributeError, ValueError):
        confidence = "N/A"
    
    result_map = {
        'cancer': {1: 'Malignant (Cancerous)', 0: 'Benign (Not Cancerous)'},
        'diabetes': {1: 'Diabetic', 0: 'Not Diabetic'},
        'heart': {1: 'High Risk of Heart Disease', 0: 'Low Risk of Heart Disease'},
        'kidney': {1: 'Kidney Disease Detected', 0: 'No Kidney Disease Detected'},
        'liver': {1: 'Liver Disease Detected', 0: 'Normal (No Liver Disease)'}
    }
    result = result_map[disease].get(prediction, "Unknown result")
    
    recs = get_recommendations(disease, form_values)
    
    template_name = f'result_{disease}.html'
    
    return render_template(template_name, result=result, confidence=confidence, recommendations=recs, debug_data=form_values)

if __name__ == '__main__':
    app.run(debug=True)