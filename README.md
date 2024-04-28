--if using v1.0.0--
open index.html regularly -- game works on local machine, but uses localStorage, so flashcard sets will expire after a while or if user clears cache/cookies.

--if using latest version--
this version uses node.js and sqlite to handle storage of flashcard sets in a database.

To run the code:
-must have node.js installed
-In the directory where the project is located:
    1. npm init -y
    2. npm install express sqlite3 body-parser
    3. node server.js      //start the server on local machine
    4. in a web browser type 'http://localhost:3000; -- 3000 is default port