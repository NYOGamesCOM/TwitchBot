## Function and Command Documentation

### Constants and Dependencies

- `prefix`: A string representing the command prefix for your bot.
- `filePath`: A string representing the path to a JSON file where server data is stored.
- `botToken`: A string representing the Discord bot token.
- `twitchClientId`: A string representing the Twitch Client ID.
- `twitchTokenId`: A string representing the Twitch Token ID.
- `serverId`: A string representing the Discord server (guild) ID for logging purposes.
- `express`: The Express.js module for setting up a web server.
- `app`: An instance of an Express application for your web server.
- `guilds`: A `Map` object to store information about Discord servers.
- `intents`: An object specifying the Discord intents to be used.
- `client`: An instance of the `Client` class from the `discord.js` library for interacting with the Discord API.
- `checkInterval`: An integer representing the interval (in milliseconds) for monitoring streamers.
- `channelType`: A string representing the type of Discord channels you want to monitor (e.g., 'text').

### Web Server

- `app.get('/')`: A route handler for the root URL that reads server data from a JSON file and renders it using an EJS template.

### Client Events

- `client.once('ready')`: An event handler that runs when the bot is ready. It initializes the server data and schedules streamer monitoring at specified intervals.
- `client.on('messageCreate')`: An event handler that runs when a new message is created. It processes bot commands and logs server activity.

### Utility Functions

- `loadStreamersFromJSON(filename, serverId)`: Loads the list of streamers for a specific server from a JSON file.
- `getLogChannelIdFromJSON(filename, serverId)`: Retrieves the log channel ID for a specific server from a JSON file.
- `initializeServerData(guilds)`: Initializes server data for all Discord servers that the bot is a member of.
- `saveServerDataToJSON(data)`: Saves server data to a JSON file.
- `loadServerDataFromJSON(filename)`: Loads server data from a JSON file.

### Command Handling

- `handleCommands(message, serverId)`: Handles bot commands and executes corresponding actions.
- `handleHelpCommand(message)`: Displays a help message with a list of available commands.
- `handleServerListCommand(message)`: Generates and displays a list of servers and their settings.
- `handleSetChannelCommand(message, args, serverId, serverData)`: Sets the notification channel for streamer updates.
- `handleLogChannelCommand(message, args, serverId, serverData)`: Sets the log channel for server activity.
- `hasRole(member, roleName)`: Checks if a member has a specific role.
- `hasPermission(member, permission)`: Checks if a member has specific permissions.
- `handlePrefixCommand(message, args, serverId, serverData)`: Changes the command prefix for the server.
- `handleAddCommand(message, args)`: Adds a streamer to the notification list.
- `handleRemoveCommand(message, args, serverId)`: Removes a streamer from the notification list.
- `handleListCommand(message, serverId)`: Lists all streamers in the notification list.
- `handleGetInviteLinkCommand(message, serverId)`: Generates an invite link to the server.

### Notification and Monitoring

- `sendDiscordNotification(streamer, channelId, streamData)`: Sends a Discord notification when a streamer goes live.
- `checkStreamerStatus(serverId, streamer, textChannel)`: Checks the status of a streamer and sends notifications.
- `monitorStreamers()`: Periodically monitors streamers and sends notifications.
- `getPrefix(serverId)`: Gets the command prefix for a specific server.
- `getStreamersCountForServer(serverId, jsonData)`: Retrieves the count of streamers for a server.
- `handleGetInviteLinkCommand(message, serverId)`: Generates an invite link to the server.

These functions and commands enable your Discord bot to manage and monitor streamers and interact with Discord servers effectively. Make sure to integrate them correctly into your application and provide the required environmental variables.
