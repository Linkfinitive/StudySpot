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
    //Extract the locations object from the string. The type of parsedLocations is a list of objects containing
    //a Name field and a NextScheduledTimeString field (which are both strings).
    const parsedLocations = JSON.parse(locations);

    //Sort the locations in order of time so they can appear correctly in a list (latest time first).
    parsedLocations.sort((a, b) => {
        return b.NextScheduledTimeString.localeCompare(a.NextScheduledTimeString);
    });

    //Clear any existing content from the locations container already on screen.
    const content = document.getElementById("content");
    content.innerHTML = "";

    //We need to keep track of what time we are up to so that the screen can be sectioned accordingly.
    let earliestTime;

    //Display the locations
    for (const location of parsedLocations) {

        //These variables need to be scoped to this for loop, not the if statement.
        let locationSection;
        let locationContainer;

        if (location.NextScheduledTimeString == earliestTime) {
            //In this case there is already a section for this time, so we can find it in the html.
            locationContainer = document.getElementById(`location-container-${location.NextScheduledTimeString}`);
        } else {
            //In this case we need to create the section, and give it a class name for styling.
            locationSection = document.createElement("div");
            locationSection.className = "location-section";

            //Give the section a title for it's time to be displayed.
            const locationSectionTitle = document.createElement("h3");
            locationSectionTitle.textContent = `Available until ${location.NextScheduledTimeString}`;
            if (location.NextScheduledTimeString == "23:59") {
                locationSectionTitle.textContent = "Available for the rest of the day";
            }
            locationSection.appendChild(locationSectionTitle);
            locationSection.appendChild(document.createElement("hr"));

            //Set the locationContainer (this is so that the locations as a block can be styled separately from the title of the section).
            locationContainer = document.createElement("div");
            locationContainer.id = `location-container-${location.NextScheduledTimeString}`;
            locationContainer.className = "location-container";
            locationSection.appendChild(locationContainer);

            //Add the section to the content.
            content.appendChild(locationSection);

            //Set the earliest time to the time we just worked on ready for the next iteration.
            earliestTime = location.NextScheduledTimeString;
        }

        const locationDiv = document.createElement("div");
        locationDiv.className = "location";
        const locationText = document.createElement("p");
        locationText.textContent = `${location.Name}`;
        locationDiv.appendChild(locationText);
        locationContainer.appendChild(locationDiv);

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
