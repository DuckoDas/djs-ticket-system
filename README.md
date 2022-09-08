# Recode by Ducko - Changed everything more clean and other stuff addded

# djs-ticket-system
This is a custom discord.js v14 ticket system full remade by Ducko little help by Roald;) 

- Credit to [Roald](https://github.com/RoaldDahl) for helping with some of the code<3

## Dependencies:
-  [Roald Modal Handler](https://github.com/RoaldDahl/Modal-Handler)
-  [Roald Button Handler](https://github.com/RoaldDahl/Button-Handler)
-  npm i mongoose
-  npm i discord-html-transcripts
-  npm i discord.js@14.3.0

# Changelog
- Added Add-Remove Command
- Changed Design
- Added Button Handler requirements
- Added modal Handler requirements
- Added Claim Button
- Added Modal Close Reason
- Added Ticket Counter
- Added Delete-Setup Command
- Added Delete-Counter Command (Resets the counter)

# Instructions:
1) Place the command into your commands folder.
2) Create a new folder in the bot root direcatory and name it "Schemas", and than place the schema in there.
3) Change all the paths to the right ones if needed.
4) Place the event into your events folder.
5) Else make sure every path is right!

# MongoDB Connection:
- be sure to add this to your ready.js file.
```js
const { MongoDB } = require("MongoDB URL");
const { connect } = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    connect(MongoDB).then(() => {
      console.log(`Mongoose Connected`);
    });
  },
};
```

# Contributing:
> if you want to contribute create a fork of this project and when you are done editing it update the fork and create a pull request.
