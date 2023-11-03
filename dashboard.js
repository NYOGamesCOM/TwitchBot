window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch server information from your bot
    const response = await fetch('/api/serverInfo');
    const serverInfo = await response.json();

    // Populate dashboard with server information
    document.getElementById('server-name').textContent = serverInfo.serverName;
    document.getElementById('prefix').textContent = serverInfo.prefix;
    document.getElementById('twitch-channel').textContent = serverInfo.twitchChannel;
    document.getElementById('log-channel-id').textContent = serverInfo.logChannelId;
    document.getElementById('streamers-count').textContent = serverInfo.streamersCount;

    // Fetch and populate the streamer list
    const streamerList = await fetch('/api/streamers');
    const streamers = await streamerList.json();
    const streamerListContainer = document.getElementById('streamer-list');

    streamers.forEach((streamer) => {
      const li = document.createElement('li');
      li.textContent = streamer.name;
      streamerListContainer.appendChild(li);
    });

    // Generate server invite link
    const inviteLink = document.getElementById('invite-link');
    inviteLink.href = serverInfo.inviteLink;
  } catch (error) {
    console.error(error);
  }
});
