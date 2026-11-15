import { assert } from "@kagejs/utilities";

import parseEmbedSize from "./parseEmbedSize.js";
import { getUrlPlatformName } from "./getUrlPlatformName.js";

import YouTubeEmbed from "../.old/YouTube.js";
import VimeoEmbed from "../.old/Vimeo.js";
import TwitchEmbed from "../.old/Twitch.js";
import TikTokEmbed from "../.old/TikTok.js";

import SpotifyEmbed from "../.old/Spotify.js";
import AppleMusicEmbed from "../.old/AppleMusic.js";
import SoundCloudEmbed from "../.old/SoundCloud.js";

import InstagramEmbed from "../.old/Instagram.js";
import FacebookEmbed from "../.old/Facebook.js";
import XEmbed from "../.old/X.js";
import PinterestEmbed from "../.old/Pinterest.js";

import DiscordEmbed from "../.old/Discord.js";
import RedditEmbed from "../.old/Reddit.js";

/**
 * Automatically renders supported URLs as embedded content.
 *
 * @param url - URL to render as an embed.
 * @returns Embedded React element or the original URL.
 *
 * @example
 * renderEmbed("https://open.spotify.com/track/5cZVeH0dqeu8zuC8Oyha4x");
 */
export function renderEmbed(url: string): React.ReactNode {
    assert(url).isDefined();

    const { url: cleanUrl, width, height } = parseEmbedSize(url);

    const platform = getUrlPlatformName(cleanUrl);

    const props = {
        url: cleanUrl,
        width: width ?? 100,
        height: height ?? 100
    };

    switch (platform) {
        // Video
        case "youtube":
            return <YouTubeEmbed {...props} />;

        case "vimeo":
            return <VimeoEmbed {...props} />;

        case "twitch":
            return <TwitchEmbed {...props} />;

        case "tiktok":
            return <TikTokEmbed {...props} />;

        // Music and audio
        case "spotify":
            return <SpotifyEmbed {...props} />;

        case "soundcloud":
            return <SoundCloudEmbed {...props} />;

        case "apple-music":
            return <AppleMusicEmbed {...props} />;

        // Social media
        case "instagram":
            return <InstagramEmbed {...props} />;

        case "facebook":
            return <FacebookEmbed {...props} />;

        case "x":
            return <XEmbed {...props} />;

        case "pinterest":
            return <PinterestEmbed {...props} />;

        // Communities
        case "discord":
            return <DiscordEmbed {...props} />;
        
        case "reddit":
            return <RedditEmbed {...props} />;

        case "unknown-platform":
        default:
            return url;
    }
}
