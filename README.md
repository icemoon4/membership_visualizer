# Membership Visualizer

## Purpose of the project
Load membership files into a database on a weekly basis, store changes to any existing records in an auditing table. Also includes extra tables/fields not configured in the CSV which will be edited manually. Extra fields will be for us to track committees, regions, branches, and events.

## Completed steps
- Configure local PostgreSQL database in Django
- Setup the initial tables which will be used to hold member data
- Deserialize data from a CSV file and store into the Member table
- Basic routing on frontend which links to individual member records

## Todo
- Configure a historical/audit table for Member data. When new CSV's are loaded, they will create records which don't exist and update records which have changed. The email field will be used as a unique key to search the database.
- Configure the built-in Django User model to allow small group of people to have accounts which can login to the admin and frontend portals
* Create a frontend:
    * Login page (can be dealt with later, Django has a way to configure this)
    * Pages for various reports/tables displaying data:
        * Show membership list with searchable fields and filters (ex: can search email field for test@test.com or filter join date by <1 month ago, sort by last name, etc)
        * Graphs for new joins over time (how many members joined since last month, since last year, etc, with percentage and actual number values) [Need to configure historical model first]
        * More to come, still figuring out what we need lol

## Configuring your local environment
- Install latest python (or >=3.9.7 is fine)
- Install everything from requirements.txt
- Install PostgreSQL
- If you're on Windows, you may need to add `psql` to your Path and restart computer
* Create the local PostgreSQL database:
    * `psql -U postgres`
    * Run these commands:
```
CREATE DATABASE membership_test;
CREATE USER admin WITH PASSWORD 'admin';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE membership_test TO admin;
```
* From the membership_visualizer folder, run `python manage.py migrate`
* If you get a permission denied error, go back to the psql terminal and enter `ALTER DATABASE membership_test OWNER TO admin;`
* `python manage.py createsuperuser` --> enter same credentials as above (user admin, password admin)
* `python manage.py runserver`
* Go to http://127.0.0.1:8000/admin/ and login with the super user credentials
* Go to `Membership files` in the admin page, click "Add membership file" from the top right
* Upload the file `example membership list.csv`, click save
* You should see some logs in your terminal if it's working. Also if it's not working it does that too
* Go to the Member page, confirm that the members from the list were added
