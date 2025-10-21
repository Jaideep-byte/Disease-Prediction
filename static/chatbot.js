document.addEventListener("DOMContentLoaded", () => {
    // Corrected the selector to use a class, matching your base.html
    const chatbotToggler = document.querySelector(".chatbot-toggler"); 
    const chatbotContainer = document.querySelector(".chatbot-container");
    const chatInput = document.querySelector(".chat-input textarea");
    // Corrected the selector to match the button's ID in base.html
    const sendChatBtn = document.querySelector("#send-btn"); 
    const chatbox = document.querySelector(".chatbox");

    chatbotToggler.addEventListener("click", () => {
        chatbotContainer.classList.toggle("show-chatbot");
    });

    const knowledgeBase = {
    greetings: {
        keywords: ["hello", "hi", "hey", "yo", "good morning"],
        response: "Hello! I'm a NPC Bot. I can provide general information on some topics. <br><br><b>Important:</b> I am not a medical professional. My information is not a substitute for medical advice. Please consult a doctor for any health concerns."
    },
    help: {
        keywords: ["help", "what can you do", "topics"],
        response: "I can provide general information on:<br>• Common Cold, Flu, Stomach Flu<br>• Allergies, Pink Eye<br>• Heart Disease, Diabetes, Breast Cancer<br>• Liver Disease, Kidney Disease<br>• Blood Pressure, Heart Rate<br>• BMI, Diet, Hydration, Sleep, Stress<br><br>Type 'disclaimer' for my full warning."
    },
    disclaimer: {
        keywords: ["disclaimer", "advice", "medical", "doctor", "safe"],
        response: "<b>MEDICAL DISCLAIMER:</b> I am a bot, not a doctor. The information I provide is for general knowledge only and is NOT a substitute for professional medical advice, diagnosis, or treatment. <b>Always seek the advice of your physician.</b>"
    },
    
    medication_query: {
        keywords: ["medication", "medicine", "pill", "drug", "prescription"],
        response: "<b>Please consult a doctor for a proper cure or prescription.</b> As a bot, I cannot recommend any medication, drugs, or specific medical treatments. A qualified healthcare professional must assess your individual situation."
    },

    // The "_meds" entry MUST come before the "_info" entry.

    // COMMON COLD
    common_cold_meds: {
        keywords: ["cold medicine", "cold cure", "treat cold", "cold prescription"],
        response: "<b>Please consult a doctor for a proper cure or prescription.</b> For a common cold, a doctor or pharmacist might suggest over-the-counter (OTC) options like decongestants, pain relievers (like acetaminophen or ibuprofen), or cough suppressants to manage symptoms."
    },
    common_cold_info: {
        keywords: ["cold", "runny nose", "sore throat", "sneezing"],
        response: "The common cold is a viral infection of the nose and throat.<br><b>Common Symptoms:</b> Runny or stuffy nose, sore throat, cough, sneezing, and sometimes mild body aches or a low-grade fever.<br><b>General Management (Non-Medication):</b> Get plenty of rest, stay hydrated (drink water, warm broth, or juice), and use a humidifier. Gargling with warm salt water can soothe a sore throat."
    },

    // FLU (INFLUENZA)
    flu_meds: {
        keywords: ["flu medicine", "flu cure", "treat flu", "influenza medicine", "flu prescription"],
        response: "<b>You must consult a doctor for flu treatment.</b> If caught early, a doctor may prescribe antiviral drugs (like Tamiflu) to shorten the duration and severity. Otherwise, treatment often involves OTC pain relievers for fever and aches."
    },
    flu_info: {
        keywords: ["flu", "influenza", "body aches", "chills"],
        response: "Influenza (the flu) is a viral infection that is generally more severe than a cold.<br><b>Common Symptoms:</b> Sudden high fever, severe body aches and pains, chills, extreme fatigue/weakness, cough, and headache.<br><b>General Management (Non-Medication):</b> Requires significant rest. Staying very well-hydrated is crucial. A humidifier can help with congestion."
    },

    // HEADACHE
    headache_meds: {
        keywords: ["headache medicine", "headache cure", "treat headache", "migraine medicine"],
        response: "<b>Please consult a doctor if headaches are severe or frequent.</b> For common tension headaches, a doctor might suggest OTC pain relievers like acetaminophen, ibuprofen, or aspirin. Migraines require a specific diagnosis and prescription treatment from a doctor."
    },
    headache_info: {
        keywords: ["headache", "migraine", "head pain"],
        response: "Headaches are a common ailment with many causes, from tension to dehydration to migraines.<br><b>Common Symptoms:</b> Pain in the head, face, or upper neck. It can be a dull ache, sharp, or throbbing.<br><b>General Management (Non-Medication):</b> Rest in a quiet, dark room. Ensure you are well-hydrated. A cool, damp cloth on your forehead can help. Stress-reduction techniques may also be effective."
    },

    // GASTROENTERITIS (STOMACH FLU) - NEW
    gastro_meds: {
        keywords: ["stomach flu medicine", "stomach bug cure", "treat diarrhea", "treat vomiting"],
        response: "<b>Please consult a doctor, especially if symptoms are severe or last more than 24 hours.</b> The main 'treatment' is rehydration. A doctor might recommend an oral rehydration solution (like Pedialyte). They generally advise *against* anti-diarrheal medicine in the early stages, as it's the body's way of clearing the infection."
    },
    gastro_info: {
        keywords: ["stomach flu", "stomach bug", "diarrhea", "vomiting", "nausea"],
        response: "Gastroenteritis (often called 'stomach flu') is an inflammation of the intestines, usually caused by a virus.<br><b>Common Symptoms:</b> Watery diarrhea, nausea, vomiting, stomach cramps, and sometimes fever.<br><b>General Management (Non-Medication):</b> The biggest risk is dehydration. Sip small amounts of clear liquids (water, broth, sports drinks) often. Once you can keep liquids down, gradually reintroduce bland foods (BRAT diet: Bananas, Rice, Applesauce, Toast). Rest is essential."
    },

    // ALLERGIES - NEW
    allergies_meds: {
        keywords: ["allergy medicine", "allergy cure", "antihistamine", "hay fever treatment"],
        response: "<b>Please consult a doctor for a proper diagnosis and treatment plan.</b> For seasonal allergies, doctors often suggest OTC antihistamines (like loratadine, cetirizine) or nasal corticosteroid sprays. For severe allergies, they may recommend prescription options or allergy shots."
    },
    allergies_info: {
        keywords: ["allergies", "hay fever", "seasonal allergies", "itchy eyes", "pollen"],
        response: "Allergies are an immune system response to a foreign substance (allergen) like pollen, dust mites, or pet dander.<br><b>Common Symptoms:</b> Sneezing, itchy/watery eyes, runny or stuffy nose, and an itchy throat.<br><b>General Management (Non-Medication):</b> The best way is to avoid your triggers. Keep windows closed during high pollen season, wash bedding frequently in hot water (for dust mites), and use an air purifier. Rinsing your sinuses with a saline solution (neti pot) can also help."
    },

    // CONJUNCTIVITIS (PINK EYE) - NEW
    pink_eye_meds: {
        keywords: ["pink eye medicine", "pink eye cure", "pink eye treatment", "conjunctivitis medicine"],
        response: "<b>You must consult a doctor to determine the cause.</b><br>• <b>Bacterial:</b> A doctor will prescribe antibiotic eye drops.<br>• <b>Viral:</b> There is no 'cure' other than time; it must run its course, just like a cold.<br>• <b>Allergic:</b> A doctor will recommend allergy eye drops (antihistamines)."
    },
    pink_eye_info: {
        keywords: ["pink eye", "conjunctivitis", "red eye", "itchy eye"],
        response: "Conjunctivitis (pink eye) is an inflammation of the membrane lining the eyelid and eyeball. It can be viral, bacterial, or allergic.<br><b>Common Symptoms:</b> Redness in one or both eyes, itchiness, a gritty feeling, and sometimes discharge that forms a crust during sleep.<br><b>General Management (Non-Medication):</b> Apply a cool, wet compress to reduce inflammation. Do NOT touch your eyes. Wash your hands frequently. If it is bacterial or viral, it is highly contagious: do not share towels or pillows."
    },

    // --- Major Disease Information (from previous step) ---
    // --- Major Disease Information (NEW SPLIT FORMAT) ---
    // NOTE: The "_meds" and "_symptoms" entries MUST come before the "_info" entry.

    // HEART DISEASE
    heart_disease_meds: {
        keywords: ["heart disease medicine", "heart disease cure", "treat heart disease", "angina medicine", "heart attack treatment"],
        response: "<b>You must consult a doctor or emergency services immediately.</b> Treatment for heart disease is complex and depends on the specific condition. It can range from lifestyle changes to prescription medications (like statins, beta-blockers, or blood thinners) and surgical procedures. Only a doctor can determine what is right for you."
    },
    heart_disease_symptoms: {
        keywords: ["heart disease symptoms", "symptoms of heart attack", "angina symptoms", "cardiovascular symptoms"],
        response: "<b>Common Symptoms of Heart Disease can include:</b><br>• Chest pain, tightness, or discomfort (angina)<br>• Shortness of breath<br>• Pain, numbness, or weakness in your arms or legs<br>• Pain in the neck, jaw, throat, or back<br>• Dizziness or fatigue<br><br><b>If you suspect a heart attack (severe chest pain, pain radiating to the arm/jaw, cold sweat), seek emergency medical help immediately.</b>"
    },
    heart_disease_info: {
        keywords: ["heart disease", "cardiovascular", "heart attack", "coronary artery", "angina"],
        response: "Heart disease refers to several conditions that affect the heart, like coronary artery disease (blocked arteries).<br><b>General Management (Non-Medication):</b> Lifestyle is critical. This includes following a heart-healthy diet (low in sodium, saturated fats), getting regular exercise, managing stress, quitting smoking, and limiting alcohol.<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. Always consult a doctor for evaluation."
    },

    // DIABETES
    diabetes_meds: {
        keywords: ["diabetes medicine", "diabetes cure", "treat diabetes", "insulin", "diabetes prescription"],
        response: "<b>Please consult a doctor for a proper cure or prescription.</b> Diabetes is a serious condition that must be managed by a healthcare professional. Treatment is highly individual and may include oral medications (like metformin) or insulin injections, in addition to diet and exercise."
    },
    diabetes_symptoms: {
        keywords: ["diabetes symptoms", "symptoms of high blood sugar"],
        response: "<b>Common Symptoms of Diabetes can include:</b><br>• Increased thirst<br>• Frequent urination<br>• Extreme hunger<br>• Unexplained weight loss<br>• Fatigue and irritability<br>• Blurry vision<br>• Slow-healing sores or frequent infections<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. Please see a doctor if you are experiencing these symptoms."
    },
    diabetes_info: {
        keywords: ["diabetes", "high blood sugar", "type 1", "type 2", "glucose", "fasting glucose"],
        response: "Diabetes is a chronic condition affecting how your body processes blood sugar (glucose).<br><b>General Management (Non-Medication):</b> Healthy eating is key (controlling carbohydrate and sugar intake, high fiber), getting regular physical activity, and weight management. Regular blood sugar monitoring is also essential.<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. This condition *requires* management by a healthcare professional."
    },

    // BREAST CANCER
    breast_cancer_meds: {
        keywords: ["breast cancer medicine", "breast cancer cure", "treat breast cancer", "chemotherapy", "radiation"],
        response: "<b>You must consult a doctor for diagnosis and treatment.</b> Breast cancer treatment is highly specialized and depends on the type and stage. It may involve surgery, chemotherapy, radiation, hormone therapy, or other targeted drugs. Only an oncologist can create a treatment plan."
    },
    breast_cancer_symptoms: {
        keywords: ["breast cancer symptoms", "symptoms of breast lump", "breast cancer signs"],
        response: "<b>Common Symptoms of Breast Cancer can include:</b><br>• A new lump in the breast or underarm (armpit)<br>• Thickening or swelling of part of the breast<br>• Irritation or dimpling of the breast skin<br>• Redness or flaky skin in the nipple area or breast<br>• Nipple discharge (other than breast milk)<br>• Any change in the size or shape of the breast<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. If you find a lump or notice any changes, you <b>must consult a doctor</b> immediately."
    },
    breast_cancer_info: {
        keywords: ["breast cancer", "lump in breast", "mammogram", "breast pain"],
        response: "Breast cancer is a disease where cells in the breast grow out of control. <br><b>General Management (Non-Medication):</b> This is not a condition to self-manage. Early detection is the most important factor: perform regular breast self-exams and follow your doctor's recommendations for mammograms. Lifestyle factors for risk reduction include regular exercise, maintaining a healthy weight, and limiting alcohol."
    },

    // LIVER DISEASE
    liver_disease_meds: {
        keywords: ["liver disease medicine", "liver disease cure", "treat liver disease", "hepatitis cure", "cirrhosis treatment"],
        response: "<b>You must consult a doctor for diagnosis and treatment.</b> Liver disease is very serious. Treatment depends entirely on the cause (e.g., antiviral medication for hepatitis, or lifestyle changes for fatty liver). Never take any medication without a doctor's approval, as many drugs are processed by the liver."
    },
    liver_disease_symptoms: {
        keywords: ["liver disease symptoms", "symptoms of hepatitis", "jaundice symptoms", "cirrhosis symptoms"],
        response: "<b>Common Symptoms of Liver Disease can include:</b><br>• Yellowing of the skin and eyes (jaundice)<br>• Abdominal pain and swelling (especially on the upper right side)<br>• Dark urine color<br>• Pale stool color<br>• Chronic fatigue, nausea, or loss of appetite<br>• Easy bruising<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. Liver conditions are very serious and <b>require immediate medical evaluation.</b>"
    },
    liver_disease_info: {
        keywords: ["liver disease", "cirrhosis", "hepatitis", "jaundice", "liver pain", "fatty liver"],
        response: "Liver disease includes a range of conditions like hepatitis, fatty liver disease, and cirrhosis, all of which damage the liver.<br><b>General Management (Non-Medication):</b> The most important lifestyle change is to <b>stop drinking alcohol</b>. A healthy diet (low fat, low sodium) and maintaining a healthy weight are also critical. Avoid unnecessary medications or toxins.<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis and requires a doctor's care."
    },

    // KIDNEY DISEASE
    kidney_disease_meds: {
        keywords: ["kidney disease medicine", "kidney disease cure", "treat kidney disease", "renal failure treatment", "dialysis"],
        response: "<b>You must be under a doctor's care for kidney disease.</b> There is no 'cure' for chronic kidney disease, but its progression can be slowed. Treatment focuses on managing the underlying causes (like high blood pressure or diabetes) with prescription medication. Advanced-stage failure may require dialysis."
    },
    kidney_disease_symptoms: {
        keywords: ["kidney disease symptoms", "renal failure symptoms", "ckd symptoms"],
        response: "<b>Common Symptoms of Kidney Disease are often absent in early stages.</b> In later stages, they can include:<br>• Fatigue and weakness<br>• Trouble sleeping<br>• Swelling in ankles, feet, or around the eyes<br>• Persistent itching<br>• Nausea and vomiting<br>• Changes in urination (frequency, color, or amount)<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. Kidney conditions are serious and <b>require immediate medical evaluation.</b>"
    },
    kidney_disease_info: {
        keywords: ["kidney disease", "renal failure", "kidney pain", "dialysis", "ckd"],
        response: "Chronic Kidney Disease (CKD) means your kidneys are damaged and can't filter blood properly.<br><b>General Management (Non-Medication):</b> Controlling blood pressure and blood sugar (through diet and exercise) is vital. A doctor-supervised diet, often low in sodium, protein, and potassium, is usually required. Quitting smoking is essential.<br><br><b>MEDICAL DISCLAIMER:</b> This is not a diagnosis. You <b>must be under a doctor's care</b> to manage this condition and slow its progression."
    },
    // --- General Wellness Topics (from previous step) ---
    bmi: {
        keywords: ["bmi", "body mass index", "is my bmi healthy"],
        response: "Body Mass Index (BMI) is a measure of body fat. Ranges are:<br>• Below 18.5: Underweight<br>• 18.5 - 24.9: Healthy<br>• 25.0 - 29.9: Overweight<br>• 30.0+: Obesity"
    },
    blood_pressure: {
        keywords: ["blood pressure", "bp", "hypertension"],
        response: "An ideal blood pressure is typically between 90/60mmHg and 120/80mmHg. High blood pressure is 140/90mmHg or higher. <br><br><b>This is not medical advice.</b> Always discuss your readings with a healthcare professional."
    },
    heart_rate: {
        keywords: ["heart rate", "pulse", "beats per minute"],
        response: "A normal resting heart rate for adults is 60 to 100 beats per minute. <br><br><b>This is not medical advice.</b>"
    },
    hydration: {
        keywords: ["water", "hydrate", "hydration", "drink"],
        response: "A common recommendation is about 8 glasses (2 liters) of water a day, but this varies based on activity, climate, and personal health. Listen to your body!"
    },
    diet: {
        keywords: ["diet", "food", "eat", "nutrition", "healthy eating"],
        response: "A healthy diet often includes plenty of fruits, vegetables, whole grains, and lean proteins, while limiting processed foods, sugar, and saturated fats."
    },
    exercise: {
        keywords: ["exercise", "workout", "fitness", "active"],
        response: "It's generally recommended to get at least 150 minutes of moderate aerobic activity (like walking) or 75 minutes of vigorous activity (like running) each week, plus strength training twice a week."
    },
    sleep: {
        keywords: ["sleep", "how much sleep", "tired", "sleepy"],
        response: "Most adults need 7-9 hours of quality sleep per night. Consistent sleep schedules are very important for overall health."
    },
    stress: {
        keywords: ["stress", "stressed", "anxiety", "anxious", "coping"],
        response: "Common ways to manage stress include exercise, relaxation techniques (like meditation or deep breathing), getting enough sleep, and talking to someone you trust."
    },
    
    // --- Fallback Response ---
    fallback: {
        keywords: [], // This is empty and will be used as the default
        response: "I'm sorry, I don't have information on that specific topic. <br><br><b>For any medical questions, it is always best to consult a real doctor.</b>"
    }
};

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<i class="fas fa-robot"></i><p>${message}</p>`;
        chatLi.innerHTML = chatContent;
        return chatLi;
    }

    const generateResponse = (userMessage) => {
        const message = userMessage.toLowerCase();
        let botResponse = "I'm sorry, I don't have information on that topic. Type 'help' to see what I can answer.";

        for (const key in knowledgeBase) {
            const topic = knowledgeBase[key];
            if (topic.keywords.some(keyword => message.includes(keyword))) {
                botResponse = topic.response;
                break; 
            }
        }

        const incomingChatLi = createChatLi(botResponse, "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatInput.value = "";
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        const thinkingLi = createChatLi("...", "incoming");
        chatbox.appendChild(thinkingLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            thinkingLi.remove();
            generateResponse(userMessage);
        }, 800); 
    }

    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});