import {Messages} from "./Messages";

export interface IVoteAction {
    type: ActionType
    title?: string,
    items?: string[]
}

export enum ActionType {
    ACTION_UNKNOWN,
    ACTION_HELP,
    ACTION_START_POLL,
}

export class AI {
    static parseAction(string: string): IVoteAction {
        let action: IVoteAction = {type: ActionType.ACTION_UNKNOWN, title: undefined, items: []};

        string = string || "";

        // strip bot name
        string = string.replace("@" + Messages.BOT_NAME, "");

        if (!string) {
            throw new Error(Messages.MESSAGE_ROOM_NO_INPUT);
        }

        if (string.trim().toLowerCase() == "help") {
            action.type = ActionType.ACTION_HELP;
            return action;
        }

        // count quotes
        let regex = /"/g, quote, quotes = [];
        while (quote = regex.exec(string)) {
            quotes.push(quote.index);
        }

        if (quotes.length == 0) {
            throw new Error("failed to parse input - no quotes");
        }

        if (quotes.length % 2) {
            throw new Error("failed to parse input - quote match");
        }

        const reg = /"(.*?)"/g;
        let result = string.match(reg);

        if (result == null) {
            throw new Error("failed to parse input");
        }

        if (result.length <= 2) {
            throw new Error("Please add one more item to vote");
        }

        // trim quotes
        result = result.map(item => item.replace(/^"+|"+$/g, ''));

        action.title = result[0];
        result.shift();
        action.items = result;

        action.type = ActionType.ACTION_START_POLL;

        return action;
    }
}