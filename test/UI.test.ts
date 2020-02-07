import {expect} from 'chai';
import {chat_v1} from 'googleapis';
import {IVoteAction} from "../src/AI";
import {UI} from "../src/UI";


describe("UI", () => {
    let action: IVoteAction = {title: undefined, items: []};
    describe("createVoteCardMessage", () => {
        beforeEach(() => {

        });

        it('should create message', () => {
            action = {title: "title", items: ["foo", "bar"]};

            const message = UI.createVoteCardMessage(action);

            expect(message.cards.length).equal(1);
            expect(message.cards[0].header.title).equal(action.title);
            expect(message.cards[0].sections.length).equal(1);
            expect(message.cards[0].sections[0].widgets).to.be.an("Array");

            const widgets = message.cards[0].sections[0].widgets;

            expect(widgets.length).equal(action.items.length);

            for (let itemId = 0; itemId < action.items.length; itemId++) {
                expect(widgets[itemId].keyValue.content).equal(action.items[itemId]);
                expect(widgets[itemId].keyValue.button.textButton.text).equal("VOTE");

                expect(widgets[itemId].keyValue.button.textButton.onClick.action).to.have.all.keys('actionMethodName', 'parameters');

                expect(widgets[itemId].keyValue.button.textButton.onClick.action.actionMethodName).equal("vote");

                const parameters = widgets[itemId].keyValue.button.textButton.onClick.action.parameters;

                expect(parameters.length).equal(2);
                expect(parameters[0].key).equal("id");
                expect(parameters[0].value).equal("" + itemId);

                expect(parameters[1].key).equal("voters");
                expect(parameters[1].value).equal("[]");

            }
        });

    });

    describe("updateVoteCardMessage", () => {
        let message: chat_v1.Schema$Message;
        let user: chat_v1.Schema$User;

        beforeEach(() => {
            action = {title: "title", items: ["foo", "item 1", "item 2", "item 3", "item 4"]};
            message = UI.createVoteCardMessage(action);
            user = {
                name: "user/foo",
                displayName: "user 1"
            };
        });

        it('should contain proper data', () => {
            let itemId = 1;
            let result = UI.updateVoteCardMessage(message.cards, user, itemId, true);

            expect(result).to.have.all.keys('actionResponse', 'cards');
            expect(result.actionResponse.type).equal("UPDATE_MESSAGE");
            expect(result.cards.length).equal(1);
            expect(result.cards[0].sections[0].widgets.length).equal(action.items.length);
        });

        it('should patch incoming card with vote', () => {
            let itemId = 1;
            let result = UI.updateVoteCardMessage(message.cards, user, itemId, true);

            const widgets = result.cards[0].sections[0].widgets;
            const parameters = widgets[itemId].keyValue.button.textButton.onClick.action.parameters;

            expect(parameters[1].key).equal("voters");
            expect(parameters[1].value).equal("[\"" + user.name + "\"]");
        });

        it('should remove already casted vote', () => {
            let itemId = 1;
            let result = UI.updateVoteCardMessage(message.cards, user, itemId, true);
            let widgets = result.cards[0].sections[0].widgets;
            let parameters = widgets[itemId].keyValue.button.textButton.onClick.action.parameters;

            expect(parameters[1].key).equal("voters");
            expect(parameters[1].value).equal("[\"" + user.name + "\"]");

            result = UI.updateVoteCardMessage(message.cards, user, itemId, true);

            widgets = result.cards[0].sections[0].widgets;
            parameters = widgets[itemId].keyValue.button.textButton.onClick.action.parameters;

            expect(parameters[1].key).equal("voters");
            expect(parameters[1].value).equal("[]");
        });

        it('should re-cast vote', () => {
            let voteForItemId = 1;
            let result = UI.updateVoteCardMessage(message.cards, user, voteForItemId, true);

            voteForItemId = 2;
            result = UI.updateVoteCardMessage(result.cards, user, voteForItemId, true);

            const widgets = result.cards[0].sections[0].widgets;

            for (let itemId = 0; itemId < widgets.length; itemId++) {
                const parameters = widgets[itemId].keyValue.button.textButton.onClick.action.parameters;

                expect(parameters[1].key).equal("voters");
                if (itemId == voteForItemId) {
                    expect(parameters[1].value).equal("[\"" + user.name + "\"]");
                } else {
                    expect(parameters[1].value).equal("[]");
                }
            }
        });
    });
});