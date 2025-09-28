document.addEventListener("DOMContentLoaded", () => {
    const diseaseSelect = document.getElementById("disease");
    const inputFieldsContainer = document.getElementById("input-fields");

    const fields = {
        cancer: [
            { name: 'radius_mean', placeholder: 'Radius Mean' },
            { name: 'texture_mean', placeholder: 'Texture Mean' },
            { name: 'perimeter_mean', placeholder: 'Perimeter Mean' },
            { name: 'area_mean', placeholder: 'Area Mean' },
            { name: 'smoothness_mean', placeholder: 'Smoothness Mean' },
            { name: 'compactness_mean', placeholder: 'Compactness Mean' },
            { name: 'concavity_mean', placeholder: 'Concavity Mean' },
            { name: 'concave_points_mean', placeholder: 'Concave Points Mean' },
            { name: 'symmetry_mean', placeholder: 'Symmetry Mean' },
            { name: 'fractal_dimension_mean', placeholder: 'Fractal Dimension Mean' },
            { name: 'radius_se', placeholder: 'Radius SE' },
            { name: 'texture_se', placeholder: 'Texture SE' },
            { name: 'perimeter_se', placeholder: 'Perimeter SE' },
            { name: 'area_se', placeholder: 'Area SE' },
            { name: 'smoothness_se', placeholder: 'Smoothness SE' },
            { name: 'compactness_se', placeholder: 'Compactness SE' },
            { name: 'concavity_se', placeholder: 'Concavity SE' },
            { name: 'concave_points_se', placeholder: 'Concave Points SE' },
            { name: 'symmetry_se', placeholder: 'Symmetry SE' },
            { name: 'fractal_dimension_se', placeholder: 'Fractal Dimension SE' },
            { name: 'radius_worst', placeholder: 'Radius Worst' },
            { name: 'texture_worst', placeholder: 'Texture Worst' },
            { name: 'perimeter_worst', placeholder: 'Perimeter Worst' },
            { name: 'area_worst', placeholder: 'Area Worst' },
            { name: 'smoothness_worst', placeholder: 'Smoothness Worst' },
            { name: 'compactness_worst', placeholder: 'Compactness Worst' },
            { name: 'concavity_worst', placeholder: 'Concavity Worst' },
            { name: 'concave_points_worst', placeholder: 'Concave Points Worst' },
            { name: 'symmetry_worst', placeholder: 'Symmetry Worst' },
            { name: 'fractal_dimension_worst', placeholder: 'Fractal Dimension Worst' }
        ],
        diabetes: [
            { name: 'Pregnancies', placeholder: 'Number of Pregnancies' }, { name: 'Glucose', placeholder: 'Glucose Level' },
            { name: 'BloodPressure', placeholder: 'Diastolic Blood Pressure (mm Hg)' }, { name: 'SkinThickness', placeholder: 'Skin Fold Thickness (mm)' },
            { name: 'Insulin', placeholder: 'Insulin Level (mu U/ml)' }, { name: 'BMI', placeholder: 'Body Mass Index' },
            { name: 'DiabetesPedigreeFunction', placeholder: 'Diabetes Pedigree Function' }, { name: 'Age', placeholder: 'Age (years)' }
        ],
        heart: [
            { name: 'age', placeholder: 'Age' }, { name: 'sex', placeholder: 'Sex (1=M, 0=F)' },
            { name: 'cp', placeholder: 'Chest Pain Type (0-3)' }, { name: 'trestbps', placeholder: 'Resting Blood Pressure' },
            { name: 'chol', placeholder: 'Serum Cholestoral in mg/dl' }, { name: 'fbs', placeholder: 'Fasting Blood Sugar > 120 mg/dl (1=T, 0=F)' },
            { name: 'restecg', placeholder: 'Resting Electrocardiographic Results' }, { name: 'thalach', placeholder: 'Maximum Heart Rate Achieved' },
            { name: 'exang', placeholder: 'Exercise Induced Angina (1=yes, 0=no)' }, { name: 'oldpeak', placeholder: 'ST depression induced by exercise' },
            { name: 'slope', placeholder: 'Slope of the peak exercise ST segment' }, { name: 'ca', placeholder: 'Number of major vessels (0-3)' },
            { name: 'thal', placeholder: 'Thal (3=normal, 6=fixed defect, 7=reversable defect)' }
        ],
        kidney: [
            { name: 'age', placeholder: 'Age' }, { name: 'bp', placeholder: 'Blood Pressure' }, { name: 'sg', placeholder: 'Specific Gravity' },
            { name: 'al', placeholder: 'Albumin' }, { name: 'su', placeholder: 'Sugar' }, { name: 'rbc', placeholder: 'Red Blood Cells (1=norm, 0=abnorm)' },
            { name: 'pc', placeholder: 'Pus Cell (1=norm, 0=abnorm)' }, { name: 'pcc', placeholder: 'Pus Cell Clumps (1=pres, 0=not)' },
            { name: 'ba', placeholder: 'Bacteria (1=pres, 0=not)' }, { name: 'bgr', placeholder: 'Blood Glucose Random' },
            { name: 'bu', placeholder: 'Blood Urea' }, { name: 'sc', placeholder: 'Serum Creatinine' },
            { name: 'sod', placeholder: 'Sodium' }, { name: 'pot', placeholder: 'Potassium' }, { name: 'hemo', placeholder: 'Hemoglobin' },
            { name: 'pcv', placeholder: 'Packed Cell Volume' }, { name: 'wc', placeholder: 'White Blood Cell Count' },
            { name: 'rc', placeholder: 'Red Blood Cell Count' }, { name: 'htn', placeholder: 'Hypertension (1=yes, 0=no)' },
            { name: 'dm', placeholder: 'Diabetes Mellitus (1=yes, 0=no)' }
            // Add other kidney fields as required by the model
        ],
        lipid: [
            { name: 'age', placeholder: 'Age' }, { name: 'gender', placeholder: 'Gender (1=M, 0=F)' },
            { name: 'chest_pain', placeholder: 'Chest Pain Type' }, { name: 'trestbps', placeholder: 'Resting Blood Pressure' },
            { name: 'chol', placeholder: 'Cholesterol' }, { name: 'fbs', placeholder: 'Fasting Blood Sugar > 120 mg/dl' },
            { name: 'restecg', placeholder: 'Resting ECG' }, { name: 'thalach', placeholder: 'Max Heart Rate' },
            { name: 'exang', placeholder: 'Exercise Induced Angina' }, { name: 'oldpeak', placeholder: 'Oldpeak' },
            { name: 'slope', placeholder: 'Slope' }, { name: 'ca', placeholder: 'CA' }, { name: 'thal', placeholder: 'Thal' }
        ]
    };

    function generateFields(disease) {
        inputFieldsContainer.innerHTML = '';
        const diseaseFields = fields[disease];
        if (!diseaseFields) return;

        diseaseFields.forEach(field => {
            const div = document.createElement('div');
            div.className = 'input-group';

            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.placeholder;

            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any'; // Allows decimal points
            input.id = field.name;
            input.name = field.name;
            input.placeholder = `Enter ${field.placeholder}`;
            input.required = true;

            div.appendChild(label);
            div.appendChild(input);
            inputFieldsContainer.appendChild(div);
        });
    }

    // Initial generation for the default selected disease
    generateFields(diseaseSelect.value);

    // Update fields when a new disease is selected
    diseaseSelect.addEventListener('change', (event) => {
        generateFields(event.target.value);
    });
});