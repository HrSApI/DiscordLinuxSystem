require("dotenv/config");
const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");
const { exec } = require("child_process");
const { HandleError } = require("./utils/main");

// Get the (authorId || OwnerId) from package.json
const { author } = require("./package.json");

// Save user's current directory
const userDirectories = {};

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  const prefix = "!";
  const ownerId = author; // Replace with your own ID
  const userId = message.author.id;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (!userDirectories[userId]) {
    // Set initial directory to user's home directory
    userDirectories[userId] = process.env.HOME || "/";
  }

  if (message.author.id !== ownerId) {
    return message.reply({
      content: "You are not allowed to use this command!",
    });
  }

  let linuxCommand = message.content.slice(prefix.length).trim();

  // Return if command not allowed (rm -rf, shutdown)
  // (just for fun, you can remove this if you want to use it for real!)
  if (linuxCommand.includes("rm -rf") || linuxCommand.includes("shutdown")) {
    return message.reply({ content: "Nope!" });
  }

  // Change directory command
  if (linuxCommand.startsWith("cd ")) {
    const newDir = linuxCommand.slice(3).trim();
    // Update user's current directory
    userDirectories[userId] = newDir;
    return message.reply(`Changed directory to: ${newDir}`);
  }

  // Append user's current directory to command
  linuxCommand = `cd ${userDirectories[userId]} && ${linuxCommand}`;

  exec(linuxCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return message.reply({
        content: `Error executing command: \n\n\`\`\`${error.message}\`\`\``,
      });
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return message.reply({
        content: `Command Error: \n\n\`\`\`${stderr}\`\`\``,
      });
    }
    message.reply({ content: `Command Output: \`\`\`${stdout}\`\`\`` });
  });
});

client.login(process.env.TOKEN);

HandleError();
