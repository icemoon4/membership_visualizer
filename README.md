
# Membership Visualizer

## Purpose of the project
Load membership files into a database on a weekly basis, store changes to any existing records in an auditing table. Also includes extra tables/fields not configured in the CSV which will be edited manually. Extra fields will be for us to track committees, regions, branches, and events.

## Completed steps
- Configure local PostgreSQL database in Django
- Setup the initial tables which will be used to hold member data
- Deserialize data from a CSV file and store into the Member table
- Basic routing on frontend which links to individual member records

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
- Then run the following commands (use your own db name/user/password):
```
CREATE DATABASE membership_visualizer;
CREATE USER admin WITH PASSWORD 'admin';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'America/New_York';
GRANT ALL PRIVILEGES ON DATABASE membership_visualizer TO admin;
```
* You'll need to create a [`.pg_service.conf`](https://www.postgresql.org/docs/current/libpq-pgservice.html) and [`.pgpass`](https://www.postgresql.org/docs/current/libpq-pgpass.html) file with connection details to the database
* From the membership_visualizer folder, run `python manage.py migrate`
* If you get a permission denied error, go back to the psql terminal and enter `ALTER DATABASE membership_visualizer OWNER TO admin;`
* `python manage.py createsuperuser` --> enter same credentials as above (user admin, password admin)
* `python manage.py runserver`
* Go to http://127.0.0.1:8000/admin/ and login with the super user credentials
* Go to `Membership files` in the admin page, click "Add membership file" from the top right
* Upload the file `example membership list.csv`, click save
* You should see some logs in your terminal if it's working. 
* Go to the Member page, confirm that the members from the list were added

## Creating backups
I'm laying out these instructions for myself because I'm gonna forget lol
To backup the db:
`pg_dump membership_visualizer -f "C:\your_directory_here\MembershipVisualizer.backup" -F c -U admin`
It should prompt for the password for admin, then create the backup file
To restore the db from the file:
`pg_restore "C:\your_directory_here\MembershipVisualizer.backup" -d membership_visualizer -U admin`
Prompts for password again, then restores

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
* Active (other) MIGS: Members can also be in good standing if they made a one-time payment or pay manually by check, these types are less common
* Member: Can mean a couple things. Depending on context, we may just be referring to a member of any status within the chapter. In terms of data, Member means someone who has not made a dues payment in the last year, but did make a dues payment sometime in the last two years
* Lapsed: Someone who has not made a payment in the last two years
* Expired: Same as lapsed, but National changed the wording from Expired to Lapsed in November 2021
* Constitutional member: Someone who is either a MIGS or a Member
