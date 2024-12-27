document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById("chatBox"); // Define chatBox variable
    const toggleThemeBtn = document.getElementById('toggle-theme-button');

   
    let isDarkTheme = true;

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents default form submission
            handleUserInput();
        }
    });

    sendBtn.addEventListener('click', () => {
        handleUserInput();
    });

    toggleThemeBtn.addEventListener('click', () => {
        const outerinput = document.getElementById('outerinput');
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            // Dark theme
            document.body.classList.remove('bg-white', 'text-black');
            document.body.classList.add('bg-[#1e1f20]', 'text-white');
            userInput.classList.remove('placeholder:text-black');
          
            outerinput.classList.remove('bg-[#a0a0a0]');
            outerinput.classList.add('bg-[#282a2c]');
        } else {
            // Light theme
            document.body.classList.remove('bg-[#1e1f20]', 'text-white');
            document.body.classList.add('bg-white', 'text-black');
            userInput.classList.add('placeholder:text-black');

           
   
            document.querySelector('.flex.justify-center div').classList.add('bg-transparent');
            outerinput.classList.remove('bg-[#282a2c]');
            outerinput.classList.add('bg-[#a0a0a0]');
        }
        
        // Keep input styling consistent
        userInput.classList.remove('text-black', 'text-white');
        userInput.classList.add(isDarkTheme ? 'text-white' : 'text-black');
    });

    function handleUserInput() {
        const inputValue = userInput.value.trim();
        if (!inputValue) {
            alert('Please enter a message.');
            return; // Prevent further execution if input is empty
        }
        const userName = document.getElementById('userName');
        userName.classList.add("hidden");
        userInput.value = "";

      

        addMessageToPage("user", inputValue);
        airesult(inputValue);
    }

    function addMessageToPage(sender, message) {
        console.log(message)

        const chatBox = document.getElementById('chatBox');
        const messageBox = document.createElement('div');
        messageBox.classList.add("flex", "flex-row", "items-start", "gap-4", "chat-message");

        if (sender === "ai") {
            messageBox.classList.add("mb-6");
        }

        const icon = document.createElement('img');
        icon.classList.add("rounded-full", "h-10");
        icon.alt = sender === "user" ? "User icon" : "AI icon";
        icon.src = sender === "user" ? "img/user1.jpg" : "img/gemini.svg";

        const textDiv = document.createElement('div');
        textDiv.classList.add( 'text-[16px]', 'font-sans', 'py-2');
        textDiv.innerHTML = message.replace(/\n/g, '<br>'); // Use innerHTML and replace new lines with <br>

        messageBox.appendChild(icon);
        messageBox.appendChild(textDiv);

        chatBox.appendChild(messageBox);
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }

    async function aiprocess(message) {
        try {
            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch AI response');
            }

            const data = await response.json();

            if (typeof data.response === 'string') {
                let responseText = data.response;
                responseText = responseText.replace(/\*\*/g, ''); // Remove asterisks
                responseText = responseText.replace(/##/g, ''); // Remove hashtags
                return responseText;
            } else {
                console.error('Unexpected data format:', data);
                return 'Unexpected response format from the server.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'An error occurred while processing your request.';
        }
    }

    async function airesult(userInput) {
        try {
            const loadingElement = showLoadingAnimation(); // Show loading animation
            const response = await aiprocess(userInput); // Await the result of aiprocess
            chatBox.removeChild(loadingElement); // Remove loading animation
            addMessageToPage("ai", response);
        } catch (error) {
            console.error("Error found:", error);
        }
    }

    const showLoadingAnimation = () => {
        const chatBox = document.getElementById("chatBox");
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add("flex", "flex-col", "items-start", "gap-2", "loading");
        loadingDiv.innerHTML = `
            <img src="img/gemini.svg" alt="Gemini image" class="rounded-sm h-10">
            <div class="loading-bar">
                <div class="light"></div>
            </div>
            <div class="loading-bar">
                <div class="light"></div>
            </div>
            <div class="loading-bar">
                <div class="light"></div>
            </div>
        `;
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return loadingDiv; // Return loading div for later removal
    };
});
