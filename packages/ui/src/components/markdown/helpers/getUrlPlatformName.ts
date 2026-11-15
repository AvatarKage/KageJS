import { assert, URL } from "@kagejs/utilities";
import { PlatformName } from "../types/platform.type.js";

/**
 * Identifies the platform or service associated with a URL.
 *
 * @param url - The URL or hostname to identify.
 * @returns The platform name or "unknown-platform" if unrecognized.
 *
 * @example
 * getUrlPlatformName("https://youtu.be/6BgK6_8TMd4"); // "youtube"
 */
export function getUrlPlatformName(url: string): PlatformName {
    assert(url).isDefined();

    const urlObject = new URL(url);
    const domain = urlObject.domain;

    switch (domain) {
        // Video
        case "youtube.com":
        case "www.youtube.com":
        case "m.youtube.com":
        case "youtu.be":
            return "youtube";

        case "vimeo.com":
        case "www.vimeo.com":
            return "vimeo";

        case "twitch.tv":
        case "www.twitch.tv":
        case "clips.twitch.tv":
            return "twitch";

        case "tiktok.com":
        case "www.tiktok.com":
            return "tiktok";

        // Music and audio
        case "spotify.com":
        case "www.spotify.com":
        case "open.spotify.com":
            return "spotify";

        case "soundcloud.com":
        case "www.soundcloud.com":
            return "soundcloud";

        case "music.apple.com":
            return "apple-music";

        // Social media
        case "instagram.com":
        case "www.instagram.com":
            return "instagram";

        case "facebook.com":
        case "www.facebook.com":
        case "fb.watch":
            return "facebook";

        case "x.com":
        case "www.x.com":
        case "twitter.com":
        case "www.twitter.com":
            return "x";

        case "pinterest.com":
        case "www.pinterest.com":
        case "pin.it":
            return "pinterest";

        // Community
        case "discord.com":
        case "www.discord.com":
        case "discordapp.com":
        case "discord.gg":
            return "discord";

        case "reddit.com":
        case "www.reddit.com":
        case "redd.it":
            return "reddit";

        default:
            return "unknown-platform";
    }
}
