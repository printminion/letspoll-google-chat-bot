export namespace Messages {

    export const BOT_NAME = "LetsPoll";
    export const MESSAGE_HELP = "You can start poll something like this:\n" +
        "@LetsPoll \"What should we order for lunch?\" \"Burgers\" \"Pizza\" \"Sushi\"";
    export const MESSAGE_ROOM_NO_INPUT = "Please make sure your poll has at least two voting options, something like this:\n" +
        "@" + Messages.BOT_NAME + " \"What should we order for lunch?\" \"Burgers\" \"Pizza\" \"Sushi\"";
    export const MESSAGE_HOW_TO_START = "Hey there 👋! Here's how to create a poll with " + Messages.BOT_NAME
        + ": *@" + Messages.BOT_NAME + " \"What should we order for lunch?\" \"Burgers\" \"Pizza\" \"Sushi\" *\n" +
        "We'll publish the poll right in this room.";

    // For more help check out our help center: https://example.com";
}
