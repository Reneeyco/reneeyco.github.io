const showBtn = document.getElementById("showBtn");
const connectBtn = document.getElementById("connectBtn");
const messageBox = document.getElementById("messages");
const connectionIdeas = document.getElementById("connectionIdeas");

showBtn.addEventListener("click", () => {
    fetch("messages.json")
        .then(response => response.json())
        .then(data => {
            messageBox.innerHTML = "";
            showBtn.style.display = "none";

            data.messages.forEach((msg, index) => {
                setTimeout(() => {
                    const p = document.createElement("p");
                    p.textContent = msg;
                    p.classList.add("message");
                    messageBox.appendChild(p);

                    if (index === data.messages.length - 1) {
                        connectBtn.classList.remove("hidden");
                    }
                }, index * 800);
            });
        })
        .catch(error => {
            messageBox.innerHTML = "Something went wrong loading the messages.";
            console.log(error);
        });
});

connectBtn.addEventListener("click", () => {
    connectionIdeas.classList.remove("hidden");

    setTimeout(() => {
        connectionIdeas.classList.add("show");
    }, 100);

    connectBtn.style.display = "none";
});