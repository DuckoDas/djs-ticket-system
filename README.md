# Recode by Ducko - Changed everything more clean and other stuff addded

# djs-ticket-system
This is a custom discord.js v14 ticket system full remade by Ducko little help by Roald;)

Credit to [Roald](https://github.com/RoaldDahl) for helping with some of the code<3

## Dependencies:
-  [Roald Modal Handler](https://github.com/RoaldDahl/Modal-Handler)
-  [Roald Button Handler](https://github.com/RoaldDahl/Button-Handler)
-  npm i mongoose
-  npm i discord-html-transcripts
-  npm i discord.js@14.3.0

# Changelog #1
- Changed Design
- Added Add-Remove Command
- Added Button Handler requirements
- Added modal Handler requirements
- Added Claim Button
- Added Modal Close Reason
- Added Ticket Counter
- Added Delete-Setup Command
- Added Delete-Counter Command (Resets the counter)
- Fixed ClaimedBy code in Ticket Modal

# Instructions:
1) Place Commands in your command folder
2) Place Buttons in your button folder using [Roald Button Handler](https://github.com/RoaldDahl/Button-Handler)
3) Place Modals in your modal folder using [Roald Modal Handler](https://github.com/RoaldDahl/Modal-Handler)
4) Place Schemas the schemas in your schema folder
5) Make the paths right for your bot!
6) Any errors? Scroll down!

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

# Any errors join my [Discord](https://discord.gg/TKz7BMwEap) or dm me! Ducko#7068

# Contributing:
> if you want to contribute create a fork of this project and when you are done editing it update the fork and create a pull request.
