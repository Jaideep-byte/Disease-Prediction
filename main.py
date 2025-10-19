# main.py

from flask import Flask, request, render_template
import joblib
import numpy as np
import os

# --- This setup is cleaner ---
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__)) # Get base directory
# ------------------------------


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
        # Note: Corrected keys based on your feature_order dict
        if user_input.get('bp', 0) > 80:
             recommendations.append("Your blood pressure appears elevated. Managing blood pressure is crucial for kidney health.")
        if user_input.get('hemo', 0) < 13.5:
             recommendations.append("Your hemoglobin is on the lower side, which can be associated with kidney issues. A medical review is advised.")
        if user_input.get('bgr', 0) > 126:
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
    
    # --- SAFER DATA HANDLING ---
    form_values = {key: float(value) for key, value in request.form.items() if key != 'disease'}

    # Define the exact order of features for each model
    feature_order = {
        'cancer': ['age', 'gender', 'protein1', 'protein2', 'protein3', 'protein4', 'tumour_stage', 'histology_Infiltrating_Ductal_Carcinoma', 'histology_Infiltrating_Lobular_Carcinoma', 'histology_Mucinous_Carcinoma', 'er_status', 'pr_status', 'her2_status', 'surgery_type'],
        'diabetes': ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'diabetes_pedigree_function', 'age'],
        'heart': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'],
        'kidney': ['age', 'bp', 'sg_1.005', 'sg_1.010', 'sg_1.015', 'sg_1.020', 'sg_1.025', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane'],
        'liver': ['age', 'gender', 'total_bilirubin', 'direct_bilirubin', 'alkaline_phosphotase', 'alamine_aminotransferase', 'aspartate_aminotransferase', 'total_protiens', 'albumin', 'albumin_and_globulin_ratio']
    }

    # Create the input array in the correct order
    ordered_features = [form_values[feature] for feature in feature_order[disease]]
    feature_array = np.array([ordered_features]).reshape(1, -1)
    
    # --- ROBUST FILE PATHS ---
    model_path = os.path.join(basedir, 'models', f'{disease}_xgboost_model.pkl')
    scaler_path = os.path.join(basedir, 'models', f'{disease}_scaler.pkl')

    try:
        model = joblib.load(model_path)
    except FileNotFoundError:
        return f"Error: Model file not found at {model_path}", 400

    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)
        feature_array = scaler.transform(feature_array)

    # --- FILLED IN MISSING LOGIC ---
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
