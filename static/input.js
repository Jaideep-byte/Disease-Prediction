document.addEventListener("DOMContentLoaded", () => {
    const diseaseSelect = document.getElementById("disease");
    const inputFieldsContainer = document.getElementById("input-fields");

    // This object now has consistent lowercase 'name' attributes for all fields
    const diseaseFields = {
        'cancer': [
            { name: 'age', label: 'Age' },
            { name: 'gender', label: 'Gender (0: Female, 1: Male)'},
            { name: 'protein1', label: 'Protein 1 Value' },
            { name: 'protein2', label: 'Protein 2 Value' },
            { name: 'protein3', label: 'Protein 3 Value' },
            { name: 'protein4', label: 'Protein 4 Value' },
            { name: 'tumour_stage', label: 'Tumour Stage (1, 2, or 3)' },
            { name: 'histology', label: 'Histology (1: IDCarcinoma, 2: ILCarcinoma, 3: MCarcinoma)' },
            { name: 'er_status', label: 'ER Status (1: Positive)' },
            { name: 'pr_status', label: 'PR Status (1: Positive)' },
            { name: 'her2_status', label: 'HER2 Status (1: Positive, 0: Negative)' },
            { name: 'surgery_type', label: 'Surgery Type (1: Lumpectomy, 2: MRM, 3: SM, 4: Other)' }
        ],
        'diabetes': [
            { name: 'pregnancies', label: 'Number of Pregnancies' },
            { name: 'glucose', label: 'Glucose Level' },
            { name: 'blood_pressure', label: 'Blood Pressure (mm Hg)' },
            { name: 'skin_thickness', label: 'Skin Thickness (mm)' },
            { name: 'insulin', label: 'Insulin Level (mu U/ml)' },
            { name: 'bmi', label: 'Body Mass Index' },
            { name: 'diabetes_pedigree_function', label: 'Diabetes Pedigree Function' },
            { name: 'age', label: 'Age (years)' }
        ],
        'heart': [
            { name: 'age', label: 'Age' }, { name: 'sex', label: 'Sex (1=M; 0=F)' },
            { name: 'cp', label: 'Chest Pain Type (0-3)' }, { name: 'trestbps', label: 'Resting Blood Pressure' },
            { name: 'chol', label: 'Cholesterol (mg/dl)' }, { name: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl (1=T; 0=F)' },
            { name: 'restecg', label: 'Resting ECG (0-2)' }, { name: 'thalach', label: 'Max Heart Rate Achieved' },
            { name: 'exang', label: 'Exercise Induced Angina (1=yes; 0=no)' }, { name: 'oldpeak', label: 'ST depression' },
            { name: 'slope', label: 'Slope of peak exercise ST segment' }, { name: 'ca', label: 'Major vessels colored by flourosopy (0-3)' },
            { name: 'thal', label: 'Thalassemia (1=normal; 2=fixed defect; 3=reversable defect)' }
        ],
        'kidney': [
            // Simplified to match the backend recommendation logic
            { name: 'age', label: 'Age' },
            { name: 'blood_pressure', label: 'Blood Pressure' },
            { name: 'specific_gravity', label: 'Specific Gravity' },
            { name: 'albumin', label: 'Albumin' },
            { name: 'sugar', label: 'Sugar' }
        ],
        'liver': [
            { name: 'age', label: 'Age' }, { name: 'gender', label: 'Gender (1=M; 0=F)' },
            { name: 'total_bilirubin', label: 'Total Bilirubin' }, { name: 'direct_bilirubin', label: 'Direct Bilirubin' },
            { name: 'alkaline_phosphotase', label: 'Alkaline Phosphotase' }, { name: 'alamine_aminotransferase', label: 'Alamine Aminotransferase' },
            { name: 'aspartate_aminotransferase', label: 'Aspartate Aminotransferase' }, { name: 'total_protiens', label: 'Total Proteins' },
            { name: 'albumin', label: 'Albumin' }, { name: 'albumin_and_globulin_ratio', label: 'Albumin and Globulin Ratio' }
        ]
    };

    function generateFields(disease) {
        inputFieldsContainer.innerHTML = '';
        const diseaseFields = diseaseFields[disease];
        if (!diseaseFields) return;

        diseaseFields.forEach(field => {
            const div = document.createElement('div');
            div.className = 'input-group';
            
            const label = document.createElement('label');
            label.textContent = field.label; // Use the 'label' property for the text
            
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.name = field.name; // This is now correctly lowercase
            input.placeholder = 'Enter value';
            input.required = true;
            
            div.appendChild(label);
            div.appendChild(input);
            inputFieldsContainer.appendChild(div);
        });
    }

    generateFields(diseaseSelect.value);
    diseaseSelect.addEventListener('change', (event) => generateFields(event.target.value));
});