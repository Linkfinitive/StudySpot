//The number of CSV files holding the entire data. Needs to be updated the number of CSV files changes.
const numberOfCsvFiles = 10;

//Import the dotnet bootstrapper from where it is output by the compiler.
import {dotnet} from "./_framework/dotnet.js";

//Initialise dotnet runtime and get the configuration.
const {getAssemblyExports, getConfig} = await dotnet.create();
const config = getConfig();

//Import the [JSExport] functions from C#.
const exports = await getAssemblyExports(config.mainAssemblyName);

async function loadCSV() {

    //Load in each file one at a time.
    for (let i = 1; i <= numberOfCsvFiles; i++) {

        //Fetch the data from the CSV files one at a time
        const response = await fetch(`./CsvFiles/${i}.csv`);
        const csvText = await response.text();

        //Send to dotnet
        exports.StudySpot.Backend.DataManager.Load(csvText);
    }
}

function getFreeLocations(dateTime) {
    //There is some weirdness with JS and C#'s date formats. Date.toISOString() in JS always converts to
    //the UTC time. However, the time given back by C# is correct, which leads me to believe that C# is aware
    //of the user's local timezone somehow, likely from the browser. If you ever work with this date conversion,
    //make sure you check that the searched time output in the console by C# is correct. Weirdness is abound.
    return exports.StudySpot.Backend.DataManager.GetFreeLocations(dateTime.toISOString());
}

function displayLocations(locations) {
    const locationsContainer = document.getElementById("locationsContainer");

    //Clear any existing content
    locationsContainer.innerHTML = "";

    //Display the locations in the array
    for (const location of locations) {
        const locationDiv = document.createElement("div");
        locationDiv.className = "location";
        const locationText = document.createElement("p");
        locationText.textContent = location;
        locationDiv.appendChild(locationText);
        locationsContainer.appendChild(locationDiv);
    }
}

//Program
await loadCSV();
let freeLocations = getFreeLocations(new Date());
console.log(freeLocations);
displayLocations(freeLocations);
