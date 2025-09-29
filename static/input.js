// input.js

document.addEventListener("DOMContentLoaded", () => {
    const diseaseSelect = document.getElementById("disease");
    const inputFieldsContainer = document.getElementById("input-fields");

    const allDiseaseFields = {
        'cancer': [
            // Total 14 Features, names match CSV headers (with spaces handled)
            { name: 'age', label: 'Age' },
            { name: 'gender', label: 'Gender (0: Female, 1: Male)'},
            { name: 'protein1', label: 'Protein 1 Value' },
            { name: 'protein2', label: 'Protein 2 Value' },
            { name: 'protein3', label: 'Protein 3 Value' },
            { name: 'protein4', label: 'Protein 4 Value' },
            { name: 'tumour_stage', label: 'Tumour Stage (1, 2, or 3)' },
            { name: 'histology_Infiltrating_Ductal_Carcinoma', label: 'Histology: Infiltrating Ductal Carcinoma (1=Yes, 0=No)'},
            { name: 'histology_Infiltrating_Lobular_Carcinoma', label: 'Histology: Infiltrating Lobular Carcinoma (1=Yes, 0=No)'},
            { name: 'histology_Mucinous_Carcinoma', label: 'Histology: Mucinous Carcinoma (1=Yes, 0=No)'},
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
            // Total 28 Features, names now match CSV headers exactly
            { name: 'age', label: 'Age (years)' },
            { name: 'bp', label: 'Blood Pressure (bp)' },
            { name: 'sg_1.005', label: 'Specific Gravity is 1.005 (1=Yes, 0=No)' },
            { name: 'sg_1.010', label: 'Specific Gravity is 1.010 (1=Yes, 0=No)' },
            { name: 'sg_1.015', label: 'Specific Gravity is 1.015 (1=Yes, 0=No)' },
            { name: 'sg_1.020', label: 'Specific Gravity is 1.020 (1=Yes, 0=No)' },
            { name: 'sg_1.025', label: 'Specific Gravity is 1.025 (1=Yes, 0=No)' },
            { name: 'al', label: 'Albumin (al)' },
            { name: 'su', label: 'Sugar (su)' },
            { name: 'rbc', label: 'Red Blood Cells (rbc) (0: Abnormal, 1: Normal)' },
            { name: 'pc', label: 'Pus Cell (pc) (0: Abnormal, 1: Normal)' },
            { name: 'pcc', label: 'Pus Cell Clumps (pcc) (0: Not Present, 1: Present)' },
            { name: 'ba', label: 'Bacteria (ba) (0: Not Present, 1: Present)' },
            { name: 'bgr', label: 'Blood Glucose Random (bgr)' },
            { name: 'bu', label: 'Blood Urea (bu)' },
            { name: 'sc', label: 'Serum Creatinine (sc)' },
            { name: 'sod', label: 'Sodium (sod)' },
            { name: 'pot', label: 'Potassium (pot)' },
            { name: 'hemo', label: 'Hemoglobin (hemo)' },
            { name: 'pcv', label: 'Packed Cell Volume (pcv)' },
            { name: 'wc', label: 'White Blood Cell Count (wc)' },
            { name: 'rc', label: 'Red Blood Cell Count (rc)' },
            { name: 'htn', label: 'Hypertension (htn) (0: No, 1: Yes)' },
            { name: 'dm', label: 'Diabetes Mellitus (dm) (0: No, 1: Yes)' },
            { name: 'cad', label: 'Coronary Artery Disease (cad) (0: No, 1: Yes)'},
            { name: 'appet', label: 'Appetite (appet) (0: Poor, 1: Good)'},
            { name: 'pe', label: 'Pedal Edema (pe) (0: No, 1: Yes)'},
            { name: 'ane', label: 'Anemia (ane) (0: No, 1: Yes)'}
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
        const fieldsToCreate = allDiseaseFields[disease];
        if (!fieldsToCreate) return;

        fieldsToCreate.forEach(field => {
            const div = document.createElement('div');
            div.className = 'input-group';
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.label;
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.name = field.name;
            input.id = field.name;
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