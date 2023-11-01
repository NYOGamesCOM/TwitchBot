# Twitch Bot

The Twitch Bot LIVE Notification System is a Discord bot that provides real-time notifications for when a Twitch streamer goes live on your server. It allows server administrators to manage a list of streamers to track and notify users when their favorite streamers start broadcasting.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

The Twitch Bot is built using Discord.js, Axios, and Express. It enables your Discord server to track and notify users when specific Twitch streamers start their broadcasts. The system includes commands for managing the list of streamers to monitor, setting notification channels, and changing the command prefix.

## Prerequisites

Before you start using the Twitch Discord Bot, ensure that you have the following prerequisites:

- **Node.js (v18.16.1 or higher):** The bot is built with Node.js, so you need to have Node.js installed on your server.
- **Discord Bot Token:** You'll need a Discord Bot Token. If you haven't created a bot on Discord, you can do so through the Discord Developer Portal.
- **Twitch Client ID and Token:** To access Twitch API data, you'll need a Twitch Client ID and Token. You can obtain these credentials by creating an application on the Twitch Developer portal.
- **Discord OAuth2 Redirect URL:** This is necessary for authenticating users. You can specify a redirect URL, which is typically 'http://localhost:3000/auth/callback' for local development.

Certainly, here's an updated version of the Installation section for your Twitch Bot LIVE Notification System documentation:

## Installation

To set up the bot on your server, follow these steps:

1. **Clone the GitHub Repository:** Start by cloning the bot's GitHub repository to your server:

   ```shell
   git clone https://github.com/NYOGamesCOM/TwitchBot.git
   ```

2. **Install Required Modules:** Navigate to the project directory and install the necessary Node.js modules:

   ```shell
   npm install
   ```

3. **Set Environment Variables:** You'll need to configure environment variables for the bot to function properly. Create a `.env` file in the project's root directory and set the following variables:

   - `DISCORD_BOT_TOKEN=your_discord_bot_token`
   - `TWITCH_CLIENT_ID=your_twitch_client_id`
   - `TWITCH_TOKEN_ID=your_twitch_token_id`
   - `DISCORD_SECRET_ID=your_discord_oauth2_secret_id`
   - `DISCORD_CLIENT_ID=your_discord_client_id`
   - `LOG_CHANNEL_ID=your_log_channel_id`
   - `CHECK_INTERVAL=your_check_interval`
   - `CHANNEL_TYPE=your_channel_type`

   Replace `your_discord_bot_token`, `your_twitch_client_id`, `your_twitch_token_id`, `your_discord_oauth2_secret_id`, `your_discord_client_id`, `your_log_channel_id`, `your_check_interval`, and `your_channel_type` with your actual values.

   Here's an example of how your `.env` file might look:

   ```shell
   DISCORD_BOT_TOKEN=your_discord_bot_token
   TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_TOKEN_ID=your_twitch_token_id
   DISCORD_SECRET_ID=your_discord_oauth2_secret_id
   DISCORD_CLIENT_ID=your_discord_client_id
   LOG_CHANNEL_ID=your_log_channel_id
   CHECK_INTERVAL=60000
   CHANNEL_TYPE=text
   ```

4. **Start the Application:** Launch the bot by running the following command:

   ```shell
   npm start
   ```

   The bot will now be up and running, ready to provide Twitch live notifications on your server.

3. **Set Environment Variables:** You'll need to configure environment variables for the bot to function properly. Set the following variables:

   - `DISCORD_BOT_TOKEN`: Your Discord bot token.
   - `TWITCH_CLIENT_ID`: Your Twitch Client ID.
   - `TWITCH_TOKEN_ID`: Your Twitch Token ID.
   - `DISCORD_SECRET_ID`: Discord OAuth2 Secret ID for session management.
   - `DISCORD_CLIENT_ID`: Discord Client ID.
   - `LOG_CHANNEL_ID`: The default log channel ID for your bot.
   - `CHECK_INTERVAL`: The interval (in milliseconds) at which the bot checks the streamer status.
   - `CHANNEL_TYPE`: The type of Discord channel you want to use for notifications (e.g., 'text').

4. **Start the Application:** Launch the bot by running the following command:

   ```shell
   npm start
   ```

## Configuration

### Environment Variables

The bot relies on several environment variables for its configuration:

- **DISCORD_BOT_TOKEN:** This is your Discord bot token, which is essential for the bot to authenticate with your server.

- **TWITCH_CLIENT_ID:** The Twitch Client ID is required for making requests to the Twitch API.

- **TWITCH_TOKEN_ID:** The Twitch Token ID allows the bot to authenticate with the Twitch API.

- **DISCORD_SECRET_ID:** Discord OAuth2 Secret ID is used for session management during user authentication.

- **DISCORD_CLIENT_ID:** This is your Discord Client ID, used in authentication and other interactions.

- **LOG_CHANNEL_ID:** The default log channel ID for your bot to log events and activities.

- **CHECK_INTERVAL:** This sets the interval (in milliseconds) at which the bot checks the status of the streamers. You can adjust this interval based on your preferences.

- **CHANNEL_TYPE:** This defines the type of Discord channel that the bot should use for notifications. The default is 'text'.


### Discord OAuth2 Redirect URL

To configure the Discord OAuth2 Redirect URL, follow these steps:

1. **Create a Discord Developer Application:** In the Discord Developer Portal, create an application to manage your bot.

2. **Set up OAuth2 in the Developer Portal:** In the Developer Portal, go to your application and navigate to the "OAuth2" section. Here, you can add a redirect URL. For local development, you can use `http://localhost:3000/auth/callback`. However, for production or live deployment, you should use a publicly accessible URL where your application is hosted.

   - If you have a domain for your application, use `https://yourdomain.com/auth/callback`.
   - Make sure to set up the corresponding route in your application code to handle authentication callbacks.
   - Ensure that the redirect URL is secure and properly configured to receive OAuth2 responses from Discord.

Remember that the redirect URL plays a crucial role in the authentication process, so it must be accurate and secure.

## Usage

The Twitch Bot LIVE Notification System provides various commands for managing and using the bot in your Discord server. These commands include:

- `!add [streamer name]`: Add a streamer to the notification list.
- `!remove [streamer ID]`: Remove a streamer from the notification list.
- `!list`: List all streamers in the notification list.
- `!getinvitelink`: Get an invite link to your server.
- `!prefix [new prefix]`: Change the command prefix.
- `!setchannel [channel ID]`: Set the notification channel.
- `!serverlist`: List information about the servers.
- `!logchannel [channel ID]`: Set the log channel.
- `!checkstreamer [streamer name]`: Check if a streamer is live.

## Features
![serverlist](https://github.com/NYOGamesCOM/TwitchBot/assets/3257915/49dba329-6431-4754-98ac-4171d3dce8bd)
- Real-time notification when a tracked Twitch streamer goes live.
- Flexible and customizable command prefix.
- Management of the list of streamers to track.
- Configuration of a specific notification channel.
- Logging of bot activities in a separate log channel.
- Support for multiple servers and easy invite link generation.



## Authentication

The bot provides authentication via Discord OAuth2. Users can log in and gain access to administrative features based on their permissions and roles in the server.

## Contributing

If you wish to contribute to this project, follow these steps:

1. **Fork the Repository:** Fork the bot's repository on GitHub to your own account.

2. **Clone Your Fork:** Clone the forked repository to your local development environment.

3. **Create a New Branch:** Create a new branch for your changes.

4. **Make Changes:** Make your code changes, enhancements, or bug fixes.

5. **Commit and Push:** Commit your changes and push them to your forked repository on GitHub.

6. **Create a Pull Request:** Open a pull request to propose merging your changes into the main repository.

## License

This project is licensed under the MIT License. You can find detailed information in the [LICENSE](LICENSE) file.

For any support or questions, feel free to join our [Discord server](https://discord.gg/pNGm9DHcuG).

Thank you for using the Twitch Bot LIVE Notification System! We hope this documentation helps you effectively use and customize the bot for your server.

## Acknowledgments

We would like to acknowledge the [Twitch](https://www.twitch.tv/) and [Discord](https://discord.com/) platforms for their support and the open-source community for contributing to this project.

**Twitch notification bot**

For support and additional information, please join our [Discord server](https://discord.gg/pNGm9DHcuG).

Thank you for using the Twitch Bot! We hope it enhances your server's experience.
