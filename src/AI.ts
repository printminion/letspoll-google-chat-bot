export interface IVoteAction {
    title: string,
    items: string[]
}

export class AI {
    static parseAction(string: string): IVoteAction {
        let action: IVoteAction = {title: undefined, items: []};

        if (!string) {
            throw new Error("non empty input string is required");
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

        return action;
    }
}