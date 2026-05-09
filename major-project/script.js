const showBtn = document.getElementById("showBtn");
const connectBtn = document.getElementById("connectBtn");
const messageBox = document.getElementById("messages");
const connectionIdeas = document.getElementById("connectionIdeas");

// Keep the connection section hidden when the page first loads
connectionIdeas.classList.add("hidden");
connectionIdeas.classList.remove("show");

showBtn.addEventListener("click", () => {
    fetch("messages.json")
        .then(response => response.json())
        .then(data => {
            messageBox.innerHTML = "";
            showBtn.style.display = "none";

            data.messages.forEach((item, index) => {
                setTimeout(() => {
                    const message = document.createElement("p");
                    message.textContent = item.text;
                    message.classList.add("message");
                    messageBox.appendChild(message);

                    // Show second button after all messages appear
                    if (index === data.messages.length - 1) {
                        connectBtn.classList.remove("hidden");
                    }
                }, index * 700);
            });
        })
        .catch(error => {
            messageBox.innerHTML = "<p>Something went wrong loading the messages.</p>";
            console.log("JSON loading error:", error);
        });
});

connectBtn.addEventListener("click", () => {
    connectionIdeas.classList.remove("hidden");

    setTimeout(() => {
        connectionIdeas.classList.add("show");
    }, 100);

    connectBtn.style.display = "none";
});