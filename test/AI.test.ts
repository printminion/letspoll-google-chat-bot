import {expect} from 'chai';
import {AI} from "../src/AI";


describe("AI", () => {
    describe("parseAction", () => {
        let input;

        it('should throw on empty input', () => {
            input = '';
            expect(() => AI.parseAction(input)).to.throw('non empty input string is required')
        });

        it('should throw on no quotes', () => {
            input = 'title foo bar';
            expect(() => AI.parseAction(input)).to.throw('failed to parse input')
        });

        it('should throw on odd quotes count', () => {
            input = '"title" "foo" "bar" "item';
            expect(() => AI.parseAction(input)).to.throw('failed to parse input - quote match')
        });

        it('should throw on 1 vote items', () => {
            input = '"title" "foo"';
            expect(() => AI.parseAction(input)).to.throw('Please add one more item to vote')
        });

        it('should parse 2 vote items', () => {
            input = '"title" "item 1" "item 2"';
            const result = AI.parseAction(input);

            expect(result.title).to.be.equal("title");
            expect(result.items.length).to.be.equal(2);
        });

        it('should parse 3 vote items', () => {
            input = '"title" "item 1" "item 2" "item 3"';
            const result = AI.parseAction(input);

            expect(result.title).to.be.equal("title");
            expect(result.items.length).to.be.equal(3);
        });
    });
});