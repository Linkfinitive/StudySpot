using System.Runtime.InteropServices.JavaScript;

namespace StudySpot.Backend;

public static partial class DataManager
{
    static readonly List<Entry> entries = new();

    [JSExport]
    static void Load(string fileContents)
    {
        //Files begin with 5 lines of heading befor the actual data.
        const int linesOfHeadingInFile = 5;

        //Using statement will automatically close the reader even if there is an exception (creates a try/finally block behind the scenes).
        using StringReader reader = new(fileContents);

        //Skip any header lines in the file.
        for (int i = 0; i < linesOfHeadingInFile; i++) reader.ReadLine();

        //Assigns the read line to the line variable but ends the loop if the line is null.
        while (reader.ReadLine() is { } line)
        {
            entries.Add(new Entry(line));
        }

        Console.WriteLine("Read in Successfully");
    }

    [JSExport]
    static string[] GetFreeLocations(string dateTimeString)
    {
        DateTime dateTime = DateTime.Parse(dateTimeString);

        Location[] unfilteredLocations = Location.SortEntriesByLocation(entries.ToArray());
        Location[] locations = Location.RemoveNonClassroomLocations(unfilteredLocations);

        int teachingWeek = TimeManager.GetTeachingWeek(dateTime);
        DayOfWeek dayOfWeek = dateTime.DayOfWeek;
        TimeOnly time = TimeOnly.FromDateTime(dateTime);

        List<Location> locationsCurrentlyFree = new();
        foreach (Location l in locations)
        {
            if (l.IsFreeAt(time, dayOfWeek, teachingWeek))
            {
                locationsCurrentlyFree.Add(l);
            }
        }

        return Location.LocationListToStringOfLocationNames(locationsCurrentlyFree);
    }
}
