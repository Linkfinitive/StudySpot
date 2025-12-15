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
    return exports.StudySpot.Backend.DataManager.GetFreeLocations(dateTime.toISOString());
}

//Program
await loadCSV();
let freeLocations = getFreeLocations(new Date());
console.log(freeLocations);
