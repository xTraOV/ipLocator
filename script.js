let map = L.map("map").setView([51.505, -0.09], 13);
let myIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
            "sk.eyJ1IjoieHRyYW92IiwiYSI6ImNsM2s3N3poNzBjbTczaXF3bWVmbmU3NHIifQ.cDfr_HMubGe5JUFmtK3p4Q",
    }
).addTo(map);

const geoData = {
    ip: null,
    location: null,
    timezone: null,
    isp: null,
};

const selectorIp = document.getElementById("ip");
const selectorLocation = document.getElementById("location");
const selectorTimezone = document.getElementById("timezone");
const selectorIsp = document.getElementById("isp");

const addElement = (text, parent) => {
    const tag = document.createElement("p");
    const textNode = document.createTextNode(text);
    const oldP = parent.querySelector("p");
    tag.appendChild(textNode);
    parent.replaceChild(tag, oldP);
};

const getData = async (ip) => {
    const req = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_LywLut2lj0HAvjSEO5rq4uK4H8diK&ipAddress=${ip}`
    );
    const data = await req.json();
    geoData.location = `${data.location.region}, ${data.location.country}, ${data.as.asn}`;
    geoData.timezone = `${data.location.timezone}`;
    geoData.isp = `${data.isp}`;

    addElement(geoData.ip, selectorIp);
    addElement(geoData.location, selectorLocation);
    addElement("UTC " + geoData.timezone, selectorTimezone);
    addElement(geoData.isp, selectorIsp);

    let latlng = L.latLng(data.location.lat, data.location.lng);
    map.panTo(latlng);
    L.marker(latlng, { icon: myIcon }).addTo(map);
};

const inputField = document.getElementById("input_field");
const form = document.getElementById("input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    geoData.ip = inputField.value.toString();

    getData(inputField.value.toString());
});
