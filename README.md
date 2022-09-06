![Image](https://cdn.discordapp.com/attachments/1009197481915056160/1009240837055586364/TICKET_SYSTEM.jpg)

## I MADE MY OWN VERSION RECODED A LOT:) CREDIT TO LUNAR FOR THE BASICS
## The ticket system was made for my bot Peep so thats the reason if everything is blurple

# djs-ticket-system
This DJS ticket system with transcripts is fully configurable, you can change the transcripts channel, tickets channel, and more! This command uses embeds, and buttons.

## Dependencies:
```
-  npm i mongoose
-  npm i discord-html-transcripts
-  npm i discord.js@14.3.0
```
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
