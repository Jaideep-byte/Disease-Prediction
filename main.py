from flask import Flask, request, render_template
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# --- Recommendation Logic (No changes here) ---
def get_recommendations(disease, user_input):
    """Generates personalized recommendations based on user input."""
    recommendations = []
    
    if disease == 'diabetes':
        if user_input.get('Glucose', 0) > 140:
            recommendations.append("Your Glucose level is high. Consider reducing sugar intake and consult a doctor.")
        if user_input.get('BMI', 0) > 24.9:
            recommendations.append("Your BMI is above the normal range. Regular exercise and a balanced diet are recommended.")
            
    elif disease == 'heart':
        if user_input.get('trestbps', 0) > 140:
            recommendations.append("Your resting blood pressure is high. It's advisable to monitor it regularly and consult a doctor.")
        if user_input.get('chol', 0) > 240:
            recommendations.append("Your cholesterol level is high. A diet low in saturated fats is recommended.")

    elif disease == 'kidney':
        if user_input.get('bp', 0) > 80:
             recommendations.append("Your blood pressure appears elevated. Managing blood pressure is crucial for kidney health.")
        if user_input.get('sg', 0) <= 1.010:
             recommendations.append("Your specific gravity is low, which could indicate hydration issues or other concerns. Consult a doctor.")

    return recommendations

# --- Load All Models and Scalers ---
models = {
    'cancer': joblib.load('brca_xgboost_model.pkl'),
    'diabetes': joblib.load('diabetes_xgboost_model_improved.pkl'),
    'heart': joblib.load('heart_xgboost_model.pkl'),
    'kidney': joblib.load('kidney_disease_xgboost_model.pkl'),
    'liver': joblib.load('liver_xgboost_model_improved.pkl')
}

scalers = {
    'cancer': joblib.load('brca_scaler.pkl'),
    'diabetes': joblib.load('diabetes_scaler.pkl'),
    'heart': joblib.load('heart_scaler.pkl'),
    'kidney': joblib.load('kidney_scaler.pkl'),
    'liver': joblib.load('liver_scaler.pkl')
}

# --- Define the expected columns for each model ---
# This is crucial for creating the input DataFrame correctly.
# The order is based on the training script.
model_columns = {
    'cancer': ['Age', 'Protein1', 'Protein2', 'Protein3', 'Protein4', 'Gender_FEMALE',
               'Tumour_Stage_II', 'Tumour_Stage_III',
               'Histology_Infiltrating Lobular Carcinoma', 'Histology_Mucinous Carcinoma',
               'ER status_Positive', 'PR status_Positive', 'HER2 status_Positive',
               'Surgery_type_Lumpectomy', 'Surgery_type_Modified Radical Mastectomy',
               'Surgery_type_Simple Mastectomy'],
    'diabetes': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
    'heart': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach',
              'exang', 'oldpeak', 'slope', 'ca', 'thal'],
    'kidney': ['age', 'bp', 'hemo', 'pcv', 'sg_1.01', 'sg_1.015', 'sg_1.02', 'sg_1.025',
               'al_1.0', 'al_2.0', 'al_3.0', 'al_4.0', 'al_5.0', 'su_1.0', 'su_2.0',
               'su_3.0', 'su_4.0', 'su_5.0', 'rbc_normal', 'pc_normal', 'pcc_present',
               'ba_present', 'htn_yes', 'dm_yes', 'cad_yes', 'appet_poor', 'pe_yes', 'ane_yes'],
    'liver': ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase',
              'Alamine_Aminotransferase', 'Aspartate_Aminotransferase',
              'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio']
}


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/input_page')
def input_page():
    return render_template('input.html')

@app.route('/predict', methods=['POST'])
def predict():
    disease = request.form.get('disease')
    
    # Prepare a dictionary with all expected columns, initialized to 0
    input_data = {col: 0 for col in model_columns[disease]}

    # Update the dictionary with values from the form
    for key, value in request.form.items():
        if key in input_data:
            try:
                input_data[key] = float(value)
            except (ValueError, TypeError):
                # Handle cases where a value might not be a number
                input_data[key] = 0

    # Create a DataFrame with the correct column order
    input_df = pd.DataFrame([input_data], columns=model_columns[disease])
    
    # Scale the features
    scaler = scalers[disease]
    scaled_features = scaler.transform(input_df)
    
    # Make prediction
    model = models[disease]
    prediction = model.predict(scaled_features)[0]
    probability = model.predict_proba(scaled_features)
    confidence = round(np.max(probability) * 100, 2)
    
    result_map = {
        'cancer': {1: 'Malignant (Cancerous)', 0: 'Benign (Not Cancerous)'},
        'diabetes': {1: 'Diabetic', 0: 'Not Diabetic'},
        'heart': {1: 'High Risk of Heart Disease', 0: 'Low Risk of Heart Disease'},
        'kidney': {1: 'Kidney Disease Detected', 0: 'No Kidney Disease Detected'},
        'liver': {1: 'Liver Disease Detected', 0: 'Normal (No Liver Disease)'}
    }
    result = result_map[disease].get(prediction, "Unknown result")
    
    return render_template(f'result_{disease}.html', result=result, confidence=confidence)

if __name__ == '__main__':
    app.run(debug=True)