const sosButton = document.getElementById("sosButton");
const cancelButton = document.getElementById("cancelButton");
const iphoneScreen = document.getElementById("iphoneScreen");
const homeView = document.getElementById("homeView");
const activeView = document.getElementById("activeView");

let isActive = false;

let lat = 51.481285;
let long = -3.180642;

sosButton.addEventListener("click", async () => {
    isActive = true;
    updateUI();

    getLocation();
    getMediaRecorder();

    try {
        await fetch("/sos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: lat,
                long: long
            })
        });
    } catch (error) {
        console.error("Failed to send SOS request:", error);
    }
});

cancelButton.addEventListener("click", () => {
    isActive = false;
    updateUI();
});

function updateUI() {
    if (isActive) {
        iphoneScreen.classList.add("active");
        homeView.classList.add("hidden");
        activeView.classList.remove("hidden");
    } else {
        iphoneScreen.classList.remove("active");
        activeView.classList.add("hidden");
        homeView.classList.remove("hidden");
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
        console.log("Lat: " + position.coords.latitude + " Long: " + position.coords.longitude);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function success(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

function error() {
    console.log("Default lat & long");
}

function getMediaRecorder() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];

                mediaRecorder.addEventListener("dataavailable", (e) => {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);

                        fetch("/audio", {
                            method: "POST",
                            headers: {
                                'Content-Type': mediaRecorder.mimeType,
                            },
                            body: new Blob(chunks, { type: mediaRecorder.mimeType })
                        });
                    }
                });

                mediaRecorder.start();

                const intervalVal = setInterval(() => {
                    if (isActive) {
                        mediaRecorder.requestData();
                    } else {
                        mediaRecorder.stop();
                        clearInterval(intervalVal);
                    }
                }, 5000);
            })
            .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }
}