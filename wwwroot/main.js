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
    const input = document.getElementById("dateTimePicker").value;

    // Construct a Date object from the input
    const searchDate = new Date(input);

    //Display the new results
    displayLocations(getFreeLocations(searchDate));
}

function setDateTimeDefaults() {
    //Get the current date.
    const now = new Date();

    //The picker can only be set in the form YYYY-MM-DDTHH:mm. To do that, we can split an ISO string in a specific way as is
    //being done below. However, an ISO string converts the time to UTC or whever the time is in London. So, before getting the
    //string, we need to change the time value by whatever the time zone difference is.
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("dateTimePicker").value = now.toISOString().slice(0, 16);
}


//Program
//Load in CSV files to C#.
await loadCSV();

// Set the date and time picker to the current time.
setDateTimeDefaults();

// Attach event listeners to date and time picker.
document.getElementById("dateTimePicker").addEventListener("change", handleDateChange);

//Force a calculation of the currently free rooms.
handleDateChange();
