import {expect} from 'chai';
import {onCardClick, onMessage} from "../src/EntryPoint";
import {chat_v1} from "googleapis";
import {Messages} from "../src/Messages";
import * as fixtureDataOnClick from './fixture/onCLick_01.json';

describe("EntryPoint", () => {
    let message: chat_v1.Schema$DeprecatedEvent;
    beforeEach(() => {
        message = {
            space: {
                type: "DM"
            },
            message: {
                text: ""
            }
        };
    });

    describe("onMessage", () => {
        describe("space type DM", () => {
            beforeEach(() => {
                message.space.type = "DM"
            });
            it('should throw on empty input', () => {
                let result = onMessage(message);
                expect(result).to.have.all.keys("text");
                expect(result.text).to.equal(Messages.MESSAGE_HELP);
            });
            it('should answer on "help"', () => {
                message.message.text = " HELP ";
                let result = onMessage(message);
                expect(result).to.have.all.keys("text");
                expect(result.text).to.equal(Messages.MESSAGE_HELP);
            });
        });
        describe("space type ROOM", () => {
            beforeEach(() => {
                message.space.type = "ROOM"
            });

            it('should throw on empty input', () => {
                let result = onMessage(message);
                expect(result).to.have.all.keys("text");
                expect(result.text).to.equal(Messages.MESSAGE_ROOM_NO_INPUT);
            });

            it('should answer on empty message"', () => {
                message.message.text = "@" + Messages.BOT_NAME;
                let result = onMessage(message);
                expect(result).to.have.all.keys("text");
                expect(result.text).to.equal(Messages.MESSAGE_ROOM_NO_INPUT);
            });

            it('should answer on "help"', () => {
                message.message.text = " HELP ";
                let result = onMessage(message);
                expect(result).to.have.all.keys("text");
                expect(result.text).to.equal(Messages.MESSAGE_HELP);
            });
        });
    });


    describe("onCardClick", () => {
        it('should answer on "help"', () => {
            let voteForItemId = parseInt(fixtureDataOnClick.action.parameters[0].value);
            const user = fixtureDataOnClick.user;

            let result = onCardClick(fixtureDataOnClick);
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
    })
});