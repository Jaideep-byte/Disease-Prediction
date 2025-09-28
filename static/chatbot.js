document.addEventListener("DOMContentLoaded", () => {
    const chatbotToggler = document.querySelector("#chatbot-toggler");
    const chatbotContainer = document.querySelector(".chatbot-container");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");

    chatbotToggler.addEventListener("click", () => chatbotContainer.classList.toggle("show-chatbot"));

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<i class="fas fa-robot"></i><p>${message}</p>`;
        chatLi.innerHTML = chatContent;
        return chatLi;
    }

    const generateResponse = (userMessage) => {
        const message = userMessage.toLowerCase();
        let response = "I'm sorry, I don't understand that. You can ask me about ideal glucose, BMI, or blood pressure.";

        if (message.includes("glucose") || message.includes("sugar")) {
            response = "For an adult, a normal fasting blood glucose level is less than 100 mg/dL. A level of 126 mg/dL or higher on two separate tests indicates diabetes.";
        } else if (message.includes("bmi")) {
            response = "Body Mass Index (BMI) ranges are: <br> • Below 18.5: Underweight <br> • 18.5 - 24.9: Healthy Weight <br> • 25.0 - 29.9: Overweight <br> • 30.0 and Above: Obesity";
        } else if (message.includes("blood pressure") || message.includes("bp")) {
            response = "An ideal blood pressure is typically considered to be between 90/60mmHg and 120/80mmHg. High blood pressure (hypertension) is considered to be 140/90mmHg or higher.";
        } else if (message.includes("hello") || message.includes("hi")) {
            response = "Hello! I'm a simple health bot. How can I assist you?";
        }

        const incomingChatLi = createChatLi(response, "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if(!userMessage) return;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatInput.value = "";
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            generateResponse(userMessage);
        }, 600);
    }

    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});