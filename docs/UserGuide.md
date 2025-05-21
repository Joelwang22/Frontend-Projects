---
layout: page
title: User Guide
---
![logo](images/SeeQLancer%20logo.jpg)

SeeQLancer is **the *most* convenient web front end to run SQLancer .** With *unique* functions and tools, SeeQLancer enables budding database testers to run tests on their databases with ease. It eliminates the need to use the Command Line Interface when operating SQLancer, providing a more intuitive and hassle-free experience.
---

## Table of Contents
1. [Quick Start](#quick-start)
2. [SeeQLancer Features](#seeqlancer-features)
    * [Starting a test run](#starting-a-test-run)
    * [Viewing test runs](#viewing-test-runs)
    * [Deleting a test run](#deleting-a-test-run)
    * [Viewing Bugs](#viewing-bugs)
    * [Filtering Bugs](#filtering-bugs)
    * [Managing Labels](#managing-labels)
    * [Adding Databases](#adding-databases)
3. [FAQ](#faq)
4. [Known Issues](#known-issues)
5. [Appendix : Planned Enhancements](#appendix--planned-enhancements)

---

## Quick start

1. Ensure you have Java `17+` or above installed and NodeJS `18`.

2. Download the latest `SeeQLacner` folder from [here](https://github.com/NUS-CS3213-AY2425S2/cs3213-project-group-14/releases).

3. Copy the file to the folder you want to use as the _home folder_ for your SeeQLancer.

4. Setup local PostgreSQL instance and change `server/src/main/application.properties` to match your DB configuration.

5. Build fronend and backend
```bash
mvn clean package -DskipTests
cd server
mvn clean package -DskipTests
cd ../frontend
npm install
```

6. Run backend
```bash
cd server
java -jar target/server-1.0.0.jar
```

7. Run frontend
```bash
cd frontend
npm run dev
```

8. Navigating to the local host URL(E.g. http://localhost:3000) should bring up this webage.
<img src="images/dashboard.png" style="width: 70%"><br>

9. Refer to the [Features](#SeeQLancer-features) below for instructions on the available features.

--------------------------------------------------------------------------------------------------------------------
## SeeQLancer Features

SeeQLancer is designed to streamline database management system testing with various functionalities to create test runs as well as view bugs found during test runs. These features allow you to perform a run tests with custom parameters, re-run a test with the same parameters, view bugs found during tests, view the exact queries that resulted in the bugs.

The following sections will delve into the individual features, providing detailed descriptions and guidance on how to utilize each feature to make the most out of our program's capabilities.

### Legend

These boxes might offer some additional information of different types:

The red arrow appearing in example images for features is not present in the actual web page.

<div style="border-left: 4px solid #17a2b8; padding: 1em; margin: 1em 0;">
<strong>ℹ️ Important:</strong><br>
Highlights important information that you should know.
</div>

<div style="border-left: 4px solid #007bff; padding: 1em; margin: 1em 0;">
<strong>💡 Tip:</strong><br>
Provides you with tips to use our system more effectively.
</div>

<div style="border-left: 4px solid #ffc107;  padding: 1em; margin: 1em 0;">
<strong>⚠️ Caution:</strong><br>
Provides you with warnings about potential issues you might encounter.
</div>

<br>

<strong>ℹ️ Important:</strong>
<ul>
<li>When deleting a test run, it will delete all the bugs found during this test run.</li>
</ul>
<br>
<div>
<strong>💡 Tip:</strong><br>
You can search for relevant info in the user guide by typing <code>Ctrl + F</code> for Windows and Linux computers and <code>⌘ + F</code> for Mac.
</div>

### Starting a Test Run
On the Dashboard page, clicking on the "Create Test" button will bring up a menu that allows you to run a cutomized test run based on your desired parameters.

<img src="images/startTest.png" style="width: 70%"><br>

Below are the fields users can customize for their test runs.

<img src="images/createTestExample.jpg" style="width: 40%"><br>

### Viewing Test Runs
On the Dashboard page, after a test run is started, it is displayed at the bottom of the page.

<img src="images/testRunExample.jpg" style="width: 70%"><br>

On the right of the test run card, users are able to view more in depth details about specific test runs, as well as the option to re-run the same test with the same parameters.

### Deleting a Test Run
On the Dashboard Page, users are able to delete test runs.<br>
Clicking on the "3 Dots" options icon on the right of a test run card will bring up a small menu as shown below.

<img src="images/testMenu.jpg" style="width: 70%"><br>

<strong>⚠️ Caution:</strong><br>
When deleting a test run, it will delete all the bugs found during this test run.

### Viewing Bugs
On the Bug Tracker page, bugs found during a test run will be displayed here. <br>
Alternatively, when clicking on the view bugs option on a test run will also bring users to this page.<br>
For example, in the image below, there is a bug of id #53.

<img src="images/bugTrackerFilled.jpg" style="width: 70%"><br>

Clicking on the bug will bring up this page, displaying the table used by SQLancer to setup the environment where the bug was found.

<img src="images/exampleBug.jpg" style="width: 70%"><br>


### Filtering Bugs
On the Bug Tracker page, users are able to filter bugs based on their assigned labels.<br>
Clicking on the filter icon will bring up this menu.

<img src="images/bugFilter.jpg" style="width: 40%"><br>

### Managing Labels
On the Bug Tracker page, users are able to create custom labels they wish to assign to bugs found. <br>
Clicking on the "Manage Labels" button will bring up a menu that allows users to create custom labels

<img src="images/manageLabelsButton.png" style="width: 70%"><br>

Below is the manage labels menu.

<img src="images/manageLabelsExample.jpg" style="width: 50%"><br>

SeeQLancer comes loaded with existing labels that users are able to use.

<img src="images/manageLabelsExisting.jpg" style="width: 50%"><br>

### Adding Databases
On the DB Configuration page, users are able to add more Databases that they wish to test.

<img src="images/DBConfigPage.png" style="width: 70%"><br>

Clicking on the "ADD DB CONFIG" button will bring up this menu.

<img src="images/DBConfigMenu.png" style="width: 40%"><br>

Users are then able to select which DBMS they wish to add to SeeQLancer to be tested.

<strong>ℹ️ Important:</strong><br>
Take note that users must key in the fields for hostname, port, username, password based on their local system.

<strong>💡 Tip:</strong><br>
By default, SeeQLancer is pre-installed with duckDB.


["Insert more features here"]: #

--------------------------------------------------------------------------------------------------------------------
## FAQ

**Q**: Is there a limit on the number of DBMS that can be added to the DB Configuration page?<br>
**A**: The Current limit of DBMS that can be added is 4.

--------------------------------------------------------------------------------------------------------------------
## Appendix : Planned Enhancements

Team size: 6

1. To separate queries from the setup and then allow to reproduce that same bug exactly.
2. Allow DB Configuration page to cater to more DBMS
3. Enhance create and run test to allow for more specific options 