![Image](https://cdn.discordapp.com/attachments/1009197481915056160/1009240837055586364/TICKET_SYSTEM.jpg)

## I MADE MY OWN VERSION RECODED A LOT:) CREDIT TO LUNAR FOR THE BASICS
## The ticket system was made for my bot Peep so thats the reason if everything is blurple
# Currently improving! Still works like this:)

# djs-ticket-system
This is a custom discord.js v14 ticket system full remade by Ducko little help by Roald;) 

- Credit to [Roald](https://github.com/RoaldDahl) for helping with some of the code<3

## Dependencies:
-  [Roald Modal Handler](https://github.com/RoaldDahl/Modal-Handler)
-  [Roald Button Handler](https://github.com/RoaldDahl/Button-Handler)
-  npm i mongoose
-  npm i discord-html-transcripts
-  npm i discord.js@14.3.0

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
