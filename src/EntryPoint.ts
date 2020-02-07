import {chat_v1} from "googleapis";
import {AI} from "./AI";
import {UI} from "./UI";

/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 * @return {chat_v1.Schema$Message}
 */
function onMessage(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {
    // let name = "";

    if (event.space.type == "DM") {
        // name = "You";
        const message = "Add me to a group for more fun";
        // name + " said \"" + event.message.text + "\"";
        // name = event.user.displayName;

        return {text: message};
    }

    const action = AI.parseAction(event.message.text);

    console.log("action", action, JSON.stringify(action));

    return UI.createVoteCardMessage(action)
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 * @return {chat_v1.Schema$Message}
 */
function onAddToSpace(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {
    var message = "";

    // if (event.space.type == "DM") {
    //     message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
    // } else {
    // message = "Thank you for adding me to " + event.space.displayName;
    message = "Hey there 👋! Here's how to create a poll with Polly: *@LetsPoll \"What should we order for lunch?\" \"Burgers\" \"Pizza\" \"Sushi\" *\n" +
        "We'll publish the poll right in this room. ";
    // }

    // if (event.message) {
    //     // Bot added through @mention.
    //     message = message + " and you said: \"" + event.message.text + "\"";
    // }

    return {text: message};
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event: chat_v1.Schema$DeprecatedEvent) {
    console.info("Bot removed from ", event.space.name);
}

/**
 * Card click event handler
 * @param {chat_v1.Schema$DeprecatedEvent} event The Hangouts Chat event
 * @return {chat_v1.Schema$Message} payload for appropriate vote card, depending on user input
 * @see developers.google.com/hangouts/chat/how-tos/cards-onclick
 */
function onCardClick(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {
    console.log("onCardClick", JSON.stringify(event));

    // Create a new vote card when 'NEW' button is clicked.
    if (event.action.actionMethodName === 'vote') {
        const itemId = parseInt(event.action.parameters[0].value);
        const result = UI.updateVoteCardMessage(event.message.cards, event.user, itemId, true);

        Logger.log(result);
        console.log("onCardClick", JSON.stringify(result));
        return result;
    }

    // Updates the card in-place when '+1' or '-1' button is clicked.
    // let voteCount = +event.action.parameters[0].value;
    // event.action.actionMethodName === 'upvote' ? ++voteCount : --voteCount;
    // return UI.updateVoteCardMessage(event.user.displayName, 1, true);

    return {};
}
