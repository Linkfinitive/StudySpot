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
    //make sure you check that the searched time output in the console by C# is correct. Weirdness abounds.
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

function handleDateChange() {
    const dateInput = document.getElementById("datePicker").value;
    const timeInput = document.getElementById("timePicker").value;

    //Make sure both the date and time inputs have a value
    if (dateInput && timeInput) {
        // Construct a Date object from the inputs
        const combinedDate = new Date(`${dateInput}T${timeInput}`);

        //Display the new results
        displayLocations(getFreeLocations(combinedDate));
    } else {
        console.warn("Date or time input is missing. Date:", dateInput, "Time:", timeInput);
    }
}

function setDateTimeDefaults() {
    //Get the current date.
    const now = new Date();

    //The date picker must be assigned a string in the format YYYY-MM-DD. A quick hack for making this happen is
    //to ask for the date in the canadian format, which will return YYYY-MM-DD. We can't use .toISOString.Split("T")[0]
    //as you might expect, because that will return the UTC date which could be a day off if it's the morning here.
    document.getElementById("datePicker").value = now.toLocaleDateString('en-CA');

    //The time picker must be assigned a string in the 24h format HH:mm, with leading zeroes. Using the GB locale is
    //the equivalent hack to the above to get the time in the right format.
    document.getElementById("timePicker").value = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });
}


//Program
//Load in CSV files to C#.
await loadCSV();

//Set the date and time pickers to the current time.
setDateTimeDefaults();

//Attach event listeners to date and time pickers.
document.getElementById("datePicker").addEventListener("change", handleDateChange);
document.getElementById("timePicker").addEventListener("change", handleDateChange);

//Force a calculation of the currently free rooms.
handleDateChange();
