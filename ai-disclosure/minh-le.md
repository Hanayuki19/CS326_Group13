# AI Disclosure

I used AI to help create a table in the `README.md` file. (Sprint 0)

I did not use AI for anything on this sprint. (Sprint 1)

Sprint 2:
I used AI to create a Python script that scrapes UMass requirements on CS Course Offering, grading expectation, Program info, and prerequisites for some of those class. All of those are in CS_info, which will be taken advantage of next sprint but not for Sprint 2. (Level 3)

I showed it my code and the resulting screen on why the code "res.redirect()" wouldn't work. I got an explanation that because my login and password form are in a fetch(), just res.redirect() wouldn't render anything on my end because fetch() wouldn't allow changes, and also I didn't modify the window.location to that exact location just yet in my javascript.
I looked it up with href property: "https://developer.mozilla.org/en-US/docs/Web/API/Location/href"
Redirection: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections"
window location: "https://www.w3schools.com/js/js_window_location.asp"

I applied things I learned from the w3schools examples into my code in login.js, register.js, and return the redirect website so that the client-side window can redirect to that, instead of the server side request which wouldn't work in fetch().

I also ask about how to use another features in other services within the same directory.
I receive an answer that I can directly import it like any libraries. I created an import on mainService.js that reference to Long's code on the create student function, extract the id from that so I can redirect to that exact id for the login/register form.

I Google about the invalid authentication error code, it suggests me to go to this website to learn more: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401".
I learned that 401 is the code for Unauthorized, so I use that definition into the mainService layer to return 401 if the Username or Password supplies does not exists or not correct.
