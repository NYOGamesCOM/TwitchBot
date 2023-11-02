const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const prefix = "!";
const filePath = 'streamers.json';
const botToken = process.env.DISCORD_BOT_TOKEN;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchTokenId = process.env.TWITCH_TOKEN_ID;
const serverId = '356052883730464768';// for logs
const express = require('express');
const app = express();
const guilds = new Map();
const intents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]);
const client = new Client({ intents: intents });
const checkInterval = 10 * 60 * 1000;
const channelType = 'text';


app.get('/', (req, res) => {
  const filePath = 'streamers.json';
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const serverData = JSON.parse(data);
    res.render('index.ejs', { serverData });
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.send('An error occurred while reading the JSON file.');
  }
});

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.guilds.cache.forEach((guild) => {
    guilds.set(guild.id, guild);
    initializeServerData(client.guilds.cache);
    monitorStreamers();
    setInterval(monitorStreamers, checkInterval);
  });
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    const serverId = message.guild.id;
    handleCommands(message, serverId);
    const [command, ...args] = message.content.slice(prefix.length).split(' ');
    const server = guilds.get(serverId);
    if (server) {
      const serverName = server.name;
      const prefix = getPrefix(serverId);
      const logChannelId = getLogChannelIdFromJSON(filePath, serverId);
      if (logChannelId) {
        const logChannel = client.channels.cache.get(logChannelId);
        if (logChannel) {
          const logEmbed = new MessageEmbed()
            .setColor('#0088FF') // Set your desired color
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle('Activity Logger')
            .addFields(
              { name: 'Prefix', value: prefix },
              { name: 'Command', value: `${command} ${args.join(' ')}` },
              { name: 'User', value: message.author.tag },
              { name: 'User ID', value: message.author.id },
              { name: 'Server', value: serverName },
              { name: 'Server ID', value: serverId },
              { name: 'Channel', value: message.channel.name },
              { name: 'Channel ID', value: message.channel.id }
            )
            .addFields(
              {
                name: 'Twitch notification bot',
                value: '[Support](https://discord.gg/pNGm9DHcuG)',
              }
            )
            .setTimestamp();
          logChannel.send({ embeds: [logEmbed] });
        } else {
          console.log(`Log channel not found or undefined.`);
        }

        const generalLogChannelId = '1003653024876609556';
        const generalLogChannel = client.channels.cache.get(generalLogChannelId);
        if (generalLogChannelId) {
          if (generalLogChannel) {
            const logEmbed = new MessageEmbed()
              .setColor('#FF0000')
              .setThumbnail(message.guild.iconURL({ dynamic: true }))
              .setTitle('Activity Logger')
              .addFields(
                { name: 'Prefix', value: prefix },
                { name: 'Command', value: `${command} ${args.join(' ')}` },
                { name: 'User', value: message.author.tag },
                { name: 'User ID', value: message.author.id },
                { name: 'Server', value: serverName },
                { name: 'Server ID', value: serverId },
                { name: 'Channel', value: message.channel.name },
                { name: 'Channel ID', value: message.channel.id }
              )
              .addFields(
                {
                  name: 'Twitch notification bot',
                  value: '[Support](https://discord.gg/pNGm9DHcuG)',
                }
              )
              .setTimestamp();
            generalLogChannel.send({ embeds: [logEmbed] });
          } else {
            console.log(`General log channel not found or undefined.`);
          }
        } else {
          console.log(`General log channel ID not found.`);
        }
      } else {
        console.log(`Log channel ID not found for server ID: ${serverId}`);
      }
    }
  }
});

function loadStreamersFromJSON(filename, serverId) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const jsonData = JSON.parse(data);
    const serverData = jsonData.servers[serverId];
    return serverData ? serverData.streamers || [] : [];
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return [];
  }
}

function getLogChannelIdFromJSON(filename, serverId) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const jsonData = JSON.parse(data);
    const serverData = jsonData.servers[serverId];

    if (serverData) {
      const logChannelId = serverData.logChannelId;
      if (logChannelId) {
        return logChannelId;
      }
    }
  } catch (err) {
    console.error('Error reading JSON file or finding logChannelId:', err);
  }
  return '1003653024876609556';
}

function initializeServerData(guilds) {
  const serverData = loadServerDataFromJSON(filePath);

  guilds.forEach((guild) => {
    const serverId = guild.id;
    const serverName = guild.name;

    if (!serverData.servers[serverId]) {
      const logChannelId = serverData.logChannelID;
      const twitchChannel = serverData.twitchChannel;
      const prefixid = serverData.prefix;
      serverData.servers[serverId] = {
        streamers: [],
        name: serverName,
        logChannelId: logChannelId,
        prefix: prefixid,
        twitchChannel: twitchChannel,
      };
    }
  });

  saveServerDataToJSON(serverData);
}

function saveServerDataToJSON(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadServerDataFromJSON(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const serverData = JSON.parse(data);

    if (!serverData.servers) {
      serverData.servers = {};
    }

    Object.keys(serverData.servers).forEach((serverId) => {
      const server = serverData.servers[serverId];
      if (!server.logChannelId) {
        server.logChannelId = '1003653024876609556';
      }
      if (!server.prefix) {
        server.prefix = '!';
      }
      if (!server.twitchChannel) {
        server.twitchChannel = 'Not Set';
      }
    });

    return serverData;
  } catch (err) {
    return { servers: {} };
  }
}

function handleCommands(message, serverId) {
  const serverData = loadServerDataFromJSON(filePath);
  const server = serverData.servers[serverId];
  const prefix = server ? server.prefix || '!streamer' : '!streamer';

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'add') {
      if (hasPermission(message.member, 'ADMINISTRATOR') || hasRole(message.member, 'Admin')) {
        if (args.length !== 1) {
          message.reply('Please provide the streamer name.');
        } else {
          handleAddCommand(message, args, serverId);
        }
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'remove') {
      if (hasPermission(message.member, 'ADMINISTRATOR') || hasRole(message.member, 'Admin')) {
        if (args.length !== 1) {
          message.reply('Please provide the streamer ID.');
        } else {
          handleRemoveCommand(message, args, serverId);
        }
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'list') {
      handleListCommand(message, serverId);
    } else if (command === 'help') {
      handleHelpCommand(message);
    } else if (command === 'getinvitelink') {
      if (hasPermission(message.member, 'ADMINISTRATOR')) {
        handleGetInviteLinkCommand(message, serverId);
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'prefix') {
      if (hasPermission(message.member, 'ADMINISTRATOR')) {
        handlePrefixCommand(message, args, serverId, serverData);
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'setchannel') {
      if (hasPermission(message.member, 'ADMINISTRATOR') || hasRole(message.member, 'Admin')) {
        if (args.length !== 1) {
          message.reply('Please provide the channel ID.');
        } else {
          handleSetChannelCommand(message, args, serverId, serverData);
        }
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'logchannel') {
      if (hasPermission(message.member, 'ADMINISTRATOR') || hasRole(message.member, 'Admin')) {
        if (args.length !== 1) {
          message.reply('Please provide the channel ID.');
        } else {
          handleLogChannelCommand(message, args, serverId, serverData);
        }
      } else {
        message.reply('You do not have permission to use this command.');
      }
    } else if (command === 'serverlist') {
      handleServerListCommand(message, args, serverId, serverData);
    } else if (command === 'checkstreamer') {
      if (args.length !== 1) {
        message.reply('Please provide the streamer name.');
      } else {
        const streamerName = args[0].toLowerCase();
        const serverData = loadServerDataFromJSON(filePath);
        const server = serverData.servers[serverId];
        const channelId = server ? server.twitchChannel : null;

        if (!channelId) {
          message.reply('Twitch channel is not set.');
          return;
        };

        const streamer = {
          name: streamerName,
        };
        sendDiscordNotification(streamer, channelId, streamerName)
        checkStreamerStatus(serverId, streamer, channelId);
      }
    }
  }
}

function handleHelpCommand(message) {
  const helpEmbed = new MessageEmbed()
    .setColor('#0088FF')
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setTitle('Twitch bot commands')
    .addFields(
      { name: 'add [streamer name]', value: 'Add a streamer to the notification list.' },
      { name: 'remove [streamer ID]', value: 'Remove a streamer from the notification list.' },
      { name: 'list', value: 'List all streamers in the notification list.' },
      { name: 'getinvitelink', value: 'Get an invite link to your server.' },
      { name: 'prefix [new prefix]', value: 'Change the command prefix.' },
      { name: 'setchannel [channel ID]', value: 'Set the notification channel.' },
      { name: 'serverlist', value: 'List information about the servers.' },
      { name: 'logchannel', value: 'Set the log channel.' },
      { name: 'checkstreamer [streamer name]', value: 'Check if streamer is live.' }
    )
    .addFields({ name: '\n', value: '\n', })
    .addFields(
      {
        name: 'Twitch notification bot',
        value: '[Support](https://discord.gg/pNGm9DHcuG)',
      }
    )
    .setTimestamp();

  message.channel.send({ embeds: [helpEmbed] });
}


async function handleServerListCommand(message) {
  const separator = '--------------------------';
  const guildsList = client.guilds.cache.map(async (guild) => {
    const serverData = loadServerDataFromJSON(filePath);
    const serverInfo = serverData.servers[guild.id];

    let prefix = '!';
    let twitchChannel = 'Not Set';
    let logChannelId = 'Not Set';
    let streamersCount = 0;

    if (serverInfo) {
      prefix = serverInfo.prefix || '!';
      twitchChannel = serverInfo.twitchChannel || 'Not Set';
      logChannelId = serverInfo.logChannelId || 'Not Set';
      streamersCount = getStreamersCountForServer(guild.id, serverData);
    }

    const streamers = serverInfo ? serverInfo.streamers.map((streamer) => `- ${streamer.name} `).join('\n') : 'No streamers';

    const textChannel = guild.channels.cache.find((channel) => channel.type === 'GUILD_TEXT');

    if (!textChannel) {
      return 'No text channel found';
    }

    const invite = await textChannel.createInvite({ unique: true });

    const infoString = `** Server Name:** ${guild.name} \n ** Invite link:** ${invite.url} \n ** Prefix:** ${prefix} \n ** Twitch Channel:** ${twitchChannel} \n ** Log Channel ID:** ${logChannelId} \n ** Server ID:** ${guild.id} \n ** Streamers:** ${streamersCount} `;

    return infoString + `\n${streamers} ` + `\n${separator} `;
  });

  const guildsInfo = await Promise.all(guildsList);

  const serverList = guildsInfo.join('\n\n');

  const listEmbed = new MessageEmbed()
    .setColor('#0088FF')
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setTitle('Discord server list')
    .setDescription(serverList)
    .addFields(
      {
        name: 'Twitch notification bot',
        value: '[Support](https://discord.gg/pNGm9DHcuG)',
      }
    )
    .setTimestamp();

  message.channel.send({ embeds: [listEmbed] });
}

function handleSetChannelCommand(message, args, serverId, serverData) {
  const channelId = args[0];
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    const config = serverData.servers[serverId];
    config.twitchChannel = channelId;

    saveServerDataToJSON(serverData);
    message.reply(`Twitch live notifications will now be sent to < #${channelId}>.`);
  } else {
    message.reply('Channel not found.');
  }
}

function handleLogChannelCommand(message, args, serverId, serverData) {
  const channelId = args[0];
  const channel = client.channels.cache.get(channelId);

  if (channel) {
    const config = serverData.servers[serverId];
    config.logChannelId = channelId;

    saveServerDataToJSON(serverData);
    message.reply(`Log channel has been sent to < #${channelId}>.`);
  } else {
    message.reply('Channel not found.');
  }
}

function hasRole(member, roleName) {
  return member.roles.cache.some((role) => role.name === roleName);
}

function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

function handlePrefixCommand(message, args, serverId, serverData) {
  if (!message.member.permissions.has('ADMINISTRATOR') || hasRole(message.member, 'Twitch')) {
    return message.reply('You do not have permission to use this command.');
  }

  const newPrefix = args[0];

  if (!newPrefix) {
    return message.reply('Please provide a new prefix.');
  }

  serverData.servers[serverId].prefix = newPrefix;
  saveServerDataToJSON(serverData);

  message.reply(`Prefix for this server has been updated to "${newPrefix}".`);
}

function handleAddCommand(message, args) {
  if (!message.member.permissions.has('ADMINISTRATOR') || hasRole(message.member, 'Twitch')) {
    return message.reply('You do not have permission to use this command.');
  }

  const streamerName = args.join(' ');
  const serverId = message.guild.id;

  const serverData = loadServerDataFromJSON(filePath);
  const server = serverData.servers[serverId] || { streamers: [] };

  const nextID = server.streamers.length + 1;

  server.streamers.push({ id: nextID, name: streamerName });
  serverData.servers[serverId] = server;

  const updatedData = JSON.stringify(serverData, null, 2);
  fs.writeFileSync(filePath, updatedData);

  message.reply(`LIVE notification added for ${streamerName}(ID: ${nextID})(GID: ${serverId})`);
}

function handleRemoveCommand(message, args, serverId) {
  if (!message.member.permissions.has('ADMINISTRATOR') || hasRole(message.member, 'Twitch')) {
    return message.reply('You do not have permission to use this command.');
  }

  const streamerID = parseInt(args[0]);

  const serverData = loadServerDataFromJSON(filePath);
  const server = serverData.servers[serverId] || { streamers: [] };

  const index = server.streamers.findIndex((streamer) => streamer.id === streamerID);

  if (index !== -1) {
    const removedStreamer = server.streamers.splice(index, 1)[0];

    serverData.servers[serverId] = server;
    const updatedData = JSON.stringify(serverData, null, 2);
    fs.writeFileSync(filePath, updatedData);

    message.reply(`Streamer ${removedStreamer.name} (ID: ${streamerID}) removed from the list.`);
  } else {
    message.reply(`Streamer with ID ${streamerID} was not found in the list.`);
  }
}

function handleListCommand(message, serverId) {
  try {
    const serverData = loadServerDataFromJSON('streamers.json');
    const server = serverData.servers[serverId];
    if (!server) {
      return message.reply('Server not found');
    }

    const guild = client.guilds.cache.get(serverId);
    if (!guild) {
      return message.reply('Guild not found');
    }

    const streamerList = server.streamers
      .map((streamer) => `${streamer.id} - ${streamer.name} `)
      .join('\n');

    const listEmbed = new MessageEmbed()
      .setColor('#0088FF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setTitle(`${guild.name} streamer list`)
      .setDescription(streamerList)
      .addFields(
        {
          name: 'Twitch notification bot',
          value: '[Support](https://discord.gg/pNGm9DHcuG)',
        }
      )
      .setTimestamp();
    message.channel.send({ embeds: [listEmbed] });
  } catch (error) {
    message.reply('An error occurred while listing streamers.');
  }
}

async function sendDiscordNotification(streamer, channelId, streamData) {
  const channel = client.channels.cache.get(channelId);

  if (!channel) {
    console.error(`Channel not found for ID: ${channelId} `);
    return;
  }

  const embed = new MessageEmbed()
    .setColor('#0088FF')
    .setThumbnail(channel.guild.iconURL({ dynamic: true }))
    .setTitle('Live Stream Alert')
    .setDescription(`** Streamer:** ${streamer} \n` +
      `** Title:** ${streamData.title} \n` +
      `** Viewers:** ${streamData.viewer_count} \n` +
      `** Started at:** ${new Date(streamData.started_at).toUTCString()} `)
    .addFields(
      {//.addFields('Watch Now', `[Watch Stream](https://www.twitch.tv/${streamer})`)
        name: 'Watch Now',
        value: '[Watch Stream](https://www.twitch.tv/${streamer})',
      }
    )
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

async function checkStreamerStatus(serverId, streamer, textChannel) {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamer.name}`, {
      headers: {
        'Client-ID': twitchClientId,
        'Authorization': `Bearer ${twitchTokenId}`,
      },
    });

    if (response.status === 200) {
      const data = response.data;
      if (data.data.length > 0) {
        const streamData = data.data[0];
        sendDiscordNotification(serverId, streamer.name, textChannel, streamData); // Pass serverId to the notification function if needed
      }
    }
  } catch (error) {
    console.error(`Error checking stream for ${streamer.name} on server ${serverId}: ${error.message}`);
  }
}

function monitorStreamers() {
  const server = client.guilds.cache.get(serverId);

  if (server && server.available) {
    server.channels.cache.each((channel) => {
      if (channel.type === channelType) {
        const textChannel = channel;
        textChannel.members.each((member) => {
          if (member.user.bot) return;
          const streamers = loadStreamersFromJSON('streamers.json', serverId);
          streamers.forEach((streamer) => {
            checkStreamerStatus(serverId, streamer, textChannel);
          });
        });
      }
    });
  }
}

function getPrefix(serverId) {
  const filePath = 'streamers.json';
  const fs = require('fs');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const serverData = JSON.parse(data);

    if (serverData.servers[serverId]) {
      const prefix = serverData.servers[serverId].prefix;
      return prefix;
    } else {
      return '!';
    }
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return '!';
  }
}

function getStreamersCountForServer(serverId, jsonData) {
  const serverData = jsonData.servers[serverId];
  return serverData ? serverData.streamers.length : 0;
}

async function handleGetInviteLinkCommand(message, serverId) {
  try {
    const serverData = loadServerDataFromJSON(filePath);
    const server = serverData.servers[serverId];

    if (!server) {
      message.reply('Server information not found.');
      return;
    }

    const invite = await client.guilds.fetch(serverId).invites.create();
    message.reply(`Invite link for the server "${server.name}": ${invite.url}`);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while generating the invite link.');
  }
}


client.login(botToken);
