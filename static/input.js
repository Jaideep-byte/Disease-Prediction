document.addEventListener("DOMContentLoaded", () => {
    const diseaseSelect = document.getElementById("disease");
    const inputFieldsContainer = document.getElementById("input-fields");

    const fields = {
        cancer: [
            // Features must match the training script for the BRCA model
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
        ],
        diabetes: [
            { name: 'Pregnancies', placeholder: 'Pregnancies' }, { name: 'Glucose', placeholder: 'Glucose' },
            { name: 'BloodPressure', placeholder: 'Blood Pressure' }, { name: 'SkinThickness', placeholder: 'Skin Thickness' },
            { name: 'Insulin', placeholder: 'Insulin' }, { name: 'BMI', placeholder: 'BMI' },
            { name: 'DiabetesPedigreeFunction', placeholder: 'Diabetes Pedigree Function' }, { name: 'Age', placeholder: 'Age' }
        ],
        heart: [
            { name: 'age', placeholder: 'Age' }, { name: 'sex', placeholder: 'Sex (1=Male; 0=Female)' },
            { name: 'cp', placeholder: 'Chest Pain Type' }, { name: 'trestbps', placeholder: 'Resting Blood Pressure' },
            { name: 'chol', placeholder: 'Cholesterol' }, { name: 'fbs', placeholder: 'Fasting Blood Sugar' },
            { name: 'restecg', placeholder: 'Resting ECG' }, { name: 'thalach', placeholder: 'Max Heart Rate' },
            { name: 'exang', placeholder: 'Exercise Induced Angina' }, { name: 'oldpeak', placeholder: 'Oldpeak' },
            { name: 'slope', placeholder: 'Slope' }, { name: 'ca', placeholder: 'CA' }, { name: 'thal', placeholder: 'Thal' }
        ],
        kidney: [
            { name: 'age', placeholder: 'Age' }, { name: 'bp', placeholder: 'Blood Pressure' }, { name: 'sg', placeholder: 'Specific Gravity' },
            { name: 'al', placeholder: 'Albumin' }, { name: 'su', placeholder: 'Sugar' }, { name: 'bgr', placeholder: 'Blood Glucose Random' },
            { name: 'bu', placeholder: 'Blood Urea' }, { name: 'sc', placeholder: 'Serum Creatinine' }, { name: 'sod', placeholder: 'Sodium' },
            { name: 'pot', placeholder: 'Potassium' }, { name: 'hemo', placeholder: 'Hemoglobin' }, { name: 'pcv', placeholder: 'Packed Cell Volume' },
            { name: 'wc', placeholder: 'White Blood Cell Count' }, { name: 'rc', placeholder: 'Red Blood Cell Count' },
            { name: 'rbc_normal', placeholder: 'Red Blood Cells (1: Normal)' }, { name: 'pc_normal', placeholder: 'Pus Cells (1: Normal)' },
            { name: 'pcc_present', placeholder: 'Pus Cell Clumps (1: Present)' }, { name: 'ba_present', placeholder: 'Bacteria (1: Present)' },
            { name: 'htn_yes', placeholder: 'Hypertension (1: Yes)' }, { name: 'dm_yes', placeholder: 'Diabetes Mellitus (1: Yes)' },
            { name: 'cad_yes', placeholder: 'Coronary Artery Disease (1: Yes)' }, { name: 'appet_poor', placeholder: 'Appetite (1: Poor)' },
            { name: 'pe_yes', placeholder: 'Pedal Edema (1: Yes)' }, { name: 'ane_yes', placeholder: 'Anemia (1: Yes)' }
        ],
        liver: [ // CHANGED from 'lipid' to 'liver'
            { name: 'Age', placeholder: 'Age' }, { name: 'Gender', placeholder: 'Gender (1=Male; 0=Female)' },
            { name: 'Total_Bilirubin', placeholder: 'Total Bilirubin' }, { name: 'Direct_Bilirubin', placeholder: 'Direct Bilirubin' },
            { name: 'Alkaline_Phosphotase', placeholder: 'Alkaline Phosphotase' }, { name: 'Alamine_Aminotransferase', placeholder: 'Alamine Aminotransferase' },
            { name: 'Aspartate_Aminotransferase', placeholder: 'Aspartate Aminotransferase' }, { name: 'Total_Protiens', placeholder: 'Total Protiens' },
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
            label.setAttribute('for', field.name);
            label.textContent = field.placeholder;

            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.id = field.name;
            input.name = field.name;
            input.placeholder = `Enter ${field.placeholder}`;
            input.required = true;

            div.appendChild(label);
            div.appendChild(input);
            inputFieldsContainer.appendChild(div);
        });
    }

    generateFields(diseaseSelect.value);

    diseaseSelect.addEventListener('change', (event) => {
        generateFields(event.target.value);
    });
});