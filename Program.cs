using StudySpot;

List<Entry> entries = new();
for (int i = 1; i <= YearlyUpdateSettings.NumberOfCsvFiles; i++)
{
    string filePath = $"../../../../CsvFiles/{i}.csv";
    Entry[] newEntries = FileLoader.Load(filePath);
    entries.AddRange(newEntries);
}

Location[] unfilteredLocations = Location.SortEntriesByLocation(entries.ToArray());
Location[] locations = Location.RemoveNonClassroomLocations(unfilteredLocations);

DateTime currentDateTime = DateTime.Parse("2026-03-11 10:31am");
Console.WriteLine(currentDateTime);
int currentTeachingWeek = TimeManager.GetTeachingWeek(currentDateTime);
DayOfWeek currentDayOfWeek = currentDateTime.DayOfWeek;
TimeOnly currentTime = TimeOnly.FromDateTime(currentDateTime);

List<Location> locationsCurrentlyFree = new();
foreach (Location l in locations)
{
    if (l.IsFreeAt(currentTime, currentDayOfWeek, currentTeachingWeek))
    {
        locationsCurrentlyFree.Add(l);
        Console.WriteLine($"{l.Name} is free at this time.");
    }
}

Console.WriteLine($"{locationsCurrentlyFree.Count} free locations found of {locations.Length} searched.");
