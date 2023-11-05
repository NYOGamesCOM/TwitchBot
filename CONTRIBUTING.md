# Contributing to the Discord Twitch Bot

Thank you for considering contributing to the Discord Twitch Bot. This documentation outlines the guidelines for contributing to this project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Review Process](#review-process)
8. [Contact](#contact)

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors and users. Please read it and adhere to its principles when participating in this project.

## Prerequisites

Before you start contributing, make sure you have the following prerequisites:

- Node.js and npm installed.
- A Discord Bot Token, Twitch Client ID, and Twitch Token ID.
- Knowledge of JavaScript and Discord.js library.
- A Discord server where you can add the bot.

## Getting Started

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/NYOGamesCOM/TwitchBot.git
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project's root directory and add the following environment variables with your own values:

   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token
   TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_TOKEN_ID=your_twitch_token_id
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. You can now invite the bot to your Discord server using the OAuth2 URL displayed in the console when the bot is running.

## Making Changes

Feel free to make changes, improvements, or bug fixes to the bot. Here are some guidelines:

- Follow a consistent code style.
- Document your code using comments.
- Use meaningful variable and function names.
- Keep the project dependencies updated.

## Testing

Before submitting your changes, ensure that your code works correctly. Test it in your Discord server to make sure it functions as expected.

## Submitting Changes

When you're ready to submit your changes:

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes with a descriptive message:

   ```bash
   git commit -m "Add your feature or fix issue #X"
   ```

3. Push your changes to your forked repository:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request (PR) on the original repository. Provide a clear title and description for your changes.

## Review Process

Contributions will be reviewed by the project maintainers. They may request changes or provide feedback before merging your changes into the project.

## Contact

If you have questions or need assistance, you can contact the project maintainers on the project's [Discord server](https://discord.gg/pNGm9DHcuG).

Thank you for your interest in contributing to the Discord Twitch Bot! Your contributions are greatly appreciated.
