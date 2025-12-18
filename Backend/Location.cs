namespace StudySpot.Backend;

public class Location(string name)
{
    readonly List<Entry> entries = new();
    internal string Name { get; } = name;

    void AddEntry(Entry e)
    {
        entries.Add(e);
    }

    internal bool IsFreeAt(TimeOnly time, DayOfWeek day, int teachingWeek)
    {
        foreach (Entry entry in entries)
        {
            //If the entry matches all of these, then it's happening now and the room isn't free.
            if (
                entry.Day == day &&
                entry.TeachingWeeks.Contains(teachingWeek) &&
                entry.StartTime <= time &&
                entry.EndTime > time)
            {
                return false;
            }
        }

        //If none of the entries match then the room is free at the specified time.
        return true;
    }

    internal TimeOnly GetNextScheduledTime(TimeOnly time, DayOfWeek day, int teachingWeek)
    {
        //If the location isn't currently free, then the next scheduled time is the time we're checking.
        if (!IsFreeAt(time, day, teachingWeek)) return time;

        //Create a list of all this location's entries for the day of the search.
        List<Entry> entriesToday = entries.FindAll(entry =>
            entry.Day == day &&
            entry.TeachingWeeks.Contains(teachingWeek)
        );

        //Sort the entries for today by start time, then return the first one that's after the time of the search.
        entriesToday.Sort((a, b) => a.StartTime.CompareTo(b.StartTime));
        foreach (Entry entry in entriesToday.Where(entry => entry.StartTime > time)) return entry.StartTime;

        //If there are no entries for the day, or all have already passed, then return the last point in the day.
        return new TimeOnly(23, 59);
    }

    internal static Location[] SortEntriesByLocation(Entry[] entries)
    {
        List<Location> locations = new();
        foreach (Entry e in entries)
        {
            Location? locationOfEntry = locations.Find(l => l.Name == e.Location);
            if (locationOfEntry is null)
            {
                locationOfEntry = new Location(e.Location);
                locations.Add(locationOfEntry);
            }

            locationOfEntry.AddEntry(e);
        }

        return locations.ToArray();
    }

    internal static Location[] RemoveNonClassroomLocations(Location[] locations)
    {
        List<Location> filteredLocations = new();
        foreach (Location l in locations)
        {
            //The names of classrooms are rarely more than 7 characters long, for example:
            //EN###, ATC###, or AMDC###. Sometimes there is a small "a" or "b" after the number,
            //but usually these are offices. For safety, I'm checking for 8 or more characters
            //and discarding any locations that have a longer name than that.
            if (l.Name.Length > 8) continue;
            filteredLocations.Add(l);
        }

        return filteredLocations.ToArray();
    }
}
