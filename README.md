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

- **Branching and commits:** For branchs, the work happens on a feature branch named `type/short-description` (for example `feat/login-form` or `fix/readme-typo`). Nobody pushes directly to `main` and the branch protection rule makes sure of this before getting approval from the team.

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

Start the server

- "npm start"
  Open your browser and go to "http://localhost:3000"

## System Diagram

```text
+------------------------------------+
|          Browser (Client)          |
|     - Submits forms & requests     |
+------------------------------------+
           |                 ^
      HTTP Request     HTTP Response
           v                 |
+------------------------------------+
|           Routes Layer             |
|  - Maps URL paths to controllers   |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+
|         Controllers Layer          |
|  - Handles req/res & session user  |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+
|            Service Layer           |
| - StudentService (Students & RBAC) |
| - ReviewService (Review logic)     |
| - MainService (Auth & Login)       |
+------------------------------------+
           |                 ^
           v                 |
+------------------------------------+
|     Repository / Storage Layer     |
|    - Reads/writes to JSON files    |
+------------------------------------+
```

## Course Reviews

Go to `/reviews`. The form takes a course code, a workload rating from 1 to 5, and a comment. Submitting sends a POST to `/reviews`; the service validates the fields, the repository saves the review to `reviews.json`, and the new review appears in the list below the form. If a field is missing or the rating is out of range, the server returns a 400 and the message is shown under the form.

## Sprint 2 Feature

We added a Student Profile feature which allows students to access, view, and edit their profile details, such as Name and Major.

### Exercising the Feature

Route/Navigation

- Successful login (`POST /login`) or registration (`POST /register`) should direct you to your profile page: `/students/student/:id`
- Navigate to `/students` to view all students or `/students/student/:id` to view a specific one

UI

- Header: Displays student's name and navigation links
- Profile Card: Display's student's name and major
- Editing: Clicking 'Edit' changes text fields into editable inputs

Submitting

- Submitting the edit form creates a `PUT /students/:id` request with an updated Name and Major. The backend will validate the request and update `student.json`. Then, the page will update to show the new information.

## Design Decisions

**Central error middleware (Mahish Mistry).** Every async route handler is wrapped in `asyncHandler`, and all failures end in one error handling middleware in `server.js` that returns JSON with a status code; controllers never catch errors themselves. The credible alternative was a try/catch in each controller function. We shipped the middleware version because `app.js` and `reviews.js` read `{ error }` from every failed response, and one middleware is the only way to guarantee that shape for errors nobody anticipated, such as malformed JSON rejected by `express.json()` or a missing data file. Per controller try/catch would have duplicated the same error to JSON code in every controller, and any controller that forgot it would crash the server on a failed `await`.

**Layered architecture design (Minh Le).** I use the layered architecture design taught in class to separate the purposes of responsibility of each layer: what to see, what to handle, and what to return. The purpose of this is to makes the codebase easier to maintain, scale, and trace back errors, which follows the single-responsibility principle. The alternative to this would be to put all of the method like GET, POST, PUT, and everything else within server.js. For a smaller project or a smaller codebase, it would usually be faster to get started. However, when there are more routes and methods, it's hard for developers like us to keep track and applies changes consistently for every routes and trace back errors for debugging. Thus, a layered design allows us to make targeted changes (e.g: updating authentication & information should be separated) and keep track of new issues easily.

**Storing data inside JSON instead of database (MongoDB) (Minh Le).** I and my team use .json files to store and manage data like student information and credentials. Even though storing password in plain text is not great from a security perspective, .JSON allows us to iterate, debug faster because we can easily look into these and find out the errors. One alternative would be to store it inside a database. It would be better if we have more data, but I figure that JSON allows us to iterating faster, make feature works, and migrating will take less time than putting messy work (work in progress) into a real database. We'll migrate to database when we're fully confident that all features are working as intended.

**Layered architecture design update (Long Tran).** After Minh Le separated our application into four layers, I organized each layer into separate modules for student profiles and team projects. A credible alternative was to keep all features together in one file per layer. That approach would have required fewer files and imports, but as we added features, we would have needed to navigate more unrelated code when making changes or debugging. As a result, I chose separate feature modules supporting instructors’ management of student profiles (One feature, implemented end-to-end) because they made the code easier to locate and maintain. This approach introduces more files and imports, but I considered that an acceptable cost for clearer organization.

**One feature, implemented end-to-end (Long Tran).** I followed the layered approach taught in class and placed student validation and CRUD rules in StudentService.js. A credible alternative was to perform these checks directly in StudentControllers.js, alongside handling requests and responses. Keeping the rules in the service allows different callers, including registration, to reuse student creation without duplicating validation. Putting them in controllers would initially require fewer function calls, but would couple the rules to HTTP handling and require duplicated checks when another workflow creates a student.

**Role-based access permissions (Chloe Le)** I implemented role-based permission checks directly within the service layer (`StudentService.js`). Such checks include restricting student access to their own profiles while granting admins full access to the entire student roster. The alternative option would be to handle the permission checks inline inside each controller function. We shipped the service-layer version because it keeps security logic centralized and independent of Express objects. However, it would have cost code duplication across multiple files and made access boundaries more difficult to maintain as the application grew.
