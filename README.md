# StudySpot
Welcome to StudySpot. It helps you find available classrooms and lecture theatres at Swinburne University of Technology's Hawthorn Campus.

### Usage
Go to [StudySpot](https://studyspot.linkfinitive.com) and enter the time that you plan to be on campus. A list of rooms that don't have classes scheduled will be displayed. Note that just because there's nothing officially scheduled, that doesn't guarantee that the room will really be empty.

### Problems
Some of the rooms in the system may not be classrooms or may not be accessible to students. If you find such a room, please email [bugs@linkfinitive.com](mailto:bugs@linkfinitive.com) and the filtering will be updated to remove it. Or you can submit a PR :)

### Improvements
If you have an idea for an improvement, email [ideas@linkfinitive.com](mailto:ideas@linkfinitive.com) or submit a PR :) If you're looking for something to do, here's some features that would be awesome:
- Automatically scraping the CSV Files from the Swinburne Timetable Site, instead of having to manually add them every year.
- More precise control over the filtering so users can select their favourite study locations.
- Prioritise locations in the results if they are going to be free for longer periods (so users don't need to move every 2 hours when classes change).
- Automatically account for any time zone differences between Swinburne and the user's current location. 
- Currently large, strange event bookings which span multiple rooms are just discarded. Usually this is fine because people aren't trying to study in places where functions are on, but for completeness...

### Updating for Future Years
Currently, the app needs to be updated every time the timetables change as it does not fetch the data dynamically. While that's still the case, here's the steps involved in making the update:
1. Go to the Swinburne Timetable Site for the current year and go to the "Location" tab.
2. Select Hawthorn Campus, All Weeks, All Week (Mon-Sun), and All Day.
3. Select up to 50 of the locations at a time (it will take around 10 queries to get all of the data).
4. "OL" Locations can be excluded from the selection as they are not physical spaces.
5. "List Timetable" must be selected otherwise there will not be an option to download as CSV.
6. Click "View Timetable".
7. Click "Merge".
8. Once all the entries have been merged, click "Download CSV".
9. Repeat the steps until all data is downloaded.
10. Rename the files, in no particular order: 1, 2, 3, etc.
11. Place the files in ./wwwroot/CsvFiles, and remove the old ones.
12. In ./Backend/TimeManager.cs update the calculation for GetTeachingWeek. The Swinburne Timetable Site shows what date each teaching week starts, which can be used for the calculation.
13. In ./wwwroot/main.js, update the constant numberOfCsvFiles at the top of the file to match the number of files holding the data.
14. Make sure the file format hasn't changed since last year. If it has, additional changes to the code may be required.
15. Once the PR is merged CloudFlare will automatically recompile the C# code and the site will be updated.
