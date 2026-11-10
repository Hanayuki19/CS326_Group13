# CS326_Group13

# Team

| Name          | Github Username |
| ------------- | --------------- |
| Minh Le       | Hanayuki19      |
| Long Tran Duy | ltranduy-boop   |
| Mahish Mistry | mahishmistry    |
| Chloe Le      | its-cle         |

- **Day-to-day communication:** We have decided to use discord for our quick questions, blockers, and status updates. We will be aiming to try to respond within 24 hours on weekdays. However anything related to specific code (design decisions, review feedback, bug details) goes in the relevant GitHub issue or pull request so it stays with the work instead of scrolling away in chat. However if we need help with some stuff we can always discuss and edit code on discord before pushing to github.

- **Definition of "done" for a PR:** It is done when it has an approving review from at least one teammate and is passing the automated checks, and it should also have a clear description of what and why, and that it has no unresolved review comments. Then the author will merge after approval and deletes the branch.

- **Branching and commits:** For branches, the work happens on a feature branch named `type/short-description` (for example `feat/login-form` or `fix/readme-typo`). Nobody pushes directly to `main` and the branch protection rule makes sure of this before getting approval from the team.

- **Resolving disagreements:** We first discuss about what is the disagreement, make a list of pros and cons of why we should do or not do it and then decide with that.

- **Availability and handoffs:** We have decided not to hold fixed working hours. Everyone's schedule is different, so people work when it suits their situation, as long as they keep the team updated in a timely manner, such as letting us know if they'll be unavailable for a stretch, or if something is blocking them, so work can be reassigned instead of stalling.

## Project Domain

Our project aims to support UMass students in managing their academic life more easily. Things such as planning a semester today means bouncing between SPIRE, which is slow and hard to read, and word of mouth or scattered sites to find out how heavy or difficult a course actually is, because none of that information lives in one place.
We want to build a student centered site to try fix part of this, whether that means a cleaner way to view and plan a semester schedule, or a space where students share course workload information and helpful resources with each other.
This benefits students who don't have easy access to advising or friends who have alredy taken the class, such as first year, transfer, and first generation students. We will narrow this to a specific set of features in the next sprint, but the goal is the same, which is to help reduce the difficulty that students face just trying to figure out their classes.

# Getting Started

## Prerequisites

Ensure you have Node.js installed.

## Installation

Clone the repository

- "git clone https://github.com/Hanayuki19/CS326_Group13.git"
  Install dependencies
- "npm install"
  Configure Environment Variables
- "touch .env"
- Open the .env file and add your session key.
- ` SECRET_SESSION="your-session-key"`

## Running the Server

Inside your Gantry docker development environment, run these in order:

- "dc-up mongo" (start the database)
- "npm start"
  Open your browser and go to "http://localhost:3000"

## Running Jest test

- "npm test" (start the test)
- You should see 3 different tests and 32 test cases with all "passed" status

## System Diagram

```text
+------------------------------------+
|          Browser (Client)          |
| - HTMX handles requests & UI swaps |
| - Tailwind CSS styles interface    |
+------------------------------------+
           |                 ^
      HTTP Request     HTML Fragments &
       (via HTMX)       HX-Redirects
           v                 |
+------------------------------------+
|           Routes Layer             |
|  - Maps URL paths to controllers   |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+         +------------------------------------+
|         Controllers Layer          |         |        EJS and partials            |
|  - Calls services                  | ------->| - Generate pages, links,           |
|  - Renders EJS / partials          | renders |   login/register, and              |
                                               |   other functions for              |
+------------------------------------+         |   web rendering.                   |
           |                 ^                 +------------------------------------+
           |                 |
           v                 |
+------------------------------------+
|                DTOs                |
|  - Convert Mongo records into      |
  JSON-like object for application   |
|  - Map MongoDB _id to id           |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+        +--------------------------------------------+
|           Service Layer            | <----- |         Test Suites (Jest)                 |
| - StudentService (Students & RBAC) | run    | - Tests service rules (with behavior)      |
| - ReviewService (Review logic)     | tests  | - Tests required-field business rules      |
|                                    |        | - Repositories replaced with               |
|                                    |        |    jest.unstable_mockModule                |
|                                    |        |  - Tests never reach MongoDB               |
| - MainService (Auth & Login)       |        +--------------------------------------------+
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+
|     Repository / Storage Layer     |
| - Uses Mongoose models to read and |
|   write directly to MongoDB        |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+
|       MongoDB (main database)      |
| - Stores members, credentials,     |
|   students, and reviews            |
+------------------------------------+
```

## Course Reviews

Go to `/reviews`. The form takes a course code, a workload rating from 1 to 5, and a comment. Submitting sends a POST to `/reviews`; the service validates the fields, the repository saves the review to MongoDB Review Schema, and the new review appears in the list below the form. If a field is missing or the rating is out of range, the server returns a 400 and the message is shown under the form.

## Tailwind restyle (Sprint 3)

**What changed.** The hand-written `public/style.css` is gone. Styling now lives as Tailwind utility classes directly in the markup of every view (`views/*.ejs`, `views/partials/header_auth.ejs`, `public/about.html`), and in the small class strings that `public/app.js` and `public/reviews.js` use for list items they build on the client. `src/input.css` is the Tailwind input file; `npm run build:css` compiles it into `public/style.css`, which the pages already link. `npm start` runs the build automatically first (via the `prestart` script), so a fresh clone needs no extra step. `npm run watch:css` rebuilds on save while developing.

**How to see it.** Run `npm install`, then `npm start`, and open any page. At phone width (375 px) the header stacks the title above the nav links, the add forms stack their inputs vertically, and each list row stacks "View / name / Edit / Delete" top to bottom with full-width buttons. At desktop width (1280 px) the `sm:` breakpoint switches those to one row each (`sm:flex-row`, `sm:items-center`, `sm:justify-between`), and the whole page is centred in a `max-w-3xl` column. The accent colour is UMass maroon, defined once in `src/input.css` under `@theme` as `--color-maroon`.

## Sprint 3 Feature

We added a Student Profile feature which allows students to access, view, and edit their profile details, such as Name and Major.

## HTMX Migration

**What changed:** HTML files now use HTMX attributes for handling form submissions and button clicks. The Express controllers were updated so that the server renders small HTML snippets instead of sending JSON data back to the browser. We created new partials for list rows (`student_row.ejs`, `member_row.ejs`, `review_row.ejs`) so the server can generate a single new row when needed. We also moved the navigation menu and the <head> setup into their own partials so that every page has the same layout.

**How to see it:** Look at the [Getting Started](#Getting-Started) section for instructions on installation and running the application. Once you're on the application, open the browser's Network tab to watch the requests in the background. Fill out any of the forms or click a button and the expected action should occur without reloading the page.

## MongoDB integrated

**What changed:** Our applications uses MongoDB as a database to store the data for all of the requests that are sent or to process with the queries.

**Which routes and methods used it:**
Most routes, including but not limited to:
POST /login
POST /register
GET /members, POST /members, and DELETE /members/:name

GET /reviews and POST /reviews

GET /students
GET /students/student/:id
POST /students/:id
PUT /students/:id
DELETE /students/:id

### Exercising the Feature

Route/Navigation

- Successful login (`POST /login`) or registration (`POST /register`) should direct you to your profile page: `/students/student/:id`
- Navigate to `/students` to view all students or `/students/student/:id` to view a specific one

UI

- Header: Displays student's name and navigation links
- Profile Card: Display's student's name and major
- Editing: Clicking 'Edit' changes text fields into editable inputs

Submitting

- Submitting the edit form creates a `PUT /students/:id` request with an updated Name and Major. The backend will validate the request and update to MongoDB Student Schema. Then, the page will update to show the new information.

## Design Decisions (Sprint 2)

**Central error middleware (Mahish Mistry).** Every async route handler is wrapped in `asyncHandler`, and all failures end in one error handling middleware in `server.js` that returns JSON with a status code; controllers never catch errors themselves. The credible alternative was a try/catch in each controller function. We shipped the middleware version because `app.js` and `reviews.js` read `{ error }` from every failed response, and one middleware is the only way to guarantee that shape for errors nobody anticipated, such as malformed JSON rejected by `express.json()` or a missing data file. Per controller try/catch would have duplicated the same error to JSON code in every controller, and any controller that forgot it would crash the server on a failed `await`.

**Layered architecture design (Minh Le).** I use the layered architecture design taught in class to separate the purposes of responsibility of each layer: what to see, what to handle, and what to return. The purpose of this is to makes the codebase easier to maintain, scale, and trace back errors, which follows the single-responsibility principle. The alternative to this would be to put all of the method like GET, POST, PUT, and everything else within server.js. For a smaller project or a smaller codebase, it would usually be faster to get started. However, when there are more routes and methods, it's hard for developers like us to keep track and applies changes consistently for every routes and trace back errors for debugging. Thus, a layered design allows us to make targeted changes (e.g: updating authentication & information should be separated) and keep track of new issues easily.

**Storing data inside JSON instead of database (MongoDB) (Minh Le).** I and my team use .json files to store and manage data like student information and credentials. Even though storing password in plain text is not great from a security perspective, .JSON allows us to iterate, debug faster because we can easily look into these and find out the errors. One alternative would be to store it inside a database. It would be better if we have more data, but I figure that JSON allows us to iterating faster, make feature works, and migrating will take less time than putting messy work (work in progress) into a real database. We'll migrate to database when we're fully confident that all features are working as intended.

**Login and Registration system (Minh Le)**. I created a login (username & password) with registration system (username, full name, password, and Major). I stored those credentials in a file and call to the existing studentService within Long's code to ensure consistency, specifically getting studentID to redirect to after login or register. One alternative would be to put all attributes within the same credential file from the start. However, that would duplicate the name validation check, and more. So my approach divides those responsbility for each layer & introduce dependency between services for consistent experience.

**Layered architecture design update (Long Tran).** After Minh Le separated our application into four layers, I organized each layer into separate modules for student profiles and team projects. A credible alternative was to keep all features together in one file per layer. That approach would have required fewer files and imports, but as we added features, we would have needed to navigate more unrelated code when making changes or debugging. As a result, I chose separate feature modules supporting instructors’ management of student profiles (One feature, implemented end-to-end) because they made the code easier to locate and maintain. This approach introduces more files and imports, but I considered that an acceptable cost for clearer organization.

**One feature, implemented end-to-end (Long Tran).** I followed the layered approach taught in class and placed student validation and CRUD rules in StudentService.js. A credible alternative was to perform these checks directly in StudentControllers.js, alongside handling requests and responses. Keeping the rules in the service allows different callers, including registration, to reuse student creation without duplicating validation. Putting them in controllers would initially require fewer function calls, but would couple the rules to HTTP handling and require duplicated checks when another workflow creates a student.

**Role-based access permissions (Chloe Le)** I implemented role-based permission checks directly within the service layer (`StudentService.js`). Such checks include restricting student access to their own profiles while granting admins full access to the entire student roster. The alternative option would be to handle the permission checks inline inside each controller function. We shipped the service-layer version because it keeps security logic centralized and independent of Express objects. However, it would have cost code duplication across multiple files and made access boundaries more difficult to maintain as the application grew.

## Design Decisions (Sprint 3)

**Trying all possible combinations on the test with mockUnstable to mock repository functions with controlled test data. (Minh Le)** I followed the sprint instruction and uses mockUnstable to create a repository functions with controlled test data, and I tried all possible combinations of input that I can think of. One credible alternative is using the real MongoDB and just tried some most popular & randoms combinations. One downside of calling right into the MongoDB is that it may alters the results of other person's work or make it less reproducible to catch those errors, and just trying the combinations by whatever comes to my mind risks missing out on details that users may type in. My specific approach will make the controlled testing of business logic & validation more reliable (easily reproducible), and preventing changes to the crucial saved data on MongoDB. For example, my mocked repository functions allow me to verify admin can make almost all changes, student profile and its update function, duplicate names, profile permissions without querying the actual MongoDB, which may includes active credentials and can be affected by such tests, making it easy for me to check every kind of invalid input. One tradeoff is that I must verify my mock test data are representative of what Mongo can do, and it does not verify actual MongoDB queries or whether those change persist.

**Building up MongoDB repository layer (Long Tran)** I followed the sprint 03 instruction to replace every file-based repository by MongoDB repository and updated the dto folder. The benefits for this replacement is that the methods of my repository layer are more diverse (from getAll and save to findById, updateById,...). My decision is to replace some service layers' structures by these methods. However, since some service's files use multiple repository files, I have spent a really long time struggling (traumatizing) to change the structures and debug code. Another alternative that I have come up with is to merge some unecessary repository files into one, such as merging credential schema and student schema into one. However, I did not do this because there are some methods that only use Credential model. This means that if I merge them, I have to change all the structures of layers. Thus, I decided to synchronize some information between student model and credential model. Since I worked with backend clients (Repository, Service layers), I did not interact with HTMX layers. In the repository layer, I added getAll(), delete(), and create() methods for Member MongoDB model and findById(), update(), and create() methods for Credential. i did same one for the Student MongoDB model on the Student repository as well. The schemas of Student and Credential are roughly similar, the former has name and major whereas the later has username, Fullname, password, major, and role. For the member schema, I added name and username fields.

**HTMX row deletion (Chloe Le)**. For the HTMX delete button, I decided to have the server return an empty response and use `hx-target="closest li"` with `hx-swap="outerHTML"` to remove that one specific row. A credible alternative would have been having the database gather all the remaining records and return a fully re-rendered <ul> list partial to swap out the entire container. Reloading the whole list guarantees the screen matches the database, but removing just the single row is better for performance. The alternative would have made the database run an extra search query and would have wasted network data every single time someone clicks delete.
