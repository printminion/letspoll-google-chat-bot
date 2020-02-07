import {chat_v1} from "googleapis";
import {IVoteAction} from "./AI";

export class UI {
    static createVoteCardMessage(voteAction: IVoteAction): chat_v1.Schema$Message {
        let message: chat_v1.Schema$Message;
        message = {
            cards: [
                {
                    header: {
                        title: voteAction.title
                    },
                    sections: [{
                        widgets: []
                    }]
                }
            ]
        };


        let voteSection: chat_v1.Schema$KeyValue;
        voteSection =
            {
                content: "item 1",
                // bottomLabel: "██████████ 0%",
                button: {
                    textButton: {
                        text: "VOTE",
                        onClick: {
                            action: {
                                actionMethodName: "vote",
                                parameters: [
                                    {
                                        key: "id",
                                        value: "0"
                                    },
                                    {
                                        key: "voters",
                                        value: "[]"
                                    }
                                ]
                            }
                        }
                    }
                }
                // button: {
                //     textButton: {
                //         text: "vote",
                //         // onClick: {
                //         //     action: {
                //         //         actionMethodName: "vote",
                //         //         parameters: [
                //         //             {
                //         //                 key: "sdfsf",
                //         //                 value: "sfdsf"
                //         //             }
                //         //         ]
                //         //     }
                //         // }
                //     }
                // }
            };

        let newVoteSection = voteSection;

        for (let index = 0; index < voteAction.items.length; index++) {
            const value = voteAction.items[index];
            newVoteSection = JSON.parse(JSON.stringify(voteSection));
            newVoteSection.content = value;
            newVoteSection.button.textButton.onClick.action.parameters[0].value = "" + index;

            message.cards[0].sections[0].widgets.push({
                keyValue: newVoteSection
            });
        }

        // Logger.log(JSON.stringify(message));
        console.log("message", JSON.stringify(message));

        return message;
    }

    /**
     * Create and return a new interactive card or update an existing one.
     * @param cards
     * @param user
     * @param voteForItemId
     * @param {boolean} shouldUpdate Update existing or create new card?
     * @return {chat_v1.Schema$Message} actual JSON payload to return to Hangouts Chat
     * @see developers.google.com/hangouts/chat/concepts/cards
     */
    static updateVoteCardMessage(cards: chat_v1.Schema$Card[], user: chat_v1.Schema$User, voteForItemId: number, shouldUpdate?: boolean): chat_v1.Schema$Message {
        let newCard = cards;
        let voteWasRemoved = false;

        // remove old vote
        for (let VoteItemId = 0; VoteItemId < cards[0].sections[0].widgets.length; VoteItemId++) {
            const widget = cards[0].sections[0].widgets[VoteItemId];
            let oldUserVotes = widget.keyValue.button.textButton.onClick.action.parameters[1].value;

            if (oldUserVotes === "[]") {
                continue;
            }

            let users = JSON.parse(oldUserVotes);
            let filtered = users.filter(function (userName, index, arr) {
                return userName !== user.name;
            });

            const newUserVotes = JSON.stringify(filtered);

            if (oldUserVotes == newUserVotes) {
                continue;
            }

            if (voteForItemId == VoteItemId) {
                voteWasRemoved = true;
            }

            widget.keyValue.button.textButton.onClick.action.parameters[1].value = newUserVotes;
        }

        if (!voteWasRemoved) {
            // add new vote
            const widget = cards[0].sections[0].widgets[voteForItemId];
            let value = widget.keyValue.button.textButton.onClick.action.parameters[1].value;
            let values = JSON.parse(value);
            values.push(user.name);
            value = JSON.stringify(values);
            widget.keyValue.button.textButton.onClick.action.parameters[1].value = value;
        }

        // count stats
        let allVotes = [];
        let allVotesCount = 0;
        for (let voteItemId = 0; voteItemId < cards[0].sections[0].widgets.length; voteItemId++) {
            const widget = cards[0].sections[0].widgets[voteItemId];
            const votes = widget.keyValue.button.textButton.onClick.action.parameters[1].value;

            if (votes == "[]") {
                allVotes.push(0);
                continue;
            }

            const votesInCategory: Array<string> = JSON.parse(votes);
            allVotes.push(votesInCategory.length);
            allVotesCount = allVotesCount + votesInCategory.length;
        }

        for (let voteItemId = 0; voteItemId < cards[0].sections[0].widgets.length; voteItemId++) {
            const widget = cards[0].sections[0].widgets[voteItemId];
            const value = allVotes[voteItemId];
            widget.keyValue.bottomLabel = UI.renderProgressbar(allVotesCount, value);
        }

        return {
            actionResponse: {
                type: shouldUpdate ? 'UPDATE_MESSAGE' : 'NEW_MESSAGE'
            },
            cards: newCard
        };
    }

    static renderProgressbar(total: number, value: number): string {
        const totalBlocksToDisplay = 10;
        let blocksToDisplay = 0;
        let blocksToFillIn = totalBlocksToDisplay;
        let percent = 0;

        if (total > 0 && value > 0) {
            percent = value / (total / 100);
            blocksToDisplay = (percent / (100 / totalBlocksToDisplay));
            blocksToDisplay = Math.ceil(blocksToDisplay);
            blocksToFillIn = totalBlocksToDisplay - blocksToDisplay;
        }

        const progressBar = "█".repeat(blocksToDisplay) + "░".repeat(blocksToFillIn);

        return progressBar + " " + percent + "% (" + value + ")";
    }
}