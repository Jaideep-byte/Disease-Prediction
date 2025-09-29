from flask import Flask, request, render_template
import joblib
import numpy as np

app = Flask(__name__)

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

    elif disease == 'cancer':
        # Note: These are example recommendations based on common form inputs
        if user_input.get('Tumour_Stage_III', 0) == 1:
            recommendations.append("A Tumour Stage of III is a significant factor. Please discuss the detailed prognosis with your oncologist.")
        if user_input.get('HER2 status_Positive', 0) == 1:
            recommendations.append("A positive HER2 status may influence treatment options. Ensure this is discussed with your medical team.")

    elif disease == 'lipid' or disease == 'liver':
        # Lipid and Liver checks can often involve cholesterol and albumin
        if user_input.get('chol', 0) > 240 or user_input.get('Total_Bilirubin', 0) > 1.2:
            recommendations.append("Your lab results show some values (like Cholesterol or Bilirubin) are outside the typical range. A follow-up with your doctor is recommended.")
        if user_input.get('Albumin', 0) < 3.4:
            recommendations.append("Your Albumin levels appear low. This can be related to liver or kidney health and should be reviewed by a doctor.")

    return recommendations

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

# --- THIS IS THE FIX: Changed route from '/input_page' to '/input' ---
@app.route('/input_page')
def input_page():
    return render_template('input.html')

@app.route('/predict', methods=['POST'])
def predict():
    disease = request.form['disease']
    
    # Get all form values and convert to float, handling potential errors
    form_values = {}
    for key, value in request.form.items():
        if key != 'disease':
            try:
                form_values[key] = float(value)
            except (ValueError, TypeError):
                form_values[key] = 0.0 # Default to 0 if value is not a number
    
    # Create the feature array from the form values
    input_data = list(form_values.values())
    feature_array = np.array(input_data).reshape(1, -1)

    # Map form values to correct model filenames
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
    
    # Load the specific model required for the prediction (on-demand)
    try:
        model_path = f'{model_name}.pkl'
        model = joblib.load(model_path)
    except FileNotFoundError:
        return f"Error: Model file not found at {model_path}", 400

    # Apply scaler only if it exists for the selected disease
    if disease in scaler_filename_map:
        try:
            scaler_name = scaler_filename_map.get(disease)
            scaler_path = f'{scaler_name}.pkl'
            scaler = joblib.load(scaler_path)
            feature_array = scaler.transform(feature_array)
        except FileNotFoundError:
            pass # Not all models might have a scaler

    # --- Prediction Logic ---
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
    
    # --- GET RECOMMENDATIONS AND PASS TO TEMPLATE ---
    recs = get_recommendations(disease, form_values)
    
    template_name = f'result_{disease}.html'
    return render_template(template_name, result=result, confidence=confidence, recommendations=recs)

if __name__ == '__main__':
    app.run(debug=True)