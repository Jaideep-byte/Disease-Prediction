from flask import Flask, request, render_template
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

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

# --- Define Feature Order and Categorical Mappings ---
# IMPORTANT: These must match the training script EXACTLY
feature_maps = {
    'cancer': {
        'columns': ['Age', 'Protein1', 'Protein2', 'Protein3', 'Protein4', 'Gender_MALE',
                    'Tumour_Stage_II', 'Tumour_Stage_III', 'Histology_Infiltrating Lobular Carcinoma',
                    'Histology_Mucinous Carcinoma', 'ER status_Positive', 'PR status_Positive',
                    'HER2 status_Positive', 'Surgery_type_Lumpectomy',
                    'Surgery_type_Modified Radical Mastectomy', 'Surgery_type_Simple Mastectomy'],
        'categorical_maps': {
            'Gender': {'FEMALE': [0], 'MALE': [1]},
            'Tumour_Stage': {'I': [0, 0], 'II': [1, 0], 'III': [0, 1]},
            'Histology': {'Infiltrating Ductal Carcinoma': [0, 0], 'Infiltrating Lobular Carcinoma': [1, 0], 'Mucinous Carcinoma': [0, 1]},
            'ER status': {'Positive': [1]},
            'PR status': {'Positive': [1]},
            'HER2 status': {'Negative': [0], 'Positive': [1]},
            'Surgery_type': {'Other': [0, 0, 0], 'Lumpectomy': [1, 0, 0], 'Modified Radical Mastectomy': [0, 1, 0], 'Simple Mastectomy': [0, 0, 1]}
        }
    },
    'diabetes': {
        'columns': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin',
                    'BMI', 'DiabetesPedigreeFunction', 'Age']
    },
    'heart': {
        'columns': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
                    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    },
    'kidney': {
        'columns': ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot',
                    'hemo', 'pcv', 'wc', 'rc', 'rbc_normal', 'pc_normal', 'pcc_present',
                    'ba_present', 'htn_yes', 'dm_yes', 'cad_yes', 'appet_poor',
                    'pe_yes', 'ane_yes']
    },
    'liver': {
        'columns': ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
                    'Alkaline_Phosphotase', 'Alamine_Aminotransferase',
                    'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin',
                    'Albumin_and_Globulin_Ratio']
    }
}


def get_recommendations(disease, user_input):
    """Generates personalized recommendations based on user input."""
    recommendations = []
    if disease == 'diabetes':
        if user_input.get('Glucose', 0) > 125:
            recommendations.append("Your Glucose level is high. Consider reducing sugar intake and consult a doctor.")
        if user_input.get('BMI', 0) > 24.9:
            recommendations.append("Your BMI is above the normal range. Regular exercise and a balanced diet are recommended.")
    elif disease == 'heart':
        if user_input.get('trestbps', 0) > 140:
            recommendations.append("Your resting blood pressure is high. Monitor it regularly.")
        if user_input.get('chol', 0) > 240:
            recommendations.append("Your cholesterol level is high. A diet low in saturated fats is recommended.")
    elif disease == 'kidney':
        if user_input.get('bp', 0) > 80:
             recommendations.append("Your blood pressure appears elevated. Managing blood pressure is crucial for kidney health.")
        if user_input.get('sg', 0) <= 1.010:
             recommendations.append("Your specific gravity is low, which could indicate issues with urine concentration.")
    return recommendations


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/input_page')
def input_page():
    return render_template('input.html')

@app.route('/predict', methods=['POST'])
def predict():
    disease = request.form['disease']
    user_input = {k: float(v) for k, v in request.form.items() if k != 'disease'}

    model = models.get(disease)
    scaler = scalers.get(disease)
    feature_map = feature_maps.get(disease)

    if not model or not scaler or not feature_map:
        return "Error: Invalid disease selection.", 400

    # --- Feature Preparation ---
    if 'categorical_maps' in feature_map: # Handle one-hot encoding for Cancer
        final_features = []
        # Match the order of columns from the training script
        df_template = pd.DataFrame(columns=feature_map['columns'])
        
        # Create a dictionary to hold the one-hot encoded values
        row_data = {col: 0 for col in feature_map['columns']}
        row_data.update({k: v for k, v in user_input.items() if k in row_data})

        # Process categorical features
        # Note: This part assumes the frontend sends numerical mappings for simplicity.
        # A more robust solution would handle string values from the form.
        
        df_input = pd.DataFrame([row_data])
        feature_array = df_input[feature_map['columns']].values.reshape(1, -1)
    else:
        # For other diseases, the order is direct
        ordered_features = [user_input.get(col, 0) for col in feature_map['columns']]
        feature_array = np.array(ordered_features).reshape(1, -1)

    # --- Scaling ---
    scaled_features = scaler.transform(feature_array)
    
    # --- Prediction ---
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
    
    recs = get_recommendations(disease, user_input)
    
    return render_template(f'result_{disease}.html', result=result, confidence=confidence, recommendations=recs)

if __name__ == '__main__':
    app.run(debug=True)