
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
    * Login page (can be dealt with later, Django has a way to configure this) (Mostly done, waiting on Django)
    * Pages for various reports/tables displaying data:
        * Show membership list with searchable fields and filters (ex: can search email field for test@test.com or filter join date by <1 month ago, sort by last name, etc) (DONE)
        * Graphs for new joins over time (how many members joined since last month, since last year, etc, with percentage and actual number values) [Need to configure historical model first]
        * More to come, still figuring out what we need lol

## Prepping the back-end
- Install latest Python version from [here](https://www.python.org/downloads/) (anything >=3.9.7 is fine)
- Install everything from requirements.txt by running the following commands (text within brackets is for non-Linux machines):
```
    cd path/into/membership_visualizer 
    [python -m] pip install -r ./requirements.txt
   ```

- Install PostgreSQL from [here](https://www.postgresql.org/download/). Use default settings.
- (For Windows machines) Add `psql` to your Path by following the guide [here](https://www.commandprompt.com/education/how-to-set-windows-path-for-postgres-tools/).
- Create the local PostgreSQL database by running the following command:
`psql -U postgres`
- Then run the following commands:
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
* You should see some logs in your terminal if it's working. 
* Go to the Member page, confirm that the members from the list were added

## Prepping the front-end
- Install Nodejs from [here](https://nodejs.org/en).
- cd into the react-visualizer folder within the membership_visualizer folder and run the following commands:
``` 
cd path/to/membership_visualizer/react-visualizer
npm install
npm run dev
 ```
 - The front-end should now be running at http://localhost:5173/. 

## Defining some DSA terms
### Columns in the membership list:
* List Date: Date that the list was generated from National's database
* xdate: Expiry date of someone's membership
* actionkit_id: ID of the member in National's database (they use ActionKit)

### Membership terms
* MIGS (Member in Good Standing): Someone who has paid dues sometime within the last year
* Active (income-based/monthly/yearly) MIGS: These are the 3 most common ways an active member will choose to make payments
* Active (other) MIGS: Members can also be in good standing if they made a one-time payment or pay manually by check, these types are less common and these people tend not to participate in the chapter, so we care less about tracking them individually
* Member: Can mean a couple things. Depending on context, we may just be referring to a member of any status within the chapter. In terms of data, Member means someone who has not made a dues payment in the last year, but did make a dues payment sometime in the last two years
* Lapsed: Someone who has not made a payment in the last two years
* Expired: Same as lapsed, but National changed the wording from Expired to Lapsed in November 2021
* Constitutional member: Someone who is either a MIGS or a Member
