# AIDS/LifeCycle Check-in S.P.A.



#### Summary

ALC needed a system that could track registered participants at events throughout the year, and Orientation Day. The goal of the application is to quickly verify participant information and check-in ALC participants at events either on PC or mobile device. For security reasons, the application should be hosted on Blackbaud servers. Currently the site resides on the tofighthiv.org server. 


#### Installation

1) `git clone <repo URL>`
2) `npm install`
3) Update/overwrite `js/participants.json`
4) Create the file `.config/luminate.config.js` - see below
4) Upload FTP to `​​customerftp.convio.net` (a new directory is OK)
5) Update Wordpress if you would like to create a short URL that points to the app

#### To Do
1) hosted on an external server
2) include an admin panel

## Luminate API Key

```javascript
var luminate_config {
	// Where XXXX is the API Key from the Luminate Online Site Settings
	api_key : "XXXXX",
	interaction_body: "Check-in at NC Holiday Party."
}
```

## Updating the Participant Roster (JSON file)

First, run the _***ALC Event Check-In (Build CSV to JSON)***_ located in the _***Report Writer***_ in Luminate Online.  
> _You may edit the report to change the TeamRaiser event and the name of the report - ***DO NOT*** edit the column names in step 3 of the report builder._

![Run check-in report](https://raw.githubusercontent.com/jeffreylowy/aidslifecycle-checkin/master/readme/001_run_report.png)

In Sumbline Text (v3+), open the .csv downloaded from Luminate Online. 

![Run check-in report](https://raw.githubusercontent.com/jeffreylowy/aidslifecycle-checkin/master/readme/002_open_csv_sublime.png)

Open Sublime's Command Palatte, type _***DataConverter***_ and choose _***to JSON***_. Sublime will convert the .csv to JSON format. Save/overwrite the file to the _***js***_ directory as _***participants.json***_.

![Run check-in report](https://raw.githubusercontent.com/jeffreylowy/aidslifecycle-checkin/master/readme/003_dataconverter.png)

## Blackbaud Server

#### Scripts and Stylesheets
Blackbaud servers will not serve mixed content (files server from http and https). Scripts and style sheets must be loaded in the head of the page as `js/file_name.js` not `/js/file_name.js`. The later will cause the application to break.

```html
<head>
....
  <!-- AngularJS -->
  <script src="node_modules/angular/angular.min.js"></script>
  <script src="node_modules/angular-route/angular-route.min.js"></script>
  <script src="node_modules/angular-cookies/angular-cookies.min.js"></script>
  <script src="node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min.js"></script>
  <!-- ALC Application -->
  <link rel="stylesheet" href="css/custom.css">
...
</head>
```

#### Server Caching
Blackbaud's server allows files to be overwritten, but it may take up to 15 minutes to see the changes for CSS and JS files.

## FAQ

***Why do we use a report and not Blackbaud's Convio API to pull in the participant data?***
The Convio API returns a max of 1000 constituent records in an API. ALC TeamRaisers average 5000+ registered participants. While not impossible for the check-in app to use the Convio API, it would slow down the line and require a constant internet connection, which is not always available at ALC events.

## Tools and Dependencies

#### Sublime 
[Sublime Text 3](https://www.sublimetext.com/3)<br />
[Data Converter package from Sublime Package Manager](https://packagecontrol.io/packages/DataConverter)

#### Node Dependencies
```
"dependencies": {
  "angular": "^1.3.3",
  "angular-cookies": "^1.3.3",
  "angular-route": "^1.3.3",
  "angular-ui-bootstrap": "^0.14.3",
  "bootstrap": "^3.3.6",
  "jquery": "^1.11.3"
}
```
