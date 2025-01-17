// Setup database with initial test data.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { MONGO_URL } = require("./config");
const User = require("./models/user");
const Tag = require("./models/tags");
const Answer = require("./models/answer");
const Question = require("./models/question");

mongoose.connect(MONGO_URL);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// TODO: Move this function out of init.js
const createAdminUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("1234", salt);
  const adminUser = new User({
    userName: "admin",
    email: "test@test.com",
    password: hashedPassword,
    isAdmin: true,
  });
  return adminUser.save();
};

async function createUser(userName, email, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let userdetails = {
    userName: userName,
    email: email,
    password: hashedPassword,
    isAdmin: false,
  };

  let user = new User(userdetails);
  return user.save();
}

function tagCreate(name) {
  let tag = new Tag({ tagName: name });
  return tag.save();
}

function answerCreate(text, userId, creationDate, likedBy) {
  let answerdetail = { text: text, createdBy: userId };

  if (creationDate != false) answerdetail.creationDate = creationDate;
  if (likedBy != false) answerdetail.likedBy = likedBy;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(
  title,
  text,
  tags,
  answers,
  createdBy,
  creationDate,
  views,
  likedBy
) {
  let qstndetail = {
    title: title,
    text: text,
    createdBy: createdBy,
    tagIds: tags,
  };

  if (answers != false) qstndetail.answerIds = answers;
  if (creationDate != false) qstndetail.creationDate = creationDate;
  if (views != false) qstndetail.views = views;
  if (likedBy != false) qstndetail.likedBy = likedBy;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  //creat Admin
  await createAdminUser();

  //create tags
  let t1 = await tagCreate("react");
  let t2 = await tagCreate("javascript");
  let t3 = await tagCreate("android-studio");
  let t4 = await tagCreate("shared-preferences");
  let t5 = await tagCreate("storage");
  let t6 = await tagCreate("website");

  //create users
  let user1 = await createUser("user1", "user1@example.com", "password123");
  let user2 = await createUser("user2", "user2@example.com", "password456");
  let user3 = await createUser("user3", "user3@example.com", "password789");
  let user4 = await createUser("user4", "user4@example.com", "password2708");

  function getUserId(user) {
    return user._id;
  }

  // Get userId from users
  let userId1 = getUserId(user1);
  let userId2 = getUserId(user2);
  let userId3 = getUserId(user3);
  let userId4 = getUserId(user4);

  //create answers
  let a1 = await answerCreate(
    "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
    userId1,
    new Date("2023-11-20T03:24:42")
  );
  let a2 = await answerCreate(
    "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    userId2,
    new Date("2023-11-23T08:24:00")
  );
  let a3 = await answerCreate(
    "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
    userId3,
    new Date("2023-11-18T09:24:00")
  );
  let a4 = await answerCreate(
    "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
    userId4,
    new Date("2023-11-12T03:30:00")
  );
  let a5 = await answerCreate(
    "I just found all the above examples just too confusing, so I wrote my own. ",
    userId1,
    new Date("2023-11-01T15:24:19")
  );
  let a6 = await answerCreate(
    "Storing content as BLOBs in databases.",
    userId2,
    new Date("2023-02-19T18:20:59")
  );
  let a7 = await answerCreate(
    "Using GridFS to chunk and store content.",
    userId3,
    new Date("2023-02-22T17:19:00")
  );
  let a8 = await answerCreate(
    "Store data in a SQLLite database.",
    userId4,
    new Date("2023-03-22T21:17:53")
  );

  //create questions
  await questionCreate(
    "Programmatically navigate using React router",
    "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
    [t1, t2],
    [a1, a2],
    userId1,
    new Date("2022-01-20T03:00:00"),
    10,
    []
  );
  await questionCreate(
    "android studio save string shared preference, start activity and load the saved string",
    "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
    [t3, t4, t2],
    [a3, a4, a5],
    userId2,
    new Date("2023-01-10T11:24:30"),
    121
  );
  await questionCreate(
    "Object storage for a web application",
    "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
    [t5, t6],
    [a6, a7],
    userId3,
    new Date("2023-02-18T01:02:15"),
    200
  );
  await questionCreate(
    "Quick question about storage on android",
    "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
    [t3, t4, t5],
    [a8],
    userId4,
    new Date("2023-03-10T14:28:01"),
    103
  );

  if (db) db.close();
  console.log("done");
};

populate().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
