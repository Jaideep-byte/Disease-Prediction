from flask import Flask, request, render_template
import pickle
import numpy as np
import math

app = Flask(__name__)

# --- Load All Models and Scalers ---
# Create a dictionary to hold the models and scalers for easy access
models = {
    'cancer': pickle.load(open('models/breast_cancer_model.pkl', 'rb')),
    'diabetes': pickle.load(open('models/diabetes_model.pkl', 'rb')),
    'heart': pickle.load(open('models/heart_model.pkl', 'rb')),
    'kidney': pickle.load(open('models/kidney_model.pkl', 'rb')),
    'lipid': pickle.load(open('models/lipd_model.pkl', 'rb'))
}

scalers = {
    'heart': pickle.load(open('models/heart_scaler.pkl', 'rb')),
    'kidney': pickle.load(open('models/kidney_scaler.pkl', 'rb')),
    'lipid': pickle.load(open('models/lipd_scaler.pkl', 'rb'))
}

# --- Recommendation Logic ---
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
        if user_input.get('thalach', 0) < 90: # Example value
            recommendations.append("Your maximum heart rate achieved seems low. Discuss appropriate exercise levels with a healthcare provider.")

    elif disease == 'kidney':
        if user_input.get('bp', 0) > 80:
             recommendations.append("Your blood pressure appears elevated. Managing blood pressure is crucial for kidney health.")
        if user_input.get('sg', 0) <= 1.010:
             recommendations.append("Your specific gravity is low, which could indicate hydration issues or other concerns. Consult a doctor.")
        if user_input.get('hemo', 0) < 13.5: # Example for males
             recommendations.append("Your hemoglobin is on the lower side. Discuss potential causes like anemia with your doctor.")

    return recommendations

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/input')
def input_page():
    return render_template('input.html')

@app.route('/predict', methods=['POST'])
def predict():
    disease = request.form['disease']
    
    # Get all form values and convert to float, defaulting to 0 if empty
    form_values = {key: float(value) for key, value in request.form.items() if key != 'disease'}
    
    # Create the feature array in the correct order for the model
    # Note: The order MUST match the training data. This is a critical step.
    # We retrieve the values based on the expected order.
    input_fields = list(form_values.keys())
    input_data = [form_values[field] for field in input_fields]
    
    feature_array = np.array(input_data).reshape(1, -1)
    
    # Apply scaler if it exists for the selected disease
    if disease in scalers:
        feature_array = scalers[disease].transform(feature_array)
        
    # Get the model and make prediction
    model = models[disease]
    prediction = model.predict(feature_array)[0]
    
    # Get prediction probability for confidence score
    try:
        probability = model.predict_proba(feature_array)
        confidence = round(np.max(probability) * 100, 2)
    except AttributeError:
        # Some models (like SVR) don't have predict_proba
        confidence = "N/A" # Or calculate a placeholder
    
    # Determine result string based on prediction (0 or 1)
    # This part needs to be customized based on what 0 and 1 mean for EACH model
    result_map = {
        'cancer': {1: 'Malignant (Cancerous)', 0: 'Benign (Not Cancerous)'},
        'diabetes': {1: 'Diabetic', 0: 'Not Diabetic'},
        'heart': {1: 'High Risk of Heart Disease', 0: 'Low Risk of Heart Disease'},
        'kidney': {1: 'Kidney Disease Detected', 0: 'No Kidney Disease Detected'},
        'lipid': {1: 'Lipid Profile Disorder Detected', 0: 'Normal Lipid Profile'}
    }
    result = result_map[disease].get(prediction, "Unknown result")
    
    # Get personalized recommendations
    recs = get_recommendations(disease, form_values)
    
    # Render the appropriate result page
    template_name = f'result_{disease}.html'
    return render_template(template_name, result=result, confidence=confidence, recommendations=recs)

if __name__ == '__main__':
    app.run(debug=True)