document.addEventListener("DOMContentLoaded", () => {
    // Corrected the selector to use a class, matching your base.html
    const chatbotToggler = document.querySelector(".chatbot-toggler"); 
    const chatbotContainer = document.querySelector(".chatbot-container");
    const chatInput = document.querySelector(".chat-input textarea");
    // Corrected the selector to match the button's ID in base.html
    const sendChatBtn = document.querySelector("#send-btn"); 
    const chatbox = document.querySelector(".chatbox");

    // --- THIS IS THE FIX ---
    // This event listener was missing. It toggles the chatbot's visibility.
    chatbotToggler.addEventListener("click", () => {
        chatbotContainer.classList.toggle("show-chatbot");
    });
    // ----------------------

    // --- The Chatbot's Expanded Brain ---
    const knowledgeBase = {
        greetings: {
            keywords: ["hello", "hi", "hey", "yo"],
            response: "Hello! I'm a simple health bot. You can ask me about general wellness topics. Type 'help' to see what I know about."
        },
        bmi: {
            keywords: ["bmi", "body mass index"],
            response: "Body Mass Index (BMI) is a measure of body fat based on height and weight. Here are the standard ranges:<br>• Below 18.5: Underweight<br>• 18.5 - 24.9: Healthy Weight<br>• 25.0 - 29.9: Overweight<br>• 30.0 and Above: Obesity"
        },
        glucose: {
            keywords: ["glucose", "sugar", "blood sugar"],
            response: "For an adult, a normal fasting blood glucose level is typically less than 100 mg/dL. A level of 126 mg/dL or higher on two separate tests often indicates diabetes."
        },
        blood_pressure: {
            keywords: ["blood pressure", "bp", "hypertension"],
            response: "An ideal blood pressure is typically considered to be between 90/60mmHg and 120/80mmHg. High blood pressure (hypertension) is considered to be 140/90mmHg or higher."
        },
        heart_rate: {
            keywords: ["heart rate", "pulse"],
            response: "A normal resting heart rate for adults ranges from 60 to 100 beats per minute. Generally, a lower heart rate at rest implies more efficient heart function and better cardiovascular fitness."
        },
        hydration: {
            keywords: ["water", "hydrate", "hydration", "drink"],
            response: "Staying hydrated is crucial for your health. A common recommendation is to drink about 8 glasses (around 2 liters or half a gallon) of water a day. This can vary depending on your activity level and climate."
        },
        diet: {
            keywords: ["diet", "food", "eat", "nutrition"],
            response: "A healthy diet emphasizes:<br>• Eating plenty of fruits, vegetables, whole grains, and lean proteins.<br>• Limiting processed foods, sugary drinks, and saturated fats.<br>• Watching portion sizes. A balanced diet is key to good health."
        },
        exercise: {
            keywords: ["exercise", "workout", "fitness", "active"],
            response: "Regular physical activity is vital. It's generally recommended to get at least:<br>• 150 minutes of moderate aerobic activity (like brisk walking) per week.<br>OR<br>• 75 minutes of vigorous aerobic activity (like running) per week.<br> Strength training for all major muscle groups at least two times a week is also recommended."
        },
        help: {
            keywords: ["help", "what can you do", "topics"],
            response: "I can provide general information on the following topics:<br>• BMI<br>• Glucose<br>• Blood Pressure<br>• Heart Rate<br>• Hydration<br>• Diet<br>• Exercise"
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