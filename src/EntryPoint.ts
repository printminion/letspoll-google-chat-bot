import {chat_v1} from "googleapis";
import {ActionType, AI} from "./AI";
import {UI} from "./UI";
import {Messages} from "./Messages";

/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 * @return {chat_v1.Schema$Message}
 */
export function onMessage(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {

    if (event.space.type == "DM") {
        return {text: Messages.MESSAGE_HELP};
    }

    let action;
    let message = "unknown state";
    try {
        action = AI.parseAction(event.message.text);
    } catch (e) {
        return {
            text: e.message
        };
    }
    console.log("action", action, JSON.stringify(action));

    if (action.type == ActionType.ACTION_START_POLL) {
        return UI.createVoteCardMessage(action);
    }

    if (action.type == ActionType.ACTION_HELP) {
        return {text: Messages.MESSAGE_HELP};
    }

    return {text: message};
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 * @return {chat_v1.Schema$Message}
 */
function onAddToSpace(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {
    let message = Messages.MESSAGE_HOW_TO_START;

    if (event.space.type == "DM") {
        return {text: Messages.MESSAGE_HELP};
    }

    if (event.message) {
        message = Messages.MESSAGE_HOW_TO_START;
    }

    return {text: message};
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {chat_v1.Schema$DeprecatedEvent} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event: chat_v1.Schema$DeprecatedEvent) {
    console.info("Bot removed from ", event.space.name);
    const message = "Thank you for usage ;)";
    return {text: message};
}

/**
 * Card click event handler
 * @param {chat_v1.Schema$DeprecatedEvent} event The Hangouts Chat event
 * @return {chat_v1.Schema$Message} payload for appropriate vote card, depending on user input
 * @see developers.google.com/hangouts/chat/how-tos/cards-onclick
 */
export function onCardClick(event: chat_v1.Schema$DeprecatedEvent): chat_v1.Schema$Message {
    console.log("onCardClick", JSON.stringify(event));

    // Create a new vote card when 'VOTE' button is clicked.
    if (event.action.actionMethodName === 'vote') {
        const itemId = parseInt(event.action.parameters[0].value);
        const result = UI.updateVoteCardMessage(event.message.cards, event.user, itemId, true);

        // Logger.log(result);
        console.log("onCardClick", JSON.stringify(result));
        return result;
    }

    return {};
}
