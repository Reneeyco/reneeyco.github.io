const btn = document.getElementById("showBtn");
const messageBox = document.getElementById("messages");

btn.addEventListener("click", () => {
    fetch("messages.json")
        .then(response => response.json())
        .then(data => {
            messageBox.innerHTML = "";

            data.messages.forEach(msg => {
                const p = document.createElement("p");
                p.textContent = msg;
                p.classList.add("message");
                messageBox.appendChild(p);
            });
        });
});