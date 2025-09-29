document.addEventListener("DOMContentLoaded", () => {
    const diseaseSelect = document.getElementById("disease");
    const inputFieldsContainer = document.getElementById("input-fields");

    const fields = {
        cancer: [
            { name: 'Age', placeholder: 'Age' },
            { name: 'Gender', placeholder: 'Gender (0: Female, 1: Male)'},
            { name: 'Protein1', placeholder: 'Protein 1 Value' },
            { name: 'Protein2', placeholder: 'Protein 2 Value' },
            { name: 'Protein3', placeholder: 'Protein 3 Value' },
            { name: 'Protein4', placeholder: 'Protein 4 Value' },
            { name: 'Tumour_Stage', placeholder: 'Tumour Stage (1, 2, or 3)' },
            { name: 'Histology', placeholder: 'Histology (1: IDCarcinoma, 2: ILCarcinoma, 3: MCarcinoma)' },
            { name: 'ER status', placeholder: 'ER Status (1: Positive)' },
            { name: 'PR status', placeholder: 'PR Status (1: Positive)' },
            { name: 'HER2 status', placeholder: 'HER2 Status (1: Positive, 0: Negative)' },
            { name: 'Surgery_type', placeholder: 'Surgery Type (1: Lumpectomy, 2: MRM, 3: SM, 4: Other)' }
            // Note: Categorical cancer fields are handled in the backend
        ],
        diabetes: [
            { name: 'Pregnancies', placeholder: 'Number of Pregnancies' },
            { name: 'Glucose', placeholder: 'Glucose Level' },
            { name: 'BloodPressure', placeholder: 'Blood Pressure (mm Hg)' },
            { name: 'SkinThickness', placeholder: 'Skin Thickness (mm)' },
            { name: 'Insulin', placeholder: 'Insulin Level (mu U/ml)' },
            { name: 'BMI', placeholder: 'Body Mass Index' },
            { name: 'DiabetesPedigreeFunction', placeholder: 'Diabetes Pedigree Function' },
            { name: 'Age', placeholder: 'Age (years)' }
        ],
        heart: [
            { name: 'age', placeholder: 'Age' }, { name: 'sex', placeholder: 'Sex (1=M; 0=F)' },
            { name: 'cp', placeholder: 'Chest Pain Type (0-3)' }, { name: 'trestbps', placeholder: 'Resting Blood Pressure' },
            { name: 'chol', placeholder: 'Cholesterol (mg/dl)' }, { name: 'fbs', placeholder: 'Fasting Blood Sugar > 120 mg/dl (1=T; 0=F)' },
            { name: 'restecg', placeholder: 'Resting ECG (0-2)' }, { name: 'thalach', placeholder: 'Max Heart Rate Achieved' },
            { name: 'exang', placeholder: 'Exercise Induced Angina (1=yes; 0=no)' }, { name: 'oldpeak', placeholder: 'ST depression' },
            { name: 'slope', placeholder: 'Slope of peak exercise ST segment' }, { name: 'ca', placeholder: 'Major vessels colored by flourosopy (0-3)' },
            { name: 'thal', placeholder: 'Thalassemia (1=normal; 2=fixed defect; 3=reversable defect)' }
        ],
        kidney: [
            { name: 'age', placeholder: 'Age' }, { name: 'bp', placeholder: 'Blood Pressure' },
            { name: 'hemo', placeholder: 'Hemoglobin' }, { name: 'pcv', placeholder: 'Packed Cell Volume' },
            { name: 'sg_1.01', placeholder: 'Specific Gravity 1.01 (0 or 1)' },
            { name: 'sg_1.015', placeholder: 'Specific Gravity 1.015 (0 or 1)' },
            { name: 'sg_1.02', placeholder: 'Specific Gravity 1.02 (0 or 1)' },
            { name: 'sg_1.025', placeholder: 'Specific Gravity 1.025 (0 or 1)' },
            { name: 'al_1.0', placeholder: 'Albumin 1.0 (0 or 1)' },
            { name: 'al_2.0', placeholder: 'Albumin 2.0 (0 or 1)' },
            { name: 'al_3.0', placeholder: 'Albumin 3.0 (0 or 1)' },
            { name: 'al_4.0', placeholder: 'Albumin 4.0 (0 or 1)' },
            { name: 'al_5.0', placeholder: 'Albumin 5.0 (0 or 1)' },
            { name: 'su_1.0', placeholder: 'Sugar 1.0 (0 or 1)' },
            { name: 'su_2.0', placeholder: 'Sugar 2.0 (0 or 1)' },
            { name: 'su_3.0', placeholder: 'Sugar 3.0 (0 or 1)' },
            { name: 'su_4.0', placeholder: 'Sugar 4.0 (0 or 1)' },
            { name: 'su_5.0', placeholder: 'Sugar 5.0 (0 or 1)' },
            { name: 'rbc_normal', placeholder: 'Red Blood Cells Normal (1=Yes)' },
            { name: 'pc_normal', placeholder: 'Pus Cells Normal (1=Yes)' },
            { name: 'pcc_present', placeholder: 'Pus Cell Clumps Present (1=Yes)' },
            { name: 'ba_present', placeholder: 'Bacteria Present (1=Yes)' },
            { name: 'htn_yes', placeholder: 'Hypertension (1=Yes)' },
            { name: 'dm_yes', placeholder: 'Diabetes Mellitus (1=Yes)' },
            { name: 'cad_yes', placeholder: 'Coronary Artery Disease (1=Yes)' },
            { name: 'appet_poor', placeholder: 'Appetite Poor (1=Yes)' },
            { name: 'pe_yes', placeholder: 'Pedal Edema (1=Yes)' },
            { name: 'ane_yes', placeholder: 'Anemia (1=Yes)' }
        ],
        liver: [
            { name: 'Age', placeholder: 'Age' }, { name: 'Gender', placeholder: 'Gender (1=M; 0=F)' },
            { name: 'Total_Bilirubin', placeholder: 'Total Bilirubin' }, { name: 'Direct_Bilirubin', placeholder: 'Direct Bilirubin' },
            { name: 'Alkaline_Phosphotase', placeholder: 'Alkaline Phosphotase' }, { name: 'Alamine_Aminotransferase', placeholder: 'Alamine Aminotransferase' },
            { name: 'Aspartate_Aminotransferase', placeholder: 'Aspartate Aminotransferase' }, { name: 'Total_Protiens', placeholder: 'Total Proteins' },
            { name: 'Albumin', placeholder: 'Albumin' }, { name: 'Albumin_and_Globulin_Ratio', placeholder: 'Albumin and Globulin Ratio' }
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
            label.textContent = field.placeholder;
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.name = field.name;
            input.placeholder = `Enter value`;
            input.required = true;
            div.appendChild(label);
            div.appendChild(input);
            inputFieldsContainer.appendChild(div);
        });
    }

    generateFields(diseaseSelect.value);
    diseaseSelect.addEventListener('change', (event) => generateFields(event.target.value));
});